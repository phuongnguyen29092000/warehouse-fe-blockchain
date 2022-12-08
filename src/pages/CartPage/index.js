import AppBar from "@mui/material/AppBar";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button} from "@mui/material";
import Spinner from "components/Spinner";
import EmptyCart from '../../public/emptyCart.jpg'
import ShopIcon from '@mui/icons-material/Shop';
import { useDispatch } from "react-redux";
import { getWarehouseAdress, getContract } from "helpers";
import { useLibrary } from "hooks/contract";
import Order from "components/Order";
import { isEmpty } from "lodash";
import WaitingMessage from "components/common/WaitingMessage";
import { Loading } from "react-loading-dot/lib";

const CartPage = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState([]);
    const library = useLibrary();
    const [titleLoading, setTitleLoading] = useState(false)
    const [loadingEvent, setLoadingEvent] = useState(false)
  
    useEffect(()=> {
        document.title = 'Giỏ hàng'  
        const productsStore = JSON.parse(localStorage.getItem("products"))
        if (!productsStore?.length) return;
        setData(handleGroupByUser(productsStore))
    },[])

    const handleGroupByUser = (data) => {
        const rs = data.reduce((group, item)=> {
            if(!group[item.user._id]) group[item.user._id] = []
            group[item.user._id].push(item)
            return group
        }, {})
        return Object.values(rs)
    }

	const getcontract = async () => {
		return await getContract(library, getWarehouseAdress());
	};

  return (
    <>
        {
            loadingEvent && 
            <>
                <WaitingMessage title={titleLoading}/>
                <Loading size='20px' background='#F39C12' duration="0.6s"/>
            </>
        }
        <AppBar
        position="fixed"
        style={{
            marginTop: 100,
            backgroundColor: data?.length !== 0 ? "rgb(244, 244, 244)" : '#fff',
            paddingRight: "0 !important",
            padding: '0 100px 50px 100px',
            height: '100%',
            overflowY: 'scroll',
            opacity: loadingEvent ? 0.5 : 1
        }}
        >
            { 
                isEmpty(data) ? 
                    <div className="empty-cart">
                    <span style={{fontSize: 18, fontWeight: 600, color: '#292929'}}>
                        Giỏ hàng của bạn hiện chưa có sản phẩm nào!
                    </span>
                    <img src={EmptyCart} alt=''/>
                    <Button variant="contained" color="warning" style={{width: '270px', height: 60, marginTop: 30, display: 'flex', marginLeft: 'auto', marginRight: 'auto'}} onClick={()=> navigate('/')}>
                        <div style={{height: 30, marginRight: 20, paddingRight: 20, borderRight: '1px solid #fff'}}>
                            <ShopIcon sx={{width: '40px', height: '40px', marginTop: '-5px'}}/>
                        </div>Tiếp tục mua hàng
                        </Button>
                    </div> 
                : 
                <div className="list-order-user">
                    {
                        data?.map((order, idx)=> {
                            return (
                                <Order 
                                    key={idx}
                                    order={order}
                                    getcontract={getcontract}
                                    setTitleLoading={setTitleLoading}
                                    setLoadingEvent={setLoadingEvent}
                                    loadingEvent={loadingEvent}
                                />
                            )
                        })
                    }
                </div>
            }
        </AppBar>
    </>
  );
};

export default CartPage;
