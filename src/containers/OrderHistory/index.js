import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { setActiveUrl } from "redux/reducers/activeUrl/action"
import {Collapse} from 'react-collapse';
import OrderDetail from "components/Order/OrderDetail";
import { FormControl, InputAdornment, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import Spinner from "components/Spinner";
import { getOrderPerCompany } from "apis/contractAPI/Warehouse";
import { useLibrary } from "hooks/contract";
import { getContract, getWarehouseAdress } from "helpers";
import { isEmpty } from "lodash";
import { getUser } from "hooks/localAuth";
import { Loading } from 'react-loading-dot'
import WaitingMessage from "components/common/WaitingMessage";
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import { getOrderStatus } from "utils/logicUntils";

const OrderHistory = () => {
    const dispatch = useDispatch()
    const library = useLibrary();
    const [isCollapse, setIsCollapse] = useState(false)
    const [orderType, setOrderType] = useState('all')
    const [loading, setLoading] = useState(false)
    const [loadingEvent, setLoadingEvent] = useState(false)
    const {accountUser} = useSelector((store)=> store.user)
    const [data, setData] = useState([])
    const [title, setTitle] = useState([])
    const [dataRs, setDataRs] = useState([])
    const [activeOrder, setActiveOrder] = useState('')
    const [queriesData, setQueriesData] = useState({type: 'all', state: 'all', addressKey: ''})
    const getContractWarehouse = async() => {
		return await getContract(library, getWarehouseAdress());
	}

    useEffect(()=> {
        document.title = 'Warehouse Protection | Lịch sử đơn hàng'
        dispatch(setActiveUrl('order-history'))
    }, [])

    useEffect(()=> {
        const getAllOrder = async () => {
            const account = await getUser()
            setLoading(true)
            const contract = await getContractWarehouse()
            await getOrderPerCompany(contract, account?.walletAddress).then((res)=> {
                const temp = [...res];
                const sortedData = temp.sort((a, b) => {
                    return b?.purchaseTime - a?.purchaseTime
                })
                const result = sortedData?.filter((item)=> !!Number(item?.purchaseTime))
                setData([...result])
                setDataRs([...result])
            }).then(()=> setLoading(false))
        }
        getAllOrder()
    }, [])

    useEffect(()=> {
        const filterOrder = async() => {
            setLoading(true)
            if(queriesData?.type ==='all' && !queriesData?.state==='all' && !queriesData?.addressKey) return
            const walletAddressUser = getUser()?.walletAddress
            let temp = []
            if(queriesData?.type === 'purchase') {
                temp = data?.filter((order)=> {
                    return order?.buyer.toLowerCase() === walletAddressUser?.toLowerCase()
                })
            } else
            if(queriesData?.type === 'sell') {
                temp = data?.filter((order)=> {
                    return order?.seller.toLowerCase() === walletAddressUser?.toLowerCase()
                })
            } else temp = [...data]
    
            const result = temp.filter((order)=> {
                const status = getOrderStatus(Number(order?.state))
                if(queriesData?.state === 'all') {
                    return order
                } else {
                    return status?.toLowerCase() === queriesData?.state?.toLowerCase()
                }
            })
    
            if(!queriesData?.addressKey) setDataRs([...result])
            else setDataRs((result?.filter((order)=> {
                return order?.orderAddress?.toLowerCase() === queriesData?.addressKey?.toLowerCase()
            })))
        }
        filterOrder().then(()=> {
            setLoading(false)
        })
    }, [queriesData])

    return (
        <>
            {
                loadingEvent && <>
                    <Loading size='20px' background='#F39C12' duration="0.6s"/>
                    <WaitingMessage title={title}/>
                </> 
            }
            <div className="list-order-company" style={{opacity: loadingEvent ? 0.5 : 1}}>
                <div style={{display: 'flex', alignItems: 'center'}}>
                    <FormControl variant="standard" sx={{ m: 1, minWidth: 130, marginRight: '20px'}}>
                        <Select
                            labelId="demo-simple-select-standard-label"
                            id="demo-simple-select-standard"
                            value={queriesData?.type}
                            onChange={(e)=> setQueriesData((prev)=> ({...prev, type: e.target.value}))}
                            label="Age"
                            variant="standard"
                            >
                            <MenuItem value='all'>Tất cả đơn</MenuItem>
                            <MenuItem value='sell'>Đơn xuất kho</MenuItem>
                            <MenuItem value='purchase'>Đơn nhập kho</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl variant="standard" sx={{ m: 1, minWidth: 150 , marginRight: '20px'}}>
                        <Select
                            labelId="demo-simple-select-standard-label"
                            id="demo-simple-select-standard"
                            value={queriesData?.state}
                            onChange={(e)=> setQueriesData((prev)=> ({...prev, state: e.target.value}))}
                            label="Age"
                            variant="standard"
                            >
                            <MenuItem value='all'>Tất cả trạng thái</MenuItem>
                            <MenuItem value='pending'>Đợi xác nhận</MenuItem>
                            <MenuItem value='confirmed'>Đã xác nhận</MenuItem>
                            <MenuItem value='cancel'>Đơn đã hủy</MenuItem>
                            <MenuItem value='success'>Đã thanh toán</MenuItem>
                            <MenuItem value='return'>Đang hoàn trả</MenuItem>
                            <MenuItem value='returned'>Đã hoàn trả</MenuItem>

                        </Select>
                    </FormControl>
                    <TextField 
                        id="standard-basic" 
                        label="Địa chỉ ví đơn hàng"
                        variant="standard" 
                        style={{width: '100%',minWidth: '450px', marginTop: '-12px', marginRight: '20px'}}
                        value={queriesData?.addressKey}
                        className={queriesData?.addressKey && 'hidden-label'}
                        InputProps={{
                        endAdornment: (
                            <InputAdornment>
                                {
                                    !queriesData?.addressKey ? 
                                    <div>       
                                        <SearchIcon sx={{cursor: 'pointer'}}/>
                                    </div> : 
                                    <div onClick={()=> {
                                        setQueriesData((prev)=> ({...prev, addressKey: ''}))
                                    }}>
                                        
                                        <CloseIcon sx={{cursor: 'pointer'}}/>
                                    </div>
                                }
                            </InputAdornment>
                        )
                        }}
                        onChange={(e)=> {
                            setQueriesData((prev)=> ({...prev, addressKey: e.target.value}))
                        }}
                        />
                </div>
                <div className="content-list">
                    {   
                        loading ? <Spinner /> :
                        !isEmpty(dataRs) &&  dataRs?.map((order, idx) => {
                            return (
                                <OrderDetail 
                                    key={idx} 
                                    order={order} 
                                    orderType={orderType} 
                                    loadingEvent={loadingEvent} 
                                    setLoadingEvent={setLoadingEvent} 
                                    title={title} 
                                    setTitle={setTitle}
                                    activeOrder={activeOrder}
                                    setActiveOrder={setActiveOrder}
                                />
                            )
                        })
                    }
                </div>
                
            </div>
        </>
    )
}

export default OrderHistory