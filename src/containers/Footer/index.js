import React from 'react';
import { Box, Button, Grid, TextField, Typography } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import logo from "../../public/logoWarehouse.jpg";
import { useSelector } from 'react-redux';

function Footer(props) {

    const {activePage} = useSelector(store => store.activeUrl)
    if(activePage === 'cart-url') return null 

    return (
        <div className='footer-wrapper'
            style={{
                backgroundImage: "url('http://mauweb.monamedia.net//trabble//wp-content//uploads//2018//12//subscribe-1.jpg)",
                backgroundSize: 'cover',
            }}>
            <Box sx={{ flexGrow: 1, padding: '50px 30px', backgroundColor: '#000000db' }}>
                <Grid container>
                    <Grid item xs={12} md={3} sm={6}>
                        <Typography variant="h6" color="white" align="left" component='div'>
                            THÔNG TIN
                        </Typography>
                        <Typography variant='body1' align='left' component='div'>
                            <ul style={{ listStyle: 'none', padding: 0 }} className='students'>
                                <li><a href="https://www.facebook.com/nguyen.h.nguyen.50999" target="_blank">Nguyễn Hoàng Phương Nguyên</a></li>
                            </ul>
                        </Typography>
                    </Grid>
                    <Grid item xs={12} md={3} sm={6}>
                        <Typography variant="h6" color="white" align="left" component='div'>
                            LIÊN HỆ
                        </Typography>
                        <Typography variant='body1' align='left' component='div'>
                            <ul style={{ listStyle: 'none', padding: 0 }} className='address'>
                                <li style={{display:'flex', color: '#fff'}}><LocationOnIcon color='warning' />&nbsp;Đại học Bách Khoa Đà Nẵng</li>
                                <li style={{display:'flex', color: '#fff'}}><LocalPhoneIcon color='warning' />&nbsp;0395260327</li>
                                <li style={{display:'flex', color: '#fff'}}><MailOutlineIcon color='warning' />&nbsp;warehouse-protection29@gmail.com</li>
                                <li style={{display:'flex', color: '#fff'}}><FacebookIcon color='warning'/><InstagramIcon color='warning' sx={{marginLeft:'5px'}}/><TwitterIcon color='warning' sx={{marginLeft:'5px'}}/></li>
                            </ul>
                        </Typography>
                    </Grid>
                    <Grid item xs={12} md={3} sm={6}>
                        <Typography variant="h6" color="white" align="left" component='div'>
                            PHỔ BIẾN
                        </Typography>
                        <Typography variant='body1' align='left' component='div'>
                            <ul style={{ listStyle: 'none', padding: 0 }} className='address'>
                                <li><LocalOfferIcon color='warning' /> Vi điều khiển</li>
                                <li><LocalOfferIcon color='warning'h /> IC chức năng</li>
                                <li><LocalOfferIcon color='warning' /> Bán dẫn</li>
                            </ul>
                        </Typography>
                    </Grid>
                    <Grid item xs={12} md={3} sm={6}>
                        <Typography variant="h6" color="white" align="left" component='div'>
                            KẾT NỐI VỚI CHÚNG TÔI
                        </Typography>
                        <Typography variant="body1" align="left" component='div'>
                            <TextField id="submit-gmail-tf"
                                error placeholder='Your gmail...'
                                sx={{
                                    backgroundColor: 'white', borderRadius: '5px', height: '50px', marginRight: '10px'
                                }}
                                inputProps={{
                                    style: {
                                        padding: '10px',
                                        height: '30px',
                                    },
                                }} />
                            <Button sx={{ height: '50px', backgroundColor: 'khaki', border: '1px solid white' }}>SUBMIT</Button>
                        </Typography>
                        <Box sx={{ marginTop: '30px'}}>
                            <img src={logo} height="120px"/>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </div>
    );
}

export default Footer;