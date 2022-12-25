import AddIcon from '@mui/icons-material/Add';
import { Box, Button, CircularProgress, Divider, Grid, TextField } from "@mui/material";
import { useEffect, useState } from 'react';
import RemoveIcon from '@mui/icons-material/Remove';
import Collapse from 'react-collapse';
import moment from 'moment';
import PriceDiscount from 'LogicResolve/PriceDiscount';
import { getOrderStatus } from 'utils/logicUntils';
import OrderAPI from 'apis/OrderAPI'
import ProductAPI from 'apis/ProductAPI'
import ImportExportIcon from '@mui/icons-material/ImportExport';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import CheckIcon from '@mui/icons-material/Check';
import CancelIcon from '@mui/icons-material/Cancel';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { getUser } from 'hooks/localAuth';
import { confirmCancelOrder, confirmDeliveryOrder, confirmPaymentToSeller, confirmReturnedOrder, confirmReturnOrder, getAllTransactionOrder, handleWithDrawForBuyerWhenSellerNotConfirm, handleWithDrawForSellerWhenDeliveryExpired, handleWithDrawForBuyerWhenReturnExpired } from 'apis/contractAPI/OrderAPI';
import { getContract } from 'helpers';
import { useLibrary } from 'hooks/contract';
import { useWeb3React } from '@web3-react/core';
import { injected } from 'components/Wallet';
import ETHIcon from "../../assets/icons/ethereum-eth.svg";
import useNotification from 'hooks/notification';
import WarningIcon from '@mui/icons-material/Warning';
import Timeline from './Timeline';
import { CheckExpiredToken } from 'utils/authUtil';

const OrderDetail  = ({order, orderType, loadingEvent, setLoadingEvent, title, setTitle, activeOrder, setActiveOrder}) => {
    const library = useLibrary()
	const { active, activate, error } = useWeb3React();
    const [isExpand, setIsExpand] = useState(false)
    const [fetchTransaction, setFetchTransaction] = useState(false)
    const [detailOrder, setDetailOrder] = useState({})
    const [loading, setLoading] = useState(false)
    const [statusKey, setStatusKey] = useState(Number(order?.state))
    const [transactions, setTransactions] = useState([])

    const isBuyer = order?.buyer?.toLowerCase() === getUser()?.walletAddress?.toLowerCase()
    const isExpired = Number(order?.dealine) < moment(Date.now()).toDate().getTime()

    useEffect(()=> {
        if(!isExpand) return 
        const getDetailFromDB = async() => {
            setLoading(true)
            const contractOrder = await getContractOrder() 
            await CheckExpiredToken()
            await OrderAPI.getOrderByAddress(order?.orderAddress, {buyer: order?.buyer, seller: order?.seller}).then(async(res)=> {
                setDetailOrder(res?.data?.order)
                await getAllTransactionOrder(contractOrder).then((res)=> {
                    console.log(res);
                    setTransactions([...res])
                }).catch((e)=> {
                    console.log({e});
                })
            })
            .then(()=> setLoading(false))
            .catch(()=> setLoading(false))
        }
        getDetailFromDB()
    }, [isExpand, fetchTransaction])  
    
    useEffect(()=> {
        if (active) {
            return;
        }
        try {
        activate(injected);
        } catch (ex) {
        console.log(ex);
        }
    }, [active])

    const getContractOrder = async () => {
		return await getContract(library, order?.orderAddress, "Order");
	};

    console.log({detailOrder});

    // const returnProductToSeller = async() => {
    //     const data = {
    //         orderAddress: order.orderAddress,
    //     };
    //     await ProductAPI.returnProductToSeller(data).then((res)=> {
    //         console.log(res);
    //     }).catch((e)=> {
    //         console.log(e);
    //     })
    // }

    const handleConfirmOrder = async() => {
        if(!isExpand) {
            await checkExpand()
            return
        }
        setLoadingEvent(true)
        setActiveOrder(order?.orderAddress)
        setTitle('Đang xác nhận đơn xuất kho')
        const contract = await getContractOrder()
        await confirmDeliveryOrder(contract, order?.seller, moment(Date.now()).add(5, 'minutes').toDate().getTime()).then((res)=> {
            console.log({res});
            useNotification.Success({
                title: "Thành công",
                message: "Xác nhận đơn hàng xuất kho thành công!",
                duration: 3000,
              });
            setStatusKey(1)
            setLoadingEvent(false)
            setFetchTransaction(true)
        }).catch(()=> {
            useNotification.Error({
                title: "Thất bại",
                message: "Xác nhận đơn hàng xuất kho không thành công!",
                duration: 3000,
              });  
            setLoadingEvent(false)
        })
    }

    const handlePaymentToSeller = async() => {
        if(!isExpand) {
            await checkExpand()
            return
        }
        setLoadingEvent(true)
        setActiveOrder(order?.orderAddress)
        setTitle('Đang gửi tiền cho công ty xuất kho.')
        const contract = await getContractOrder()
        await confirmPaymentToSeller(contract, order?.buyer).then(async(res)=> {
            console.log({res});
            const data = {
                orderAddress: order.orderAddress,
                buyerId: detailOrder?.details[0]?.buyer?._id
            };
            await CheckExpiredToken()
            await ProductAPI.createProductsWhenPayment(data).then((res)=> {
                console.log(res);
                useNotification.Success({
                    title: "Thành công",
                    message: "Hoàn tất thanh toán tiền cho công ty xuất kho!",
                    duration: 3000,
                  });
                }).catch((e)=> {
                    console.log(e);
                })
            setStatusKey(3)
            setLoadingEvent(false)
            setFetchTransaction(true)
        }).catch((e)=> {
            console.log(e);
            useNotification.Error({
                title: "Thất bại",
                message: "Xác nhận gửi tiền cho công ty xuất kho thất bại!",
                duration: 3000,
              });
            setLoadingEvent(false)
        })
    }

    const handleCancelOrder = async() => {
        if(!isExpand) {
            await checkExpand()
            return
        }
        setLoadingEvent(true)
        setActiveOrder(order?.orderAddress)
        setTitle('Đang xác nhận hủy đơn xuất kho')
        const contract = await getContractOrder()
        await confirmCancelOrder(contract, order?.seller).then(async(res)=> {
            console.log({res});
            const data = {
                orderAddress: order.orderAddress,
            };
            await CheckExpiredToken()
            await ProductAPI.returnProductToSeller(data).then((res)=> {
                console.log(res);
                useNotification.Success({
                    title: "Thành công",
                    message: "Xác nhận hủy đơn xuất kho thành công!",
                    duration: 3000,
                });
            }).catch((e)=> {
                console.log(e);
            })
            setStatusKey(2)
            setLoadingEvent(false)
            setFetchTransaction(true)
        }).catch(()=> {
            useNotification.Error({
                title: "Thất bại",
                message: "Xác nhận hủy đơn xuất kho không thành công!",
                duration: 3000,
              });
            setLoadingEvent(false)
        })
    } 

    const handleReturnOrder = async() => {
        if(!isExpand) {
            await checkExpand()
            return
        }
        setLoadingEvent(true)
        setActiveOrder(order?.orderAddress)
        setTitle('Đang xác nhận hoàn trả đơn hàng nhập kho.')
        const contract = await getContractOrder()
        await confirmReturnOrder(contract, order?.buyer, moment(Date.now()).add(15, 'days').toDate().getTime()).then((res)=> {
            console.log({res});
            useNotification.Success({
                title: "Thành công",
                message: "Xác nhận hoàn trả thành công!",
                duration: 3000,
              });
            setStatusKey(4)
            setLoadingEvent(false)
            setFetchTransaction(true)
        }).catch(()=> {
            useNotification.Error({
                title: "Thất bại",
                message: "Xác nhận hoàn trả không thành công!",
                duration: 3000,
              });
            setLoadingEvent(false)
        })
    } 

    const handleConfirmReceiveReturnOrder = async() => {
        if(!isExpand) {
            await checkExpand()
            return
        }
        setLoadingEvent(true)
        setActiveOrder(order?.orderAddress)
        setTitle('Đang xác nhận đã nhận được đơn hàng hoàn trả.')
        const contract = await getContractOrder()
        await confirmReturnedOrder(contract, order?.seller).then(async(res)=> {
            console.log({res});
            const data = {
                orderAddress: order.orderAddress,
            };
            await CheckExpiredToken()
            await ProductAPI.returnProductToSeller(data).then((res)=> {
                console.log(res);
                useNotification.Success({
                    title: "Thành công",
                    message: "Xác nhận đã nhận được hàng hoàn trả thành công!",
                    duration: 3000,
                  });
            }).catch((e)=> {
                console.log(e);
            })    
            setStatusKey(5)
            setLoadingEvent(false)
            setFetchTransaction(true)
        }).catch(()=> {
            useNotification.Error({
                title: "Thất bại",
                message: "Xác nhận đã nhận được hàng hoàn trả không thành công!",
                duration: 3000,
              });
            setLoadingEvent(false)
        })
    } 

    const withDrawForBuyerWhenSellerNotConfirm = async() => {
        if(!isExpand) {
            await checkExpand()
            return
        }
        console.log('wating');
        setLoadingEvent(true)
        setActiveOrder(order?.orderAddress)
        setTitle('Đang xác nhận hủy và rút tiền vì công ty xuất kho quá hạn xác nhận đơn hàng.')
        const contract = await getContractOrder()
        await handleWithDrawForBuyerWhenSellerNotConfirm(contract, order?.buyer).then(async(res)=> {
            console.log({res});
            const data = {
                orderAddress: order.orderAddress,
            };
            await CheckExpiredToken()
            await ProductAPI.returnProductToSeller(data).then((res)=> {
                console.log(res);
                useNotification.Success({
                    title: "Thành công",
                    message: "Xác nhận hủy và rút tiền vì công ty xuất kho quá hạn xác nhận đơn hàng thành công!",
                    duration: 3000,
                  });
            }).catch((e)=> {
                console.log(e);
            })
            setStatusKey(2)
            setLoadingEvent(false)
            setFetchTransaction(true)
        }).catch((e)=> {
            console.log({e});
            useNotification.Error({
                title: "Thất bại",
                message: "Xác nhận hủy và rút tiền vì công ty xuất kho quá hạn xác nhận đơn hàng không thành công!",
                duration: 3000,
              });
            setLoadingEvent(false)
        })
    }

    const withDrawForSellerWhenDeliveryExpired = async() => {
        if(!isExpand) {
            await checkExpand()
            return
        }
        setLoadingEvent(true)
        setActiveOrder(order?.orderAddress)
        setTitle('Đang xác nhận rút tiền khi thời gian vận chuyển hàng hết hạn.')
        const contract = await getContractOrder()
        await handleWithDrawForSellerWhenDeliveryExpired(contract, order?.seller).then(async(res)=> {
            console.log({res});
            const data = {
                orderAddress: order.orderAddress,
                buyerId: detailOrder?.details[0]?.buyer?._id
            };
            await CheckExpiredToken()
            await ProductAPI.createProductsWhenPayment(data).then((res)=> {
                console.log(res);
                useNotification.Success({
                    title: "Thành công",
                    message: "Hoàn tất xác nhận thanh toán và rút tiền!",
                    duration: 3000,
                  });
                }).catch((e)=> {
                    console.log(e);
                })
            setStatusKey(3)
            setLoadingEvent(false)
            setFetchTransaction(true)
        }).catch(()=> {
            useNotification.Error({
                title: "Thất bại",
                message: "Xác nhận rút tiền khi thời gian vận chuyển hàng hết hạn không thành công!",
                duration: 3000,
              });
            setLoadingEvent(false)
        })
    }

    const withDrawForBuyerWhenReturnExpired = async() => {
        if(!isExpand) {
            await checkExpand()
            return
        }
        setLoadingEvent(true)
        setActiveOrder(order?.orderAddress)
        setTitle('Đang xác nhận rút tiền khi thời gian hoàn trả hàng hết hạn.')
        const contract = await getContractOrder()
        await handleWithDrawForBuyerWhenReturnExpired(contract, order?.buyer).then(async(res)=> {
            console.log({res});
            const data = {
                orderAddress: order.orderAddress,
            };
            await CheckExpiredToken()
            await ProductAPI.returnProductToSeller(data).then((res)=> {
                console.log(res);
                useNotification.Success({
                    title: "Thành công",
                    message: "Xác nhận rút tiền khi thời gian hoàn trả hàng hết hạn thành công!",
                    duration: 3000,
                  });
            }).catch((e)=> {
                console.log(e);
            })
            setStatusKey(5)
            setLoadingEvent(false)
            setFetchTransaction(true)
        }).catch(()=> {
            useNotification.Error({
                title: "Thất bại",
                message: "Xác nhận rút tiền rút tiền khi thời gian hoàn trả hàng hết hạn không thành công!",
                duration: 3000,
              });
            setLoadingEvent(false)
        })
    }

    const renderButtonAction = () => {
        const status = getOrderStatus(statusKey)
        switch (status) {
            case 'PENDING':
                if(!isBuyer)
                return (
                    <>
                        <Button variant="contained" color="warning" onClick={handleConfirmOrder}>
                            XÁC NHẬN
                        </Button>
                        <Button variant="contained" color="error" onClick={handleCancelOrder}>
                            HỦY ĐƠN
                        </Button>
                    </>
                )
                
                if(isBuyer && isExpired) {
                    return(
                        <>
                            <Button variant="contained" color="warning" onClick={withDrawForBuyerWhenSellerNotConfirm}>
                                HỦY ĐƠN & HOÀN TIỀN
                            </Button>
                        </>
                    )
                }
                break;
            case 'CONFIRMED':
                if(isBuyer) 
                return (
                    <>
                        <Button variant="contained" color="info" onClick={handlePaymentToSeller}>
                            THANH TOÁN
                        </Button>
                        <Button variant="contained" color="inherit" onClick={handleReturnOrder}>
                            HOÀN TRẢ HÀNG
                        </Button>
                    </>
                )
                if(!isBuyer && isExpired) {
                    return (
                        <>
                            <Button variant="contained" color="warning" onClick={withDrawForSellerWhenDeliveryExpired}>
                                XÁC NHẬN THANH TOÁN VÀ RÚT TIỀN
                            </Button>
                        </>
                    )
                }
                break;
            case 'RETURN':
                if(!isBuyer)
                return (
                    <>
                        <Button variant="contained" color="secondary" onClick={handleConfirmReceiveReturnOrder}>
                            ĐÃ NHẬN ĐƯỢC HÀNG HOÀN TRẢ
                        </Button>
                    </>
                ) 
                if(isExpired && isExpired) {
                    return (
                        <>
                            <Button variant="contained" color="secondary" onClick={withDrawForBuyerWhenReturnExpired}>
                                XÁC NHẬN ĐÃ HOÀN TRẢ VÀ HOÀN TIỀN
                            </Button>
                        </>
                    )
                }
                break;
            default:
                return (<></>)
                break;
        }
    }

    const renderButtonStatus = () => {
        const status = getOrderStatus(statusKey)
        switch (status) {
            case 'PENDING':
                return (
                    <Button variant="outlined" color="warning">
                        CHỜ XÁC NHẬN <MoreHorizIcon />
                    </Button>
                )
                break;
            case 'CONFIRMED':
                return (
                    <Button variant="outlined" color="info">
                        ĐÃ XÁC NHẬN <CheckIcon />
                    </Button>
                )
            case 'CANCEL':
                return (
                    <Button variant="outlined" color="error">
                        ĐÃ HỦY <CancelIcon />
                    </Button>
                )
                break;
            case 'SUCCESS':
                return (
                    <Button variant="outlined" color="success">
                        THÀNH CÔNG <DoneAllIcon />
                    </Button>
                )
                break;
            case 'RETURN':
                return (
                    <Button variant="outlined" color="secondary">
                        ĐANG HOÀN TRẢ <KeyboardReturnIcon />
                    </Button>
                )
                break;
            case 'RETURNED':
                return (
                    <Button variant="outlined" color="primary">
                        ĐÃ HOÀN TRẢ <FileDownloadIcon />
                    </Button>
                )
                break;
        }
    }

    const renderTextExpired = () => {
        const status = getOrderStatus(statusKey)
        if(status === 'PENDING') {
            if(isBuyer) return 'Đơn hàng đã quá hạn xác nhận hoặc hủy đơn. Bạn có thể xác nhận hủy đơn và rút tiền từ hóa đơn!'
            if(!isBuyer) return 'Đơn hàng đã quá hạn xác nhận hoặc hủy đơn sau 5 ngày lập đơn'
        }
        if(status === 'CONFIRMED') {
            if(!isBuyer) return 'Đơn hàng đã quá hạn vận chuyển. Bạn có thể xác nhận thanh toán và rút tiền đơn hàng từ hóa đơn!'
            if(isBuyer) return 'Đơn hàng đã quá hạn vận chuyển sau 15 ngày xác nhận đơn'
        }
        if(status === 'RETURN') {
            if(isBuyer) return 'Đơn hàng đã quá hạn hoàn trả. Bạn có thể xác nhận đã hoàn trả thành công và rút tiền từ hóa đơn!'
            if(!isBuyer) return 'Đơn hàng đã quá hạn hoàn trả sau 15 ngày xác nhận hoàn trả'
        }
    }

    const renderTextSuggest = () => {
        const status = getOrderStatus(statusKey)
        if(status === 'PENDING') {
            if(isBuyer) return 'Hạn xác nhận hoặc hủy đơn sau 5 ngày. Bạn có thể hoàn tiền của mình sau 5 ngày khi đơn chưa được xác nhận hoặc hủy đơn!'
            if(!isBuyer) return 'Hạn xác nhận hoặc hủy đơn sau 5 ngày lập đơn. Vui lòng xác nhận hoặc hủy đơn đúng hạn!'
        }
        if(status === 'CONFIRMED') {
            if(!isBuyer) return 'Hạn thanh toán hoặc xác nhận hoàn trả sau 15 ngày. Bạn có thể rút tiền của mình sau 15 ngày nếu đơn chưa thanh toán hoặc xác nhận hoàn trả!'
            if(isBuyer) return 'Hạn thanh toán hoặc xác nhận hoàn trả sau 15 ngày xác nhận. Vui lòng thành toàn hoặc xác nhận hoàn trả đúng hạn!'
        }
        if(status === 'RETURN') {
            if(isBuyer) return 'Hạn xác nhận hoàn trả thành công sau 15 ngày. Bạn có thể hoàn tiền của mình sau 15 ngày khi đơn chưa xác nhận đã nhận được hàng hoàn trả!'
            if(!isBuyer) return 'Hạn đã nhận được hàng hoàn trả sau 15 ngày kể từ khi xác nhận hoàn trả. Vui lòng xác nhận nhận được hàng hoàn trả đúng hạn!'
        }
        
    }

    const isRenderWarning = getOrderStatus(statusKey) === 'PENDING' || getOrderStatus(statusKey) === 'CONFIRMED' || getOrderStatus(statusKey) == 'RETURN'

    const checkExpand = async () => {
        return useNotification.Error({
            title: "Cảnh báo",
            message: "Vui lòng xem chi tiết để thực hiện xác nhận!",
            duration: 3000,
          });
    }

    return (
        <div className="order-detail">
            <div className='content-header'>
                <div>
                    <h3>Địa chỉ ví đơn hàng:</h3>
                    <span>{order?.orderAddress}</span>
                </div>
                <div className='status-order'>
                    <label>Trạng thái: </label>
                    {
                        renderButtonStatus()
                    }
                </div>
            </div>
            <Divider style={{ margin: '20px 0' }} />
            <div className='content-top' >
                <Grid container spacing={2} style={{marginTop: 10}}>
                    <Grid item container xs={6} spacing={2} style={{borderRight: '1px solid rgba(0, 0, 0, 0.09)', paddingTop: 0}}>
                        {
                            !isBuyer ? 
                            <>
                                <Grid item xs={12}>
                                    <div className='info-user'>
                                        <label>Địa chỉ ví công ty nhập kho: </label>
                                        <span>{order.buyer}</span>
                                    </div>
                                </Grid>
                                <Grid item xs={12} style={{display: 'flex', justifyContent: 'left'}}>
                                    <Button variant="outlined" color="warning" style={{fontWeight: 700, background: '#44c176', color: '#fff', borderRadius: 20}}>
                                        <ImportExportIcon />
                                        ĐƠN XUẤT KHO
                                    </Button>
                                </Grid>
                            </> : <>
                                <Grid item xs={12}>
                                    <div className='info-user'>
                                        <label>Địa chỉ công ty xuất kho: </label>
                                        <span>{order?.seller}</span>
                                    </div>
                                </Grid>
                                <Grid item xs={12} style={{display: 'flex', justifyContent: 'left'}}>
                                    <Button variant="outlined" color="warning" disabled style={{fontWeight: 700, background: '#44c176', color: '#fff', borderRadius: 20}}>
                                        <ImportExportIcon />
                                        ĐƠN NHẬP KHO
                                    </Button>
                                </Grid>
                            </>
                        }
                        {
                            isRenderWarning && (
                                isExpired ? 
                                <Grid item xs={12}>
                                    <div className='info-user'>
                                        <WarningIcon fontSize='large' color='error'/>
                                        <span style={{color: 'red', textAlign:'left', marginLeft: 5}}>{renderTextExpired()}</span>
                                    </div>
                                </Grid> :
                                <Grid item xs={12}>
                                    <div className='info-user'>
                                        <WarningIcon fontSize='large' htmlColor='#F2C22F'/>
                                        <span style={{color: '#F2C22F', textAlign:'left', marginLeft: 5}}>{renderTextSuggest()}</span>
                                    </div>
                                </Grid>

                            )
                        }
                    </Grid>
                    <Grid item container xs={2} style={{borderRight: '1px solid rgba(0, 0, 0, 0.09)', marginTop: '-10px'}}>
                        <div className='col-order'>
                            <label>Ngày lập đơn</label>
                            <span style={{color: 'tomato'}}>{moment(Number(order?.purchaseTime)*1000).format("DD-MM-YYYY LTS")}</span>
                        </div>        
                    </Grid>
                    <Grid item container xs={2} style={{borderRight: '1px solid rgba(0, 0, 0, 0.09)', marginTop: '-10px'}}>
                        <div className='col-order'>
                            <label className='col-order'>Tổng sản phẩm</label>
                            <span>{order?.totalProduct}</span>
                        </div>
                    </Grid>
                    <Grid item container xs={2} style={{borderRight: '1px solid rgba(0, 0, 0, 0.09)', marginTop: '-10px'}}>
                        <div className='col-order'>
                            <label className='col-order'>Tổng thanh toán</label>
                            <span className='total-price'>
                                <img src={ETHIcon} alt='' style={{ width: 35, height: 35, marginRight: 5 }}/>
                                <span>{parseFloat((order?.totalPrice)/1000000000000000000)}</span>ETH
                            </span>
                        </div>
                    </Grid>
                </Grid>
                <div className="action-collapse" onClick={()=> setIsExpand(!isExpand)}>
                    {
                        isExpand ? <RemoveIcon htmlColor='#fff'/> : <AddIcon htmlColor='#fff'/>
                    }
                </div>
            </div>
            <Divider style={{ margin: '10px 0' }} />
            {
                loading ? 
                <Box sx={{ display: 'flex', height: 500, alignItems: 'center', justifyContent: 'center'}}>
                    <CircularProgress/>
                </Box> : 
                <div className='content-bottom'>
                    <Collapse isOpened={isExpand}>
                        <div className='collapse-container'>
                            <Grid container spacing={2} style={{marginTop: 10}}>
                            <Grid item xs={6} style={{borderRight: '1px solid rgba(0, 0, 0, 0.09)', position: 'relative'}}>
                                <Timeline 
                                    order={order} 
                                    library={library} 
                                    transactions={transactions} 
                                    isExpired={isExpired} 
                                    detailOrder={detailOrder}
                                    isBuyer={isBuyer}
                                    fetchTransaction={fetchTransaction}
                                    setDetailOrder={setDetailOrder}
                                />
                            </Grid>
                            <Grid item xs={6} style={{marginTop: '-30px'}}>
                                <div className='info-user'>
                                    <h3 style={{marginLeft: 10, marginBottom: 5}} className='text-monospace'>CHI TIẾT</h3>
                                    <div className='info-address'>
                                        <label>Công ty xuất kho: </label>
                                        <span>{detailOrder?.details?.[0].seller?.companyName}</span>
                                    </div>
                                    <div className='info-address'>
                                        <label>Địa chỉ giao hàng: </label>
                                        <span>{detailOrder?.address}</span>
                                    </div>
                                    <div className='info-address'>
                                        <label>Điện thoại liên hệ: </label>
                                        <span>{detailOrder?.phoneNumber || '0395260327'}</span>
                                    </div>
                                    <Grid item xs={11}>
                                        <TextField
                                            variant="outlined"
                                            required
                                            multiline
                                            fullWidth
                                            id="note"
                                            label="Ghi chú đơn hàng"
                                            name="note"
                                            autoComplete="note"
                                            rows={2}
                                            maxRows={2}
                                            style={{background: '#fff', marginLeft: 20, marginBottom: 10}}
                                            value={detailOrder?.note || 'Không có ghi chú'}
                                        />
                                    </Grid>
                                    <div className="wrapper-payment__info">
                                        <div style={{display: 'flex', flexDirection: 'column', width: '100%'}}>
                                            {
                                                detailOrder?.details?.map((product, idx)=> {
                                                    return (
                                                        <div className="product-item" key={idx}>
                                                            <div className="product-name">
                                                                <span className="name">
                                                                    {product.product?.productName}
                                                                </span>
                                                                <span className="total-count">
                                                                    x {product?.quantity}
                                                                </span>
                                                            </div>
                                                            <div className="view-price">
                                                                <PriceDiscount valueDiscount={0} valuePrice={parseFloat(product?.priceDis*product?.quantity)} />
                                                            </div>
                                                        </div>
                                                    )
                                                })
                                            }
                                        </div>
                                    </div>
                                </div>
                            </Grid>
                            </Grid>
                        </div>
                    </Collapse>
                </div>
            }
            <div className='content-footer'>
                {
                    (activeOrder?.toLowerCase() === order?.orderAddress?.toLowerCase() && loadingEvent )
                    ? <CircularProgress color="warning" size={30} sx={{marginRight: '10px'}}/> : <></> 
                }
                {renderButtonAction()}
            </div>
        </div>
    )
}

export default OrderDetail