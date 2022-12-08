import AddIcon from '@mui/icons-material/Add';
import { Box, Button, CircularProgress, Divider, Grid, TextField } from "@mui/material";
import { useEffect, useState } from 'react';
import RemoveIcon from '@mui/icons-material/Remove';
import Collapse from 'react-collapse';
import { TimelineConnector, TimelineContent, TimelineDot, TimelineItem, TimelineOppositeContent, TimelineSeparator } from '@mui/lab';
import moment from 'moment';
import PriceDiscount from 'LogicResolve/PriceDiscount';
import { getOrderStatus } from 'utils/logicUntils';
import OrderAPI from 'apis/OrderAPI'
import ImportExportIcon from '@mui/icons-material/ImportExport';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import CheckIcon from '@mui/icons-material/Check';
import CancelIcon from '@mui/icons-material/Cancel';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { getUser } from 'hooks/localAuth';
import { confirmCancelOrder, confirmDeliveryOrder, confirmPaymentToSeller, confirmReturnedOrder, confirmReturnOrder, getAllTransactionOrder } from 'apis/contractAPI/OrderAPI';
import { getContract } from 'helpers';
import { useLibrary } from 'hooks/contract';
import { useWeb3React } from '@web3-react/core';
import { injected } from 'components/Wallet';
import ETHIcon from "../../assets/icons/ethereum-eth.svg";
import useNotification from 'hooks/notification';

const OrderDetail  = ({order, orderType, loadingEvent, setLoadingEvent, title, setTitle, activeOrder, setActiveOrder}) => {
    const library = useLibrary()
	const { active, activate, error } = useWeb3React();
    const [isExpand, setIsExpand] = useState(false)
    const data = [1, 2, 3, 4]
    const [detailOrder, setDetailOrder] = useState({})
    const [loading, setLoading] = useState(false)
    const [actorsOrder, setActorOrder] = useState({buyer: {}, seller: {}})
    const [statusKey, setStatusKey] = useState(Number(order?.state))

    const isBuyer = order?.buyer?.toLowerCase() === getUser()?.walletAddress?.toLowerCase()

    useEffect(()=> {
        if(!isExpand) return 
        const getDetailFromDB = async() => {
            setLoading(true)
            await OrderAPI.getOrderByAddress(order?.orderAddress).then((res)=> {
                setDetailOrder(res?.data?.order)
                console.log(res);
            })
            .then(()=> setLoading(false))
            .catch(()=> setLoading(false))
        }
        getDetailFromDB()
    }, [isExpand])   
    
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

    const handleConfirmOrder = async() => {
        setLoadingEvent(true)
        setActiveOrder(order?.orderAddress)
        setTitle('Đang xác nhận đơn xuất kho')
        const contract = await getContractOrder()
        await confirmDeliveryOrder(contract, order?.seller).then((res)=> {
            console.log({res});
            useNotification.Success({
                title: "Thành công",
                message: "Xác nhận đơn hàng xuất kho thành công!",
                duration: 3000,
              });
            setStatusKey(1)
            setLoadingEvent(false)
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
        setLoadingEvent(true)
        setActiveOrder(order?.orderAddress)
        setTitle('Đang gửi tiền cho công ty xuất kho.')
        const contract = await getContractOrder()
        await confirmPaymentToSeller(contract, order?.buyer).then((res)=> {
            console.log({res});
            useNotification.Success({
                title: "Thành công",
                message: "Hoàn tất thanh toán tiền cho công ty xuất kho!",
                duration: 3000,
              });
            setStatusKey(3)
            setLoadingEvent(false)
        }).catch(()=> {
            useNotification.Error({
                title: "Thất bại",
                message: "Xác nhận gửi tiền cho công ty xuất kho thất bại!",
                duration: 3000,
              });
            setLoadingEvent(false)
        })
    }

    const handleCancelOrder = async() => {
        setLoadingEvent(true)
        setActiveOrder(order?.orderAddress)
        setTitle('Đang xác nhận hủy đơn xuất kho')
        const contract = await getContractOrder()
        await confirmCancelOrder(contract, order?.seller).then((res)=> {
            console.log({res});
            useNotification.Success({
                title: "Thành công",
                message: "Xác nhận hủy đơn xuất kho thành công!",
                duration: 3000,
              });
            setStatusKey(2)
            setLoadingEvent(false)
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
        setLoadingEvent(true)
        setActiveOrder(order?.orderAddress)
        setTitle('Đang xác nhận hoàn đơn hàng nhập kho.')
        const contract = await getContractOrder()
        await confirmReturnOrder(contract, order?.buyer).then((res)=> {
            console.log({res});
            useNotification.Success({
                title: "Thành công",
                message: "Xác nhận hoàn trả thành công!",
                duration: 3000,
              });
            setStatusKey(4)
            setLoadingEvent(false)
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
        setLoadingEvent(true)
        setActiveOrder(order?.orderAddress)
        setTitle('Đang xác nhận nhận đơn hàng đã được hoàn trả thành công.')
        const contract = await getContractOrder()
        await confirmReturnedOrder(contract, order?.seller).then((res)=> {
            console.log({res});
            useNotification.Success({
                title: "Thành công",
                message: "Xác nhận đã nhận được hàng hoàn trả thành công!",
                duration: 3000,
              });
            setStatusKey(5)
            setLoadingEvent(false)
        }).catch(()=> {
            useNotification.Error({
                title: "Thất bại",
                message: "Xác nhận đã nhận được hàng hoàn trả không thành công!",
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
                            CONFIRM
                        </Button>
                        <Button variant="contained" color="error" onClick={handleCancelOrder}>
                            CANCEL
                        </Button>
                    </>
                )
                break;
            case 'CONFIRMED':
                if(isBuyer) 
                return (
                    <>
                        <Button variant="contained" color="info" onClick={handlePaymentToSeller}>
                            PAYMENT
                        </Button>
                        <Button variant="contained" color="inherit" onClick={handleReturnOrder}>
                            RETURN
                        </Button>
                    </>
                )
                break;
            case 'RETURN':
                if(!isBuyer)
                return (
                    <>
                        <Button variant="contained" color="secondary" onClick={handleConfirmReceiveReturnOrder}>
                            RETURNED
                        </Button>
                    </>
                )
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
                        PENDING <MoreHorizIcon />
                    </Button>
                )
                break;
            case 'CONFIRMED':
                return (
                    <Button variant="outlined" color="info">
                        CONFIRMED <CheckIcon />
                    </Button>
                )
            case 'CANCEL':
                return (
                    <Button variant="outlined" color="error">
                        CANCEL <CancelIcon />
                    </Button>
                )
                break;
            case 'SUCCESS':
                return (
                    <Button variant="outlined" color="success">
                        SUCCESS <DoneAllIcon />
                    </Button>
                )
                break;
            case 'RETURN':
                return (
                    <Button variant="outlined" color="secondary">
                        RETURN <KeyboardReturnIcon />
                    </Button>
                )
                break;
            case 'RETURNED':
                return (
                    <Button variant="outlined" color="primary">
                        RETURNED <FileDownloadIcon />
                    </Button>
                )
                break;
    }
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
                                        <span>{'0xf8a8F06dEF170fbD1DB7f04FF561eDf8d7aC1846'}</span>
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
                    </Grid>
                    <Grid item container xs={2} style={{borderRight: '1px solid rgba(0, 0, 0, 0.09)', marginTop: '-10px'}}>
                        <div className='col-order'>
                            <label>Ngày lập đơn</label>
                            <span style={{color: 'tomato'}}>{moment(Number(order?.purchaseTime)*1000).format("DD-MM-YYYY h:mm:ss")}</span>
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
                                <span>{order?.totalPrice}</span>ETH
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
                            <Grid item xs={6} style={{borderRight: '1px solid rgba(0, 0, 0, 0.09)'}}>
                                <div className='info-timeline'>
                                    {
                                        // histories.sort((a, b)=> new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                                        data?.map((item, index) => (
                                            <TimelineItem key={index}>
                                                <TimelineOppositeContent sx={{maxWidth: 200, color:'#cc2f2f', fontSize:'16px',fontWeight: 600}}>
                                                    {moment(item?.createdAt).format('YYYY-MM-DD LTS')}
                                                </TimelineOppositeContent>
                                                <TimelineSeparator>
                                                    <TimelineDot />
                                                    {
                                                        index != data.length-1 && 
                                                        <TimelineConnector />
                                                    }
                                                </TimelineSeparator>
                                                <TimelineContent sx={{ color: 'black', fontSize:'14px', marginBottom:'20px' }}>
                                                    <Box>
                                                        <div style={{height: 70}}>
                                                            PENDING
                                                        </div>
                                                    </Box>
                                                </TimelineContent>
                                            </TimelineItem>
                                        ))
                                    }
                                </div>
                            </Grid>
                            <Grid item xs={6} style={{marginTop: '-30px'}}>
                                <div className='info-user'>
                                    <h3 style={{marginLeft: 10, marginBottom: 5}} className='text-monospace'>CHI TIẾT</h3>
                                    <div className='info-address'>
                                        <label>Địa chỉ giao hàng: </label>
                                    <span>{detailOrder?.address?.value || 'Quế sơn, Quảng Nam'}</span>
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
                                            rows={3}
                                            maxRows={3}
                                            style={{background: '#fff', marginLeft: 20, marginBottom: 10}}
                                            value={'helo mn '}
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
                                                                    {product.product}
                                                                </span>
                                                                <span className="total-count">
                                                                    x {product.quantity}
                                                                </span>
                                                            </div>
                                                            <div className="view-price">
                                                                <PriceDiscount valueDiscount={0} valuePrice={product?.priceDis*product.quantity} />
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