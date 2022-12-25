import React, { useEffect, useState } from "react";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import AuthAPI from "apis/AuthAPI";
import { useNavigate, useSearchParams } from "react-router-dom";
import useNotification from "hooks/notification";
import { Button, TextField } from "@mui/material";

function ResetPassWord() {
	const navigate = useNavigate()
	const [searchParams] = useSearchParams()
	const [open, setOpen] = useState(true)
	const [ values, setValues] = useState({password: '', confirmPassword: ''})

  useEffect(() => {
		if(!searchParams.get('token')) {
			navigate('/')
			return
		}
  }, [])

	const handleClose = () => {
		setOpen(false)
		navigate('/')
	}

	const handleUpdate = async() => {
		if(!values?.password || !values?.confirmPassword) {
			return useNotification.Error({
        title: "Thất bại",
        message:"Vui lòng nhập đầy đủ thông tin!",
        duration: 3000
      })
		}
		if(values?.password !== values?.confirmPassword) {
			return useNotification.Error({
        title: "Thất bại",
        message:"Xác nhận mật khẩu không đúng. Vui lòng thử lại!",
        duration: 3000
      })
		}
		await AuthAPI.resetPassword(searchParams.get('token'), 
			{
				password: values?.password, 
				confirmPassword: values?.confirmPassword}
			).then((res)=> {
				console.log({res});
				if(res.status === 200) {
					useNotification.Success({
						title: "Thành công",
						message:"Đặt lại mật khẩu thành công. Vui lòng đăng nhập!",
						duration: 4000
					})
					navigate('/dang-nhap')
				} 
			}
		).catch(()=> {
			useNotification.Error({
				title: "Lỗi",
				message:"Đặt lại mật khẩu lỗi!",
				duration: 4000
			})
		})
	}

  return (
    <div
      className="home-page"
      style={{
        background: "#f4f4f4",
        height: "100%",
        minHeight: 1500,
      }}
    >
      <div className="home-page-container">
        <Dialog
          open={open}
          onClose={handleClose}
        >
          <DialogTitle>Đặt lại mật khẩu mới</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Vui lòng đặt lại mật khẩu tại đây!
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="password"
              label="Mật khẩu mới"
              type="password"
              fullWidth
              variant="standard"
              value={values?.password}
              onChange={(e) => setValues((prev)=> ({...prev, password: e.target.value}))}
            />
						 <TextField
              autoFocus
              margin="dense"
              id="password"
              label="Xác nhận mật khẩu mới"
              type="password"
              fullWidth
              variant="standard"
              value={values?.confirmPassword}
              onChange={(e) => setValues((prev)=> ({...prev, confirmPassword: e.target.value}))}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Hủy</Button>
            <Button onClick={handleUpdate}>Xác nhận</Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
}

export default ResetPassWord;
