import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { makeStyles } from "@mui/styles";
import { login } from '../../redux/reducers/user/action'
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {ethers} from 'ethers'; 
import useNotification from "hooks/notification";
import { useWeb3React } from "@web3-react/core";
import { injected } from "../../components/Wallet";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import AuthAPI from "apis/AuthAPI";

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}
const useStyles = makeStyles((theme) => ({
  root: {
    height: "100vh",
  },
  image: {
    backgroundImage: "url(https://source.unsplash.com/random)",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
}));

export default function SignIn() {
  const classes = useStyles();
  const dispatch = useDispatch()
  const navigate = useNavigate()
	const {activate, error, active } = useWeb3React();
  const [openModalResetPass, setOpenModalResetPass] = React.useState(false)
  const [emailReset, setEmailReset] = React.useState('')
  
  React.useEffect(()=> {
    document.title = 'Warehouse Protection | Đăng nhập'
  }, [])

  const accountChangedHandler = (account) => {
    console.log(account);
    getUserBalance(account);
  }

  const getUserBalance = (address) => {
    window.ethereum.request({method: 'eth_getBalance', params: [address, 'latest']})
        .then((balance)=> {
            console.log(ethers.utils.formatEther(balance));
        })
  }
  
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    dispatch(login(data, (res)=> {
      useNotification.Success({
        title: "Thành công",
        message:"Đăng nhập thành công!",
        duration: 3000
      })
      if(res?.role === 'user') {
        if (active) {
          return
        }
        try {
          activate(injected)
          console.log('abc');
        } catch (e) {
          console.log(e);
        }
      }
    }))
  };

  const handleForgotPass = async() => {
    await AuthAPI.forgotPassword({email: emailReset}).then((res)=> {
      if(res.status === 200) {
        setOpenModalResetPass(false)
        setEmailReset('')
        useNotification.Success({
          title: "Thành công",
          message:"Vui lòng kiểm tra Email của bạn!",
          duration: 5000
        })
      }else {
        useNotification.Error({
          title: "Thất bại",
          message:"Vui lòng thử lại!",
          duration: 5000
        })
      }
    })
  }

  return (
    <Container component="main" maxWidth="xs" style={{marginBottom: 50}}>
      <CssBaseline />
      <Grid item xs={false} sm={4} md={7} className={classes.image} />
      <Grid item xs={12} sm={8} md={5} elevation={6} square>
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginTop: 25,
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Đăng nhập
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Mật khẩu"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, padding: "10px 0px" }}
            >
              Đăng nhập
            </Button>
            <Grid container>
              <Grid item xs >
                <div style={{color: '#1976d2', textDecoration: 'underline', fontWeight: 400, fontSize: 14, cursor: 'pointer'}}
                  onClick={(e)=> {
                    setOpenModalResetPass(true)
                  }}
                >
                  Quên mật khẩu?
                </div>
              </Grid>
              <Grid item>
                <Link href="/dang-ki" variant="body2">
                  {"Bạn chưa có tài khoản? Đăng kí"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Grid>
      <Copyright sx={{ mt: 4, mb: 4 }} />
      <Dialog open={openModalResetPass} onClose={()=>setOpenModalResetPass(false)}>
        <DialogTitle>Reset Password</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Để reset mật khẩu, Vui lòng nhập email tại đây!. Chúng tôi sẽ gửi thông tin về email của bạn.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Địa chỉ email"
            type="email"
            fullWidth
            variant="standard"
            value={emailReset}
            onChange={(e)=> setEmailReset(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={()=>setOpenModalResetPass(false)}>Hủy</Button>
          <Button onClick={handleForgotPass}>Xác nhận</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
