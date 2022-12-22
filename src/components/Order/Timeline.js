import { TimelineConnector, TimelineContent, TimelineDot, TimelineItem, TimelineOppositeContent, TimelineSeparator } from "@mui/lab";
import { Button } from "@mui/material";
import { Box } from "@mui/system";
import { getAllTransactionOrder } from "apis/contractAPI/OrderAPI";
import { getContract } from "helpers";
import moment from "moment";
import { useEffect, useState } from "react";
import {getOrderStatus} from 'utils/logicUntils'
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import { filter } from "lodash";

const Timeline = ({order, library, transactions, isExpired, detailOrder, isBuyer}) => {
    
    const [openFeedbackModal, setOpenFeedbackModal] = useState(false)
    const [data, setData] = useState([])
    const [showTransaction, setShowTransaction] = useState(false)

    useEffect(()=> {
        if(!order) return 
        if(order?.state === '5') setData(transactions.filter((t, idx)=> {
            return idx !== 4
        }))
        else setData([...transactions])
    }, [])

    console.log(transactions);

    const renderContentTimeline = (status) => {
        const companyNameBuyer = detailOrder?.details?.[0]?.buyer?.companyName
        const companyNameSeller = detailOrder?.details?.[0]?.seller?.companyName
        switch (status) {
            case 'PENDING':
                return (
                    <span className="text-confirmby">
                        {`Xác nhận mua bởi ${isBuyer ? 'bạn' : companyNameBuyer}`}
                    </span>
                )
                break;
            case 'CONFIRMED':
                return (
                    <span className="text-confirmby">
                        {`Xác nhận bởi ${!isBuyer ? 'bạn' : companyNameSeller}`}
                    </span>
                )
                break;
            case 'CANCEL':
                if(isExpired) {
                    return (
                        <span className="text-confirmby">
                            {`Xác nhận hủy và hoàn tiền bởi ${isBuyer ? 'bạn' : companyNameBuyer} (Hết hạn xác nhận hoặc hủy đơn)`}
                        </span>
                    )
                }
                else
                return (
                    <span className="text-confirmby">
                        {`Xác nhận hủy bởi ${!isBuyer ? 'bạn' : companyNameSeller}`}
                    </span>
                )
                break;
            case 'SUCCESS':
                if(isExpired) {
                    return (
                        <span className="text-confirmby">
                            {`Xác nhận thanh toán và rút tiền bởi ${!isBuyer ? 'bạn' : companyNameSeller} (Hết hạn thanh toán hoặc hoàn trả hàng)`}
                        </span>
                    )
                }
                else
                return (
                    <span className="text-confirmby">
                        {`Xác nhận thanh toán bởi ${isBuyer ? 'bạn' : companyNameBuyer}`}
                    </span>
                )
                break;
            case 'RETURN':
                return (
                    <span className="text-confirmby">
                        {`Xác nhận hoàn trả bởi ${isBuyer ? 'bạn' : companyNameBuyer}`}
                    </span>
                ) 
            case 'RETURNED':
                if(isExpired) {
                    return (
                        <span className="text-confirmby">
                            {`Xác nhận hoàn trả thành công và hoàn tiền bởi ${isBuyer ? 'bạn' : companyNameBuyer} (Hết hạn xác nhận hoàn trả thành công)`}
                        </span>
                    )
                }
                else 
                return (
                    <span className="text-confirmby">
                        {`Xác nhận hoàn trả thành công bởi ${!isBuyer ? 'bạn' : companyNameSeller}`}
                    </span>
                )
                break;
            default:
                return (<></>)
                break;
        }
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
                                            getOrderStatus(Number(item?.state)) === 'SUCCESS' &&
                                            <Button variant="outlined" color="primary" style={{width: 110, marginTop: 10}} size='small' onClick={()=> setOpenFeedbackModal(true)}>
                                                ĐÁNH GIÁ
                                            </Button>
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
                        <th className='th-2'>Thời gian</th>
                        <th className='th-2'>Tài khoản thụ hưởng</th>
                        <th className='th-2'>Trạng thái</th>
                        <th className='th-1'  style={{width: '50px', textAlign:'end'}}>Số ETH</th>
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
                    {!showTransaction ? 'Xem chi tiết giao dịch' : 'Xem Timeline'}
                </Button>
            </div>
        </div>
    )
}

export default Timeline