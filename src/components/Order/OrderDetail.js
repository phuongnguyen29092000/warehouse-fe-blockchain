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
        setTitle('??ang x??c nh???n ????n xu???t kho')
        const contract = await getContractOrder()
        await confirmDeliveryOrder(contract, order?.seller, moment(Date.now()).add(5, 'minutes').toDate().getTime()).then((res)=> {
            console.log({res});
            useNotification.Success({
                title: "Th??nh c??ng",
                message: "X??c nh???n ????n h??ng xu???t kho th??nh c??ng!",
                duration: 3000,
              });
            setStatusKey(1)
            setLoadingEvent(false)
            setFetchTransaction(true)
        }).catch(()=> {
            useNotification.Error({
                title: "Th???t b???i",
                message: "X??c nh???n ????n h??ng xu???t kho kh??ng th??nh c??ng!",
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
        setTitle('??ang g???i ti???n cho c??ng ty xu???t kho.')
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
                    title: "Th??nh c??ng",
                    message: "Ho??n t???t thanh to??n ti???n cho c??ng ty xu???t kho!",
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
                title: "Th???t b???i",
                message: "X??c nh???n g???i ti???n cho c??ng ty xu???t kho th???t b???i!",
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
        setTitle('??ang x??c nh???n h???y ????n xu???t kho')
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
                    title: "Th??nh c??ng",
                    message: "X??c nh???n h???y ????n xu???t kho th??nh c??ng!",
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
                title: "Th???t b???i",
                message: "X??c nh???n h???y ????n xu???t kho kh??ng th??nh c??ng!",
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
        setTitle('??ang x??c nh???n ho??n tr??? ????n h??ng nh???p kho.')
        const contract = await getContractOrder()
        await confirmReturnOrder(contract, order?.buyer, moment(Date.now()).add(15, 'days').toDate().getTime()).then((res)=> {
            console.log({res});
            useNotification.Success({
                title: "Th??nh c??ng",
                message: "X??c nh???n ho??n tr??? th??nh c??ng!",
                duration: 3000,
              });
            setStatusKey(4)
            setLoadingEvent(false)
            setFetchTransaction(true)
        }).catch(()=> {
            useNotification.Error({
                title: "Th???t b???i",
                message: "X??c nh???n ho??n tr??? kh??ng th??nh c??ng!",
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
        setTitle('??ang x??c nh???n ???? nh???n ???????c ????n h??ng ho??n tr???.')
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
                    title: "Th??nh c??ng",
                    message: "X??c nh???n ???? nh???n ???????c h??ng ho??n tr??? th??nh c??ng!",
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
                title: "Th???t b???i",
                message: "X??c nh???n ???? nh???n ???????c h??ng ho??n tr??? kh??ng th??nh c??ng!",
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
        setTitle('??ang x??c nh???n h???y v?? r??t ti???n v?? c??ng ty xu???t kho qu?? h???n x??c nh???n ????n h??ng.')
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
                    title: "Th??nh c??ng",
                    message: "X??c nh???n h???y v?? r??t ti???n v?? c??ng ty xu???t kho qu?? h???n x??c nh???n ????n h??ng th??nh c??ng!",
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
                title: "Th???t b???i",
                message: "X??c nh???n h???y v?? r??t ti???n v?? c??ng ty xu???t kho qu?? h???n x??c nh???n ????n h??ng kh??ng th??nh c??ng!",
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
        setTitle('??ang x??c nh???n r??t ti???n khi th???i gian v???n chuy???n h??ng h???t h???n.')
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
                    title: "Th??nh c??ng",
                    message: "Ho??n t???t x??c nh???n thanh to??n v?? r??t ti???n!",
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
                title: "Th???t b???i",
                message: "X??c nh???n r??t ti???n khi th???i gian v???n chuy???n h??ng h???t h???n kh??ng th??nh c??ng!",
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
        setTitle('??ang x??c nh???n r??t ti???n khi th???i gian ho??n tr??? h??ng h???t h???n.')
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
                    title: "Th??nh c??ng",
                    message: "X??c nh???n r??t ti???n khi th???i gian ho??n tr??? h??ng h???t h???n th??nh c??ng!",
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
                title: "Th???t b???i",
                message: "X??c nh???n r??t ti???n r??t ti???n khi th???i gian ho??n tr??? h??ng h???t h???n kh??ng th??nh c??ng!",
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
                            X??C NH???N
                        </Button>
                        <Button variant="contained" color="error" onClick={handleCancelOrder}>
                            H???Y ????N
                        </Button>
                    </>
                )
                
                if(isBuyer && isExpired) {
                    return(
                        <>
                            <Button variant="contained" color="warning" onClick={withDrawForBuyerWhenSellerNotConfirm}>
                                H???Y ????N & HO??N TI???N
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
                            THANH TO??N
                        </Button>
                        <Button variant="contained" color="inherit" onClick={handleReturnOrder}>
                            HO??N TR??? H??NG
                        </Button>
                    </>
                )
                if(!isBuyer && isExpired) {
                    return (
                        <>
                            <Button variant="contained" color="warning" onClick={withDrawForSellerWhenDeliveryExpired}>
                                X??C NH???N THANH TO??N V?? R??T TI???N
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
                            ???? NH???N ???????C H??NG HO??N TR???
                        </Button>
                    </>
                ) 
                if(isExpired && isExpired) {
                    return (
                        <>
                            <Button variant="contained" color="secondary" onClick={withDrawForBuyerWhenReturnExpired}>
                                X??C NH???N ???? HO??N TR??? V?? HO??N TI???N
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
                        CH??? X??C NH???N <MoreHorizIcon />
                    </Button>
                )
                break;
            case 'CONFIRMED':
                return (
                    <Button variant="outlined" color="info">
                        ???? X??C NH???N <CheckIcon />
                    </Button>
                )
            case 'CANCEL':
                return (
                    <Button variant="outlined" color="error">
                        ???? H???Y <CancelIcon />
                    </Button>
                )
                break;
            case 'SUCCESS':
                return (
                    <Button variant="outlined" color="success">
                        TH??NH C??NG <DoneAllIcon />
                    </Button>
                )
                break;
            case 'RETURN':
                return (
                    <Button variant="outlined" color="secondary">
                        ??ANG HO??N TR??? <KeyboardReturnIcon />
                    </Button>
                )
                break;
            case 'RETURNED':
                return (
                    <Button variant="outlined" color="primary">
                        ???? HO??N TR??? <FileDownloadIcon />
                    </Button>
                )
                break;
        }
    }

    const renderTextExpired = () => {
        const status = getOrderStatus(statusKey)
        if(status === 'PENDING') {
            if(isBuyer) return '????n h??ng ???? qu?? h???n x??c nh???n ho???c h???y ????n. B???n c?? th??? x??c nh???n h???y ????n v?? r??t ti???n t??? h??a ????n!'
            if(!isBuyer) return '????n h??ng ???? qu?? h???n x??c nh???n ho???c h???y ????n sau 5 ng??y l???p ????n'
        }
        if(status === 'CONFIRMED') {
            if(!isBuyer) return '????n h??ng ???? qu?? h???n v???n chuy???n. B???n c?? th??? x??c nh???n thanh to??n v?? r??t ti???n ????n h??ng t??? h??a ????n!'
            if(isBuyer) return '????n h??ng ???? qu?? h???n v???n chuy???n sau 15 ng??y x??c nh???n ????n'
        }
        if(status === 'RETURN') {
            if(isBuyer) return '????n h??ng ???? qu?? h???n ho??n tr???. B???n c?? th??? x??c nh???n ???? ho??n tr??? th??nh c??ng v?? r??t ti???n t??? h??a ????n!'
            if(!isBuyer) return '????n h??ng ???? qu?? h???n ho??n tr??? sau 15 ng??y x??c nh???n ho??n tr???'
        }
    }

    const renderTextSuggest = () => {
        const status = getOrderStatus(statusKey)
        if(status === 'PENDING') {
            if(isBuyer) return 'H???n x??c nh???n ho???c h???y ????n sau 5 ng??y. B???n c?? th??? ho??n ti???n c???a m??nh sau 5 ng??y khi ????n ch??a ???????c x??c nh???n ho???c h???y ????n!'
            if(!isBuyer) return 'H???n x??c nh???n ho???c h???y ????n sau 5 ng??y l???p ????n. Vui l??ng x??c nh???n ho???c h???y ????n ????ng h???n!'
        }
        if(status === 'CONFIRMED') {
            if(!isBuyer) return 'H???n thanh to??n ho???c x??c nh???n ho??n tr??? sau 15 ng??y. B???n c?? th??? r??t ti???n c???a m??nh sau 15 ng??y n???u ????n ch??a thanh to??n ho???c x??c nh???n ho??n tr???!'
            if(isBuyer) return 'H???n thanh to??n ho???c x??c nh???n ho??n tr??? sau 15 ng??y x??c nh???n. Vui l??ng th??nh to??n ho???c x??c nh???n ho??n tr??? ????ng h???n!'
        }
        if(status === 'RETURN') {
            if(isBuyer) return 'H???n x??c nh???n ho??n tr??? th??nh c??ng sau 15 ng??y. B???n c?? th??? ho??n ti???n c???a m??nh sau 15 ng??y khi ????n ch??a x??c nh???n ???? nh???n ???????c h??ng ho??n tr???!'
            if(!isBuyer) return 'H???n ???? nh???n ???????c h??ng ho??n tr??? sau 15 ng??y k??? t??? khi x??c nh???n ho??n tr???. Vui l??ng x??c nh???n nh???n ???????c h??ng ho??n tr??? ????ng h???n!'
        }
        
    }

    const isRenderWarning = getOrderStatus(statusKey) === 'PENDING' || getOrderStatus(statusKey) === 'CONFIRMED' || getOrderStatus(statusKey) == 'RETURN'

    const checkExpand = async () => {
        return useNotification.Error({
            title: "C???nh b??o",
            message: "Vui l??ng xem chi ti???t ????? th???c hi???n x??c nh???n!",
            duration: 3000,
          });
    }

    return (
        <div className="order-detail">
            <div className='content-header'>
                <div>
                    <h3>?????a ch??? v?? ????n h??ng:</h3>
                    <span>{order?.orderAddress}</span>
                </div>
                <div className='status-order'>
                    <label>Tr???ng th??i: </label>
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
                                        <label>?????a ch??? v?? c??ng ty nh???p kho: </label>
                                        <span>{order.buyer}</span>
                                    </div>
                                </Grid>
                                <Grid item xs={12} style={{display: 'flex', justifyContent: 'left'}}>
                                    <Button variant="outlined" color="warning" style={{fontWeight: 700, background: '#44c176', color: '#fff', borderRadius: 20}}>
                                        <ImportExportIcon />
                                        ????N XU???T KHO
                                    </Button>
                                </Grid>
                            </> : <>
                                <Grid item xs={12}>
                                    <div className='info-user'>
                                        <label>?????a ch??? c??ng ty xu???t kho: </label>
                                        <span>{order?.seller}</span>
                                    </div>
                                </Grid>
                                <Grid item xs={12} style={{display: 'flex', justifyContent: 'left'}}>
                                    <Button variant="outlined" color="warning" disabled style={{fontWeight: 700, background: '#44c176', color: '#fff', borderRadius: 20}}>
                                        <ImportExportIcon />
                                        ????N NH???P KHO
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
                            <label>Ng??y l???p ????n</label>
                            <span style={{color: 'tomato'}}>{moment(Number(order?.purchaseTime)*1000).format("DD-MM-YYYY LTS")}</span>
                        </div>        
                    </Grid>
                    <Grid item container xs={2} style={{borderRight: '1px solid rgba(0, 0, 0, 0.09)', marginTop: '-10px'}}>
                        <div className='col-order'>
                            <label className='col-order'>T???ng s???n ph???m</label>
                            <span>{order?.totalProduct}</span>
                        </div>
                    </Grid>
                    <Grid item container xs={2} style={{borderRight: '1px solid rgba(0, 0, 0, 0.09)', marginTop: '-10px'}}>
                        <div className='col-order'>
                            <label className='col-order'>T???ng thanh to??n</label>
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
                                    <h3 style={{marginLeft: 10, marginBottom: 5}} className='text-monospace'>CHI TI???T</h3>
                                    {
                                        isBuyer ? 
                                        <div className='info-address'>
                                            <label>C??ng ty xu???t kho: </label>
                                            <span>{detailOrder?.details?.[0].seller?.companyName}</span>
                                        </div> : 
                                        <div className='info-address'>
                                        <label>C??ng ty nh???p kho: </label>
                                        <span>{detailOrder?.details?.[0].buyer?.companyName}</span>
                                    </div>
                                    }
                                    <div className='info-address'>
                                        <label>?????a ch??? giao h??ng: </label>
                                        <span>{detailOrder?.address}</span>
                                    </div>
                                    <div className='info-address'>
                                        <label>??i???n tho???i li??n h???: </label>
                                        <span>{detailOrder?.phoneNumber || '0395260327'}</span>
                                    </div>
                                    <Grid item xs={11}>
                                        <TextField
                                            variant="outlined"
                                            required
                                            multiline
                                            fullWidth
                                            id="note"
                                            label="Ghi ch?? ????n h??ng"
                                            name="note"
                                            autoComplete="note"
                                            rows={2}
                                            maxRows={2}
                                            style={{background: '#fff', marginLeft: 20, marginBottom: 10}}
                                            value={detailOrder?.note || 'Kh??ng c?? ghi ch??'}
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