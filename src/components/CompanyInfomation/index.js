import { Grid, Rating, Tooltip, Typography } from "@mui/material"
import ConvertToImageURL from "LogicResolve/ConvertToImageURL"
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import Logo from '../../public/logoWarehouse.jpg'
import QrCode2Icon from '@mui/icons-material/QrCode2';
import EmailIcon from '@mui/icons-material/Email';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import LocationOnIcon from '@mui/icons-material/LocationOn';

const CompanyInfomation = ({info}) => {

    return (
        <div className="company-info">
            <Grid container spacing={2}>
                <Grid item xs={6}>
                    <div className="block-left">
                        <div>
                            <img src={ConvertToImageURL(info?.imageUrl) || Logo} alt=''/>
                        </div>
                        <div className="title-company">
                            <h4>
                                {info?.companyName}
                            </h4>
                            <span>
                                {info?.active ? 'Đang hoạt động' : 'Ngừng hoạt động'}
                                <FiberManualRecordIcon fontSize="small" htmlColor={`${info?.active ? '#5AD539': 'gray'}`}/>
                            </span>
                        </div>
                        <div className="rating">
                            <Rating name="customized-rating"
                                defaultValue={5}
                                value={info?.ratingReputation || 5}
                                max={5}
                                precision={0.1}
                                readOnly
                                size="medium"
                                />
                        </div>
                    </div>
                </Grid>
                <Grid item container xs={6}>
                    <Grid item xs={6}>
                        <Typography gutterBottom variant="body1" component="div" align='left' className="info-contact">
                            <QrCode2Icon fontSize="medium" htmlColor="#ee4d2d"/>
                            <Tooltip title="Mã doanh nghiệp" arrow placement="top">
                                <span style={{color: 'rgba(0,0,0,.54)', cursor: 'pointer'}}>
                                {info?.businessCode}
                            </span>
                            </Tooltip>
                        </Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography gutterBottom variant="body1" component="div" align='left' className="info-contact">
                            <EmailIcon fontSize="medium" htmlColor="#ee4d2d"/>
                            <span style={{color: 'rgba(0,0,0,.54)'}}>
                                {info?.email}    
                            </span>
                        </Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography gutterBottom variant="body1" component="div" align='left' className="info-contact">
                            <LocalPhoneIcon fontSize="medium" htmlColor="#ee4d2d"/>
                            <span style={{color: 'rgba(0,0,0,.54)'}}>
                                {info?.phoneNumber || '0395260327'}      
                            </span>
                        </Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography gutterBottom variant="body1" component="div" align='left' className="info-contact">
                            <LocationOnIcon fontSize="medium" htmlColor="#ee4d2d"/>
                            <span style={{color: 'rgba(0,0,0,.54)'}}>
                                {info?.address?.detail || 'Quang Nam'}      
                            </span>
                        </Typography>
                    </Grid>
                </Grid>
            </Grid>
        </div>
    )
}

export default CompanyInfomation