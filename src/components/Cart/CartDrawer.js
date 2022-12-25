import { useEffect, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import { Button, CircularProgress, Divider, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";
import PriceDiscount from "LogicResolve/PriceDiscount";
import ConvertToImageURL from "LogicResolve/ConvertToImageURL";
import { useDispatch, useSelector } from "react-redux";
import { deleteItemCart, getCartByUser } from "redux/reducers/cart/action";
import { debounce, isEmpty } from "lodash";
import CartAPI from 'apis/CartAPI'
import { CheckExpiredToken } from "utils/authUtil";


const CartDrawer = ({ onClose }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const {accountUser} = useSelector((store)=> store.user)
  const {loading, cartData} = useSelector((store)=> store.cart)
  const [data, setData] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0)

  useEffect(() => {
    if(!accountUser?._id) return
    dispatch(getCartByUser(accountUser?._id, (res)=> {
      if(res) {
        setData(cartData?.products)
      }
    }))
  }, []);

  useEffect(()=> {
    if(!data?.length) return
    const totalPrice = data.reduce((total, value) => {
        const {count, price, discount} = value
        return total + count*price*(1 - discount)
    }, 0)
    setTotalPrice(totalPrice)
  }, [data])

  const handleRemoveProduct = (id) => {
    dispatch(deleteItemCart(accountUser?._id, {productId: id}, (res)=> {
      if(isEmpty(res?.products)) onClose()
    }))
  };

  const hanleChangeCount = debounce(async(value, product) => {
		const newCount = Number(value)
		if(newCount < product.minimumQuantity) return
		const {_id} = product
		const data = {
			productId : _id, 
			newCount: newCount
		}
    await CheckExpiredToken()
		await CartAPI.updateCountItemCart(accountUser?._id, data).then((res)=> {
			if(res.status === 200) {
				setData((prev)=> {
					return prev?.map(p=> {
						if(p.product._id === _id) return {
							...p, quantity: newCount
						}
						return p
					})
				})
				
			}
		}).catch(()=> {
			console.log('err');
			return
		})

	}, 300)
  console.log(data);

  return (
    <div
      style={{
        width: 350,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        height: '100%', background: '#f7f7f7'
      }}
    >
      <label
        style={{
          textAlign: "center",
          padding: "10px 0",
          background: "#464646",
          color: "#fff",
        }}
      >
        Giỏ hàng ({data?.length})
      </label>
      {
        loading ?  <CircularProgress color="warning" size={30} sx={{marginRight: '10px'}}/> 
        : 
        <div style={{ display: "flex", flexDirection: "column", width: "100%", height: '100%', paddingTop: 15}}>
          {data?.map((item,idx) => {
            return (
              <>
                <div style={{ height: 50 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={3}>
                      <img
                        src={ConvertToImageURL(item.product.imageUrl)}
                        style={{ width: 60, height: 60, marginLeft: 16 }}
                        alt=""
                      />
                    </Grid>
                    <Grid container item xs={9}>
                      <Grid
                        item
                        xs={12}
                        style={{ marginBottom: 6, cursor: "pointer" }}
                        onClick={() => navigate(`/chi-tiet-san-pham/${item.product._id}`)}
                      >
                        <span>{item.product.productName}</span>
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          paddingRight: 10,
                        }}
                      >
                        <input
                          type="number"
                          value={parseInt(item.quantity)}
                          style={{ width: 50, outline: "none", height: 20}}
                          onChange={(e)=> hanleChangeCount(e.target.value, item.product)}
                          onKeyDown={(e)=> {
                            if(e.key === "Backspace") {
                                const key = e.target.value.slice(0,-1)
                                hanleChangeCount(key, item.product)
                            }
                          }}
                        ></input>
                        <DeleteIcon
                          htmlColor="#ff8000"
                          sx={{ cursor: "pointer" }}
                          onClick={() => handleRemoveProduct(item.product._id)}
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                </div>
                <Divider style={{ margin: "25px 0" }} />
              </>
            );
          })}
        </div>
      }
      {/* <div style={{display: 'flex',padding: '15px', justifyContent: 'end', alignItems: 'center'}}>
        <div>
          <PriceDiscount valueDiscount={0} valuePrice={totalPrice} />
        </div>
      </div> */}
      <Button variant="contained" color="warning" style={{height: 60}} onClick={()=> navigate('/gio-hang')}>Đặt hàng</Button>
    </div>
  );
};

export default CartDrawer;
