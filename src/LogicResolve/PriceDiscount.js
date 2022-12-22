import RegardPrice from "./RegardPrice";
import ETHIcon from "../assets/icons/ethereum-eth.svg";
import ETHIconDis from "../assets/icons/ethreum.eth-dis.png";

export default function PriceDiscount({ valuePrice, valueDiscount }) {
  valuePrice = parseFloat(valuePrice);
  valueDiscount = parseInt(valueDiscount * 100);
  return (
    <div style={{display: 'flex', alignItems: 'center', flexWrap: 'wrap'}}>
      Giá:{" "}
      {valueDiscount !== 0 ? (
        <div style={{display: 'flex', alignItems: "center"}}>
          <span
            style={{
              textDecoration: "line-through",
              color: "GrayText",
              display: "flex",
              alignItems: "center", marginRight: 5
            }}
          >
            <img
              src={ETHIconDis}
              alt=""
              style={{ width: 20, height: 30, marginRight: 5 }}
            />
            {valuePrice}
          </span>
          <span style={{ color: "red", display: "flex", alignItems: "center" }}>
            <img
              src={ETHIcon}
              alt=""
              style={{ width: 30, height: 30, marginRight: 5 }}
            />
            {((valuePrice * (100 - valueDiscount)) / 100).toFixed(4)}
            <span style={{color: '#292929', marginLeft: 3, fontWeight: 700}}>
                ETH
            </span>
          </span>
        </div>
      ) : (
        <span style={{ color: "red", display: "flex", alignItems: "center" }}>
          <img
            src={ETHIcon}
            alt=""
            style={{ width: 30, height: 30, marginRight: 5 }}
          />
          {valuePrice}
          <span style={{color: '#292929', marginLeft: 3, fontWeight: 700}}>
            ETH
          </span>
        </span>
      )}
    </div>
  );
}
