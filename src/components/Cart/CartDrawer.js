import { useEffect, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import { Button, Divider, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";
import PriceDiscount from "LogicResolve/PriceDiscount";
import ConvertToImageURL from "LogicResolve/ConvertToImageURL";

const CartDrawer = ({ onClose }) => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0)

  useEffect(() => {
    const productsStore = JSON.parse(localStorage.getItem("products"));
    if (!productsStore?.length) return;
    setData(productsStore);
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
    const products = JSON.parse(localStorage.getItem("products")).filter(
      (item) => item._id !== id
    );
    if (!products?.length) onClose();
    setData([...products]);
    localStorage.setItem("products", JSON.stringify(products));
  };

  const hanleChangeCount = (value, product) => {
    const newCount = Number(value)
    if(newCount < product.minimumQuantity) return
    const {_id} = product
    const products = JSON.parse(localStorage.getItem('products'))
    const newCarts = products.map((product)=> {
        if(_id === product._id) return { ...product, count: newCount}
        return product
    })
    localStorage.setItem('products', JSON.stringify(newCarts));
    setData(newCarts)
  }

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
      <div style={{ display: "flex", flexDirection: "column", width: "100%", height: '100%', paddingTop: 15}}>
        {data?.map((item) => {
          return (
            <>
              <div style={{ height: 50 }}>
                <Grid container spacing={2}>
                  <Grid item xs={3}>
                    <img
                      src={ConvertToImageURL(item.imageUrl)}
                      style={{ width: 60, height: 60, marginLeft: 16 }}
                      alt=""
                    />
                  </Grid>
                  <Grid container item xs={9}>
                    <Grid
                      item
                      xs={12}
                      style={{ marginBottom: 6, cursor: "pointer" }}
                      onClick={() => navigate(`/chi-tiet-san-pham/${item.id}`)}
                    >
                      <span>{item.productName}</span>
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
                        value={parseInt(item.count)}
                        style={{ width: 50, outline: "none", height: 20}}
                        onChange={(e)=> hanleChangeCount(e.target.value, item)}
                        onKeyDown={(e)=> {
                          if(e.key === "Backspace") {
                              const key = e.target.value.slice(0,-1)
                              hanleChangeCount(key, item)
                          }
                        }}
                      ></input>
                      <DeleteIcon
                        htmlColor="#ff8000"
                        sx={{ cursor: "pointer" }}
                        onClick={() => handleRemoveProduct(item._id)}
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
