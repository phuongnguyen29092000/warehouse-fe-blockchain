import { Button, Grid , TextField } from "@mui/material"
import { makeStyles } from "@material-ui/core/styles";
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { setActiveUrl } from "redux/reducers/activeUrl/action"
import Select from 'react-select'
import AddIcon from '@mui/icons-material/Add';
import ConvertToImageURL from "LogicResolve/ConvertToImageURL";
import { updateAdminInfo } from "redux/reducers/user/action";
import ChangePassForm from "components/modal/modalChangePass/";

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

const AccountAdmin = () => {
    const classes = useStyles();
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const {accountUser} = useSelector(store=> store.user)
    const [loading, setLoading] = useState(false)
    const [imagePreview, setImagePreview] = useState();
    const [openUpdate, setOpenUpdate] = useState(false) 

    useEffect(()=> {
        document.title = 'Warehouse Protection | Tài khoản'
        dispatch(setActiveUrl('account-admin'))
    }, [])

    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        dispatch(updateAdminInfo(accountUser?._id, data, (res)=> {
          console.log({res});
        }))
    };

    useEffect(() => {
        return () => {
            imagePreview && URL.revokeObjectURL(imagePreview.preview);
        }
    }, [imagePreview]);

    const handleChangePreview = (e) => {
        const file = e.target.files[0];
        if (file) file.preview = URL.createObjectURL(file);
        setImagePreview(file);
    };

    const handleCloseUpdate = () => {
        setOpenUpdate(!openUpdate);
    }

    return (
        <div className="manage-account-container">
            <div className="form-infomation-user">
                <h2>
                    Thông tin tài khoản
                </h2>
                <form  className={classes.form} noValidate onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                    <Grid xs={2} item>
                        <div className="" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                            <input type='file' name="photoUrl" onChange={(e)=>handleChangePreview(e)} id='image-0' className='image-select' />
                            <div className='image-slide' style={{margin: 0, marginLeft: 50}}>
                                <div className='image-slide__item' onClick={()=>{document.getElementById('image-0').click()}}>
                                    {(!imagePreview && !accountUser?.photoUrl) && <AddIcon fontSize='large' />}
                                    {imagePreview && <img src={imagePreview.preview}/>}
                                    {(!imagePreview && accountUser?.photoUrl) && <img src={ConvertToImageURL(accountUser?.photoUrl)}/>}
                                </div>
                            </div>
                        </div>
                    </Grid>
                    <Grid xs={5} md={10} item container>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                id="userName"
                                label="Tên đăng nhập"
                                name="userName"
                                autoComplete="userName"
                                defaultValue={accountUser?.userName}
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
                                defaultValue={accountUser?.email}
                            />
                        </Grid>
                    </Grid>
                    </Grid>
                    <div className="btn-edit">
                        <Button variant="contained" style={{padding: '10px 10px' , width: 150}}className='btn-add-product' onClick={() => {
                            setOpenUpdate(true)
                        }}>Đổi mật khẩu</Button>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            style={{marginLeft: 10, width: 120}}
                        >
                            Chỉnh sửa
                        </Button>

                    </div>
                    <ChangePassForm open={openUpdate} handleClose={handleCloseUpdate} action="ĐỔI MẬT KHẨU"/>
                </form>
            </div>
        </div>
    )
}

export default AccountAdmin