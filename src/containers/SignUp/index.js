import React, { useState } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { useNavigate } from "react-router-dom";
import { signup } from "redux/reducers/user/action";
import { useDispatch } from "react-redux";
import {ethers} from 'ethers';

const useStyles = makeStyles(theme => ({
  "@global": {
    body: {
      backgroundColor: theme.palette.common.white
    }
  },
  paper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
		marginTop: 200
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main
  },
  form: {
    width: "100%",
    marginTop: theme.spacing(3)
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  }
}));

export default function SignUp() {
  const classes = useStyles();
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [valueAddress, setValueAddress] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    // if(data.get('password') !== data.get('confirmPassword')) {
    //   setError('Không trùng khớp. Vui lòng xác nhận lại mật khẩu!')
    //   return
    // }
    const body = {
      companyName: data.get('companyName'),
      walletAddress: data.get('walletAddress'),
      businessCode: data.get('businessCode'),
      userName: data.get('userName'),
      email: data.get('email'),
      password: data.get('password'),
    }
    dispatch(signup(body, (res)=> {
      if(res) navigate('/')
    }))
  };

  const handleConnectMetamask = () => {
    if(window.ethereum) {
        window.ethereum.request({method: 'eth_requestAccounts'})
            .then(res=> {
                accountChangedHandler(res[0])
            })     
    } else {
        alert('Vui lòng tải ví metamask để thanh toán!')
        window.open(
            'https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn',
            '_blank'
          );
    }
  }

  const accountChangedHandler = (account) => {
    setValueAddress(account)
    getUserBalance(account);
  }

  const getUserBalance = (address) => {
    window.ethereum.request({method: 'eth_getBalance', params: [address, 'latest']})
        .then((balance)=> {
            console.log(ethers.utils.formatEther(balance));
        })
  }

  window?.ethereum?.on('accountsChanged', accountChangedHandler)

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Đăng kí
        </Typography>
        <form className={classes.form} noValidate onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                autoComplete="companyName"
                name="companyName"
                variant="outlined"
                required
                fullWidth
                id="companyName"
                label="Tên doanh nghiệp/công ty"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                autoComplete="walletAddress"
                name="walletAddress"
                variant="outlined"
                required
                fullWidth
                id="walletAddress"
                label="Địa chỉ ví Metmask"
                value={valueAddress}
                onClick={handleConnectMetamask}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="businessCode"
                label="Mã doanh nghiệp"
                name="businessCode"
                autoComplete="businessCode"
              />
            </Grid>
						<Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="userName"
                label="Tên đăng nhập"
                name="userName"
                autoComplete="userName"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="email"
                label="Địa chỉ Email"
                name="email"
                autoComplete="email"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="phone"
                label="Điện thoại liên hệ"
                name="phone"
                autoComplete="phone"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="password"
                label="Mật khẩu"
                type="password"
                id="password"
                autoComplete="current-password"
                onChange={()=> setError('')}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="password"
                label="Xác nhận mật khẩu"
                type="password"
                id="comfirmPassword"
                autoComplete="current-password"
                onChange={()=> setError('')}
              />
            </Grid>
            {
              error && <Grid>
                <span style={{fontSize: 15, color: 'red', marginLeft: 8}}>{error}</span>
              </Grid>
            }
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
						style={{padding: '10px 0'}}
          >
            Sign Up
          </Button>
          <Grid container justify="center">
            <Grid item>
              <Link href="/dang-nhap" variant="body2">
                Đã có tài khoản? Đăng nhập
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
}
