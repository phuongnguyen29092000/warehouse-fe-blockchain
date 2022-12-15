import AppBar from "@mui/material/AppBar";
import Container from "@mui/material/Container";
import Logo from "../../public/logoWarehouse.jpg";
import SearchBox from "components/SearchBox";
import React, { useEffect, useState } from "react";
import PersonIcon from "@mui/icons-material/Person";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import HistoryIcon from "@mui/icons-material/History";
import ContactMailIcon from "@mui/icons-material/ContactMail";
import { Link, useNavigate } from "react-router-dom";
import { Button, IconButton, Menu, MenuItem } from "@mui/material";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { logout } from "redux/reducers/user/action";
import { useDispatch, useSelector } from "react-redux";
import useNotification from "hooks/notification";
import { useWeb3React } from "@web3-react/core";
import LoginIcon from '@mui/icons-material/Login';
import { ROUTE_WAREHOUSE_COMPANY, ROUTE_MANAGE_OWNER} from 'route/type'
import { injected } from "components/Wallet";
import ConvertToImageURL from "LogicResolve/ConvertToImageURL";

const Header = () => {
  const [auth, setAuth] = React.useState(true);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { accountUser } = useSelector((store) => store.user)
  const { cartData } = useSelector((store) => store.cart)
	const { active, deactive, account } = useWeb3React();

  const handleChange = (event) => {
    setAuth(event.target.checked);
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar
      position="fixed"
      style={{
        minHeight: "50px",
        backgroundColor: "#fff",
        paddingRight: "0 !important",
      }}
    >
      <Container maxWidth="xl" sx={{ display: "flex" }}>
        <div
          style={{
            width: "100%",
            padding: "10px 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <img src={Logo} style={{ width: 70, height: 70, marginRight: 50 }} onClick={()=> {
            navigate('/')
          }}/>
          <SearchBox />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "5px",
              marginLeft: 30,
            }}
          >
            <Link style={{ textDecoration: "none", width: 90, position: 'relative'}} to={"/gio-hang"}>
              <div style={{ width: "100%", height: 30 }}>
                <ShoppingCartIcon fontSize="medium" color="action" />
              </div>
              <span style={{ fontSize: 12, color: "#292929" }}>Cart</span>
              {
                !!cartData?.products?.length && 
                <div style={{position: 'absolute', top: '-8px', right: 25}}>
                    <div
                      style={{
                        width: 16, 
                        height: 16,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '50%',
                        background: '#f04e23',
                        color: '#fff'
                      }}
                    >
                      <span style={{fontSize: 10}}>{cartData?.products?.length}</span>
                    </div>
                </div>
              }
            </Link>

            <Link style={{ textDecoration: "none", width: 90 }} to={"/"}>
              <div style={{ width: "100%", height: 30 }}>
                <HistoryIcon fontSize="medium" color="action" />
              </div>
              <span style={{ fontSize: 12, color: "#292929" }}>Orders</span>
            </Link>

            <Link style={{ textDecoration: "none", width: 90 }} to={"/contact"}>
              <div style={{ width: "100%", height: 30 }}>
                <ContactMailIcon fontSize="medium" color="action" />
              </div>
              <span style={{ fontSize: 12, color: "#292929" }}>Contact</span>
            </Link>
          </div>
          <div style={{ marginLeft: 20 }}>
            {
              !Object.keys(accountUser)?.length ?
                <Link style={{ textDecoration: "none", width: 90 }} to={"/dang-nhap"}>
                  <LoginIcon fontSize="large" htmlColor="gray"/>
                </Link>
              : <>
                <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleMenu}
                  color="default"
                  style={{ background: "rgb(233 230 230)", padding: 0}}
                >
                  {
                    accountUser?.photoUrl ? 
                    <img src={ConvertToImageURL(accountUser?.photoUrl)} style={{width: 50, height: 50, borderRadius: '50%'}}/>
                    : 
                  <AccountCircle sx={{ width: 50, height: 50 }} />
                  }
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                >
                  <MenuItem onClick={()=> {
                    if(accountUser.role === 'user') {
                      navigate(ROUTE_WAREHOUSE_COMPANY)
                    } else navigate(ROUTE_MANAGE_OWNER)
                    handleClose()
                  }}>Tài khoản</MenuItem>
                  <MenuItem onClick={()=> {
                    dispatch(logout(async(res)=> {
                      if(res){
                        try {
                          deactive();
                          console.log({active});
                        } catch (e) {
                          console.log(e);
                        }
                      }
                    }))
                    handleClose()
                    navigate('/')
                  }}>Đăng xuất</MenuItem>
                </Menu>
              </>
            }
          </div>
        </div>
      </Container>
    </AppBar>
  );
};

export default Header;
