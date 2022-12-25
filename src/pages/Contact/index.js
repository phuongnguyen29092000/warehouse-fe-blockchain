import React, { useEffect } from 'react';
import { Grid, Typography } from '@mui/material';
import { Box } from '@mui/system';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ShieldIcon from '@mui/icons-material/Shield';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import AccessibilityNewIcon from '@mui/icons-material/AccessibilityNew';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import { setActiveUrl } from 'redux/reducers/activeUrl/action';
import { useDispatch } from 'react-redux';

const Contact = () => {
    const dispatch = useDispatch()
    useEffect(()=>{
        document.title = "Warehouse Protection | Liên hệ";
        dispatch(setActiveUrl('contact'))
    },[])
    return (
        <div className='contact-component'>
            <Box className='contact-infor'>
                <Typography className='slogan' variant='h4' component='div'>
                    "Hãy đến với chúng tôi"
                </Typography>
                <div className='contact-infor__body'>
                    <div className='contact-infor__body--wrapper'>
                    <div className='infor-wrapper'>
                        <div className='icon-infor'><ShieldIcon color='warning' /></div>
                        <div className='title-infor'>An toàn</div>
                    </div>
                    <div className='infor-wrapper'>
                        <div className='icon-infor'><AccessibilityNewIcon color='warning' /></div>
                        <div className='title-infor'>Uy tín</div>
                    </div>
                    <div className='infor-wrapper'>
                        <div className='icon-infor'><LocalPhoneIcon color='warning' /></div>
                        <div className='title-infor'>0395.260.327</div>
                    </div>
                    <div className='infor-wrapper'>
                        <div className='icon-infor'><MailOutlineIcon color='warning' /></div>
                        <div className='title-infor'>warehouse-protection29@gmail.com</div>
                    </div>
                    </div>
                </div>
            </Box>
            <Box className='map-location'>
                <Grid container spacing={2} justifyContent='center'>
                    <Grid item md={6} xs={12} alignItems="center" >
                        <iframe width="100%" height="100%" style={{minHeight:'400px', borderRadius:'10px'}} id="gmap_canvas" src="https://maps.google.com/maps?q=%C4%90%E1%BA%A1i%20h%E1%BB%8Dc%20b%C3%A1ch%20khoa%20-%20%C4%91%E1%BA%A1i%20h%E1%BB%8Dc%20%C4%90%C3%A0%20N%E1%BA%B5ng&t=&z=17&ie=UTF8&iwloc=&output=embed" frameborder="0" scrolling="no" marginheight="0" marginwidth="0"></iframe>
                    </Grid>
                </Grid> 
            </Box>
        </div>
    );
};

export default Contact;