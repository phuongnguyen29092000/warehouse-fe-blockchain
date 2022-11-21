import * as React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import PriceDiscount from "../../../LogicResolve/PriceDiscount";
import Rating from "@mui/material/Rating";
import { styled } from "@mui/material/styles";
import { Link } from "react-router-dom";
import moment from "moment";

const StyledRating = styled(Rating)({
  "& .MuiRating-iconFilled": {
    color: "#ff6d75",
  },
  "& .MuiRating-iconHover": {
    color: "#ff3d47",
  },
});

export default function ProductCard({
  _id,
  productName,
  description,
  companyName,
  imageUrl,
  price,
  active,
  dateOfInventory,
  minimumQuantity,
  manufacturer,
  discount = 0,
  setOpenDrawerCart,
}) {
  const [shadow, setShadow] = React.useState(false);
  const onMouseOver = () => setShadow(true);
  const onMouseOut = () => setShadow(false);
  // const {account} = ((store) => store.user)
  const handleOnClick = () => {
    //
  };

  const handleAddToCart = (id) => {
    setOpenDrawerCart(true);
    const products = JSON.parse(localStorage.getItem("products"))?.length
      ? JSON.parse(localStorage.getItem("products"))
      : [];
    if (!products.every((item) => !item.id.includes(id))) return;
    localStorage.setItem(
      "products",
      JSON.stringify([
        ...products,
        { id: id, name: productName, count: minimumQuantity },
      ])
    );
  };

  return (
    <>
      <Card
        onMouseOver={onMouseOver}
        onMouseOut={onMouseOut}
        raised={shadow}
        sx={{
          boxSizing: "border-box",
          ":hover": {
            paddingTop: "1px",
            transition: "0.4s",
            boxShadow: "5px 5px 5px #715c5cd1",
          },
          cursor: "pointer",
          borderRadius: "10px",
          maxWidth: 350,
          height: 490,
          marginLeft: "auto",
          marginRight: "auto",
          minWidth: 150,
          position: "relative",
        }}
        title={productName}
      >
        {new Number(discount) * 100 != 0 && (
          <div
            style={{
              position: "absolute",
              zIndex: 100,
              top: 0,
              left: "20px",
              height: "40px",
              lineHeight: "40px",
              width: "60px",
              backgroundColor: "red",
              color: "white",
            }}
          >
            -{new Number(discount) * 100}%
          </div>
        )}
        <CardMedia
          component="img"
          alt={productName}
          height="250"
          image={imageUrl}
          sx={{
            ":hover": {
              transform: "scale(1.1)",
              transition: "1s",
            },
            transition: "1s",
          }}
        />
        <CardContent sx={{ padding: "0 16px" }}>
          <Typography
            gutterBottom
            variant="h6"
            component="div"
            sx={{
              marginTop: "10px",
              height: "30px",
              overflow: "hidden",
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
            }}
          >
            {productName}
          </Typography>
          <Typography
            gutterBottom
            sx={{ fontSize: 16, color: "red" }}
            color="blueviolet"
            align="left"
          >
            <PriceDiscount valuePrice={price} valueDiscount={discount} />
          </Typography>
          {/* <Typography gutterBottom component="div" variant="body1" color="blueviolet" align="left" style={{ height: '15px' }}>
                        <Rating name="customized-rating"
                            defaultValue={rating}
                            value={rating}
                            max={5}
                            precision={0.1}
                            readOnly
                            size="medium"
                        />
                    </Typography> */}
          <Typography
            gutterBottom
            variant="h7"
            component="div"
            align="left"
            style={{ fontFamily: "Dosis", display: "flex", height: "20px" }}
          >
            {!active ? (
              <h4
                style={{
                  textDecoration: "line-through",
                  color: "#858585",
                  marginTop: "5px",
                }}
              >
                {companyName}
              </h4>
            ) : (
              <h4
                style={{
                  color: "#858585",
                  marginTop: "5px",
                  overflow: "hidden",
                  lineHeight: "1.4",
                  fontSize: "14px",
                  height: "58px",
                  textOverflow: "ellipsis",
                  marginBottom: 10,
                  whiteSpace: 'nowrap'
                }}
              >
                {companyName}
              </h4>
            )}
          </Typography>
          <Typography
            gutterBottom
            variant="h7"
            component="div"
            align="left"
            style={{ fontFamily: "Dosis", display: "flex", height: "20px" }}
          >
              <h4
                style={{
                  color: "#858585",
                  marginTop: "5px",
                  overflow: "hidden",
                  lineHeight: "1.4",
                  fontSize: "14px",
                  height: "58px",
                  textOverflow: "ellipsis",
                  marginBottom: 10,
                  whiteSpace: 'nowrap'
                }}
              >
                NSX: {manufacturer}
              </h4>
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            align="left"
            sx={{
              overflow: "hidden",
              lineHeight: "1.4",
              fontSize: "14px",
              height: "58px",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: "3",
              WebkitBoxOrient: "vertical",
              marginTop: '10px'
            }}
          >
            {description}
          </Typography>
        </CardContent>
        <CardActions>
          <Button
            size="small"
            disabled={false}
            color="info"
            variant="contained"
            onClick={() => handleAddToCart(_id)}
          >
            Thêm vào giỏ
          </Button>
          <Link
            style={{ textDecoration: "none" }}
            to={`/chi-tiet-san-pham/${_id}`}
          >
            <Button
              size="small"
              color="info"
              variant="outlined"
              sx={{ ml: "10px" }}
            >
              Xem thêm
            </Button>
          </Link>
        </CardActions>
      </Card>
    </>
  );
}
