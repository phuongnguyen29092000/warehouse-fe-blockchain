import { TimelineConnector, TimelineContent, TimelineDot, TimelineItem, TimelineOppositeContent, TimelineSeparator } from "@mui/lab";
import { Button } from "@mui/material";
import { Box } from "@mui/system";
import { getContract } from "helpers";
import moment from "moment";
import { useEffect, useState } from "react";
import {getOrderStatus} from 'utils/logicUntils'
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import { filter } from "lodash";
import { useDispatch } from "react-redux";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import FeedbackForm from "components/Form/FeedbackForm";
import CloseIcon from '@mui/icons-material/Close';
import { createFeedback } from "redux/reducers/feedback/action";
import { getUser } from "hooks/localAuth";

const Timeline = ({order, library, transactions, isExpired, detailOrder, isBuyer, fetchTransaction, setDetailOrder}) => {
    const dispatch = useDispatch()
    const [openFeedbackModal, setOpenFeedbackModal] = useState(false)
    const [data, setData] = useState([])
    const [showTransaction, setShowTransaction] = useState(false)
    const accountUser = getUser()
    let isExpiredStatus
    console.log({order});
    
    useEffect(()=> {
        if(!order) return 
        if(order?.state === '5') setData(transactions.filter((t, idx)=> {
            return idx !== 4
        }))
        else setData([...transactions])
    }, [fetchTransaction])

    const renderContentTimeline = (status) => {
        const companyNameBuyer = detailOrder?.details?.[0]?.buyer?.companyName
        const companyNameSeller = detailOrder?.details?.[0]?.seller?.companyName
        if(status === 'CANCEL' && (Number((order?.cancelTime))*1000 > Number(order?.dealine))) {
            isExpiredStatus = true
        }
        else if(status === 'SUCCESS' && (Number((order?.paymentTime))*1000 > Number(order?.dealine))) {
            isExpiredStatus = true
        }
        else if(status === 'RETURNED' && (Number((order?.returnedTime))*1000 > Number(order?.dealine))) {
            isExpiredStatus = true
        } 
        else isExpiredStatus = false

        switch (status) {
            case 'PENDING':
                return (
                    <span className="text-confirmby">
                        {`X??c nh???n mua b???i ${isBuyer ? 'b???n' : companyNameBuyer}`}
                    </span>
                )
                break;
            case 'CONFIRMED':
                return (
                    <span className="text-confirmby">
                        {`X??c nh???n b???i ${!isBuyer ? 'b???n' : companyNameSeller}`}
                    </span>
                )
                break;
            case 'CANCEL':
                if(isExpired && isExpiredStatus) {
                    return (
                        <span className="text-confirmby">
                            {`X??c nh???n h???y v?? ho??n ti???n b???i ${isBuyer ? 'b???n' : companyNameBuyer} (H???t h???n x??c nh???n ho???c h???y ????n)`}
                        </span>
                    )
                }
                else
                return (
                    <span className="text-confirmby">
                        {`X??c nh???n h???y b???i ${!isBuyer ? 'b???n' : companyNameSeller}`}
                    </span>
                )
                break;
            case 'SUCCESS':
                if(isExpired && isExpiredStatus) {
                    return (
                        <span className="text-confirmby">
                            {`X??c nh???n thanh to??n v?? r??t ti???n b???i ${!isBuyer ? 'b???n' : companyNameSeller} (H???t h???n thanh to??n ho???c ho??n tr??? h??ng)`}
                        </span>
                    )
                }
                else
                return (
                    <span className="text-confirmby">
                        {`X??c nh???n thanh to??n b???i ${isBuyer ? 'b???n' : companyNameBuyer}`}
                    </span>
                )
                break;
            case 'RETURN':
                return (
                    <span className="text-confirmby">
                        {`X??c nh???n ho??n tr??? b???i ${isBuyer ? 'b???n' : companyNameBuyer}`}
                    </span>
                ) 
            case 'RETURNED':
                if(isExpired && isExpiredStatus) {
                    return (
                        <span className="text-confirmby">
                            {`X??c nh???n ho??n tr??? th??nh c??ng v?? ho??n ti???n b???i ${isBuyer ? 'b???n' : companyNameBuyer} (H???t h???n x??c nh???n ho??n tr??? th??nh c??ng)`}
                        </span>
                    )
                }
                else 
                return (
                    <span className="text-confirmby">
                        {`X??c nh???n ho??n tr??? th??nh c??ng b???i ${!isBuyer ? 'b???n' : companyNameSeller}`}
                    </span>
                )
                break;
            default:
                return (<></>)
                break;
        }
    }

    const handleSendFeedback = async(data) => {   
        const body = {
            ...data,
            seller: detailOrder?.details?.[0]?.seller?._id,
            buyer: accountUser?._id,
            order: detailOrder?._id
        }
        dispatch(createFeedback(detailOrder?._id, body, (res)=> {
            if(res) {
                setOpenFeedbackModal(false)
                setDetailOrder((prev)=> ({...prev, isRated: true}))
            }
        }))
    }

    return (
        <div className='info-timeline'>
            {
                !showTransaction ? 
                (
                    data?.map((item, index) => (
                        <TimelineItem key={index}>
                            <TimelineOppositeContent sx={{maxWidth: 200, color:'tomato', fontSize:'16px',fontWeight: 600}}>
                                {moment((Number(item?.timestamp))*1000).format('YYYY-MM-DD LTS')}
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
                                    <div style={{height: 70, display: 'flex', flexDirection: 'column'}} className='text-status-timeline'>
                                        {getOrderStatus(Number(item?.state))}
                                        <div className="content-confirm">
                                            <ConfirmationNumberIcon fontSize="small" htmlColor="tomato"/>
                                            {
                                                renderContentTimeline(getOrderStatus(Number(item?.state)))
                                            }
                                        </div>
                                        {
                                            getOrderStatus(Number(item?.state)) === 'SUCCESS' && isBuyer && !detailOrder?.isRated && (
                                                <Button variant="outlined" color="primary" style={{width: 110, marginTop: 10}} size='small' onClick={()=> setOpenFeedbackModal(true)}>
                                                    ????NH GI??
                                                </Button>
                                            )
                                        }
                                        {
                                            getOrderStatus(Number(item?.state)) === 'SUCCESS' && detailOrder?.isRated && (
                                                <Button variant="outlined" color="primary" style={{width: 130, marginTop: 10}} size='small' onClick={()=> setOpenFeedbackModal(true)}>
                                                    XEM ????NH GI??
                                                </Button> 
                                            )
                                        }
                                    </div>
                                </Box>
                            </TimelineContent>
                        </TimelineItem>
                    ))
                ) : 
                <div>
                     <div className='admin-manager__list-user'>
                <table>
                    <thead>
                        <th className='th-2'>Th???i gian</th>
                        <th className='th-2'>T??i kho???n th??? h?????ng</th>
                        <th className='th-2'>Tr???ng th??i</th>
                        <th className='th-1' style={{width: '50px', textAlign:'end'}}>S??? ETH</th>
                    </thead>
                    <tbody>
                        {
                            transactions &&
                            transactions?.filter((t)=> ![1, 4].includes(Number(t?.state)))?.map((t, index) =>(
                                <tr key={index} style={{borderBottom:'5px solid white'}}>
                                    <td className='td-1'>{moment((Number(t?.timestamp))*1000).format('YYYY-MM-DD LTS')}</td>
                                    <td className='td-1'>{t?.beneficiaryAccount}</td>
                                    <td className='td-1'>{getOrderStatus(Number(t?.state))}</td>
                                    <td className='td-1' style={{width: '50px', textAlign:'end'}}>{parseFloat(Number(t?.amount)/1000000000000000000)}{' ETH'}</td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
                </div>
            }


            <div style={{display: 'flex', width: '100%', justifyContent: 'right', marginTop: 10, position: 'absolute', bottom: 0, right: 20}}>
                <Button variant="contained" color="primary" style={{width: '30%', marginTop: 10}} onClick={()=> setShowTransaction(!showTransaction)}>
                    {!showTransaction ? 'Xem chi ti???t giao d???ch' : 'Xem Timeline'}
                </Button>
            </div>

            <Dialog
                open={openFeedbackModal}
                onClose={()=> setOpenFeedbackModal(false)}
                aria-labelledby="responsive-dialog-title"
                
            >
                <DialogContent style={{width: 500, marginBottom: 20, position: 'relative'}}>
                    <FeedbackForm handleSendFeedback={handleSendFeedback} detailOrder={detailOrder}/>
                    <div style={{position:'absolute', top: '10px', right: 10, cursor: 'pointer'}} onClick={()=> setOpenFeedbackModal(false)}>
                        <CloseIcon fontSize="medium" htmlColor="#292929"/>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default Timeline