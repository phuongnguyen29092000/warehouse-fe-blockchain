import { useEffect, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import { Button, Divider, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";
import PriceDiscount from "LogicResolve/PriceDiscount";

const CartDrawer = ({ onClose }) => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  useEffect(() => {
    const productsStore = JSON.parse(localStorage.getItem("products"));
    if (!productsStore?.length) return;
    setData(productsStore);
  }, []);

  const handleRemoveProduct = (id) => {
    const products = JSON.parse(localStorage.getItem("products")).filter(
      (item) => item.id !== id
    );
    if (!products?.length) onClose();
    setData([...products]);
    localStorage.setItem("products", JSON.stringify(products));
  };

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
                      src={
                        "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Image_created_with_a_mobile_phone.png/640px-Image_created_with_a_mobile_phone.png"
                      }
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
                      <span>{item.name}</span>
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
                      ></input>
                      <DeleteIcon
                        htmlColor="#ff8000"
                        sx={{ cursor: "pointer" }}
                        onClick={() => handleRemoveProduct(item.id)}
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
      <div style={{display: 'flex',padding: '15px', justifyContent: 'end', alignItems: 'center'}}>
        <div>
          <PriceDiscount valueDiscount={0} valuePrice={12000000} />
        </div>
      </div>
      <Button variant="contained" color="warning" style={{height: 60}}>Đặt hàng</Button>
    </div>
  );
};

export default CartDrawer;
