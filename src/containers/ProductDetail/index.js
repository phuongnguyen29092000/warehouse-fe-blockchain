import React, { useEffect, useState } from 'react';
import { Box, Button, ButtonGroup, Container, Divider, Drawer, Grid, Typography } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import Slider from 'react-slick';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Rating from "@mui/material/Rating";
import { styled } from "@mui/material/styles";
import ConvertToImageURL from '../../LogicResolve/ConvertToImageURL'
import { makeStyles } from '@mui/styles';
import PriceDiscount from '../../LogicResolve/PriceDiscount';
// import TabDetail from '../../components/TabDetail';
import Spinner from 'components/Spinner';
import { getUser } from 'hooks/localAuth';
// import BookTourModal from 'components/modal/BookTourModal';
import _ from 'lodash';
import moment from 'moment';
// import { setActiveUrl } from 'redux/reducers/activeUrl/action';
import { getProductById, getSimilarProduct } from 'redux/reducers/product/action';
// import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { Controller, useForm } from 'react-hook-form';
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PaymentIcon from '@mui/icons-material/Payment';
import CartDrawer from 'components/Cart/CartDrawer';
import {DEFAULT_PARAMS} from '../../utils/constant'
import ProductCard from 'components/Cards/ProductCard';
import { Link, useNavigate } from "react-router-dom";

const useStyles = makeStyles({
    avatar: {
        positionSize: 'cover',
        width: '100%',
    },
    sliderContainer: {
        "& .slick-list": {
            paddingBottom: "10px",
        },
    },
});

const PreArrow = (props) => {
    const { className, style, onClick } = props
    return (
        <div
            className={className}
            onClick={onClick}
            style={{
                ...style, zIndex: 10, overflow: 'hidden', left: '-5px', width: '24px', height: '24px',
            }}
        >
            <ArrowBackIosNewIcon
                color='action'
                sx={{
                    position: 'absolute',
                    zIndex: 10,
                    left: 0,
                    transition: '0.4s',
                    ":hover": {
                        color: 'black',
                        left: '-2px'
                    }
                }}
            />
        </div>
    );
}
const NextArrow = (props) => {
    const { className, style, onClick } = props
    return (
        <div
            className={className}
            onClick={onClick}
            style={{
                ...style, zIndex: 10, overflow: 'hidden', right: '-5px', width: '24px', height: '24px',
            }}
        >
            <ArrowForwardIosIcon
                color='action'
                sx={{
                    position: 'absolute',
                    zIndex: 10,
                    right: 0,
                    transition: '0.4s',
                    ":hover": {
                        color: 'black',
                        right: '-2px'
                    }
                }}
            />
        </div>
    );
}

function ProductDetail() {
    const classes = useStyles();
    const { id } = useParams();
    const [rating, setRating] = useState(0);
    const [slides, setSlides] = useState([]);
    const dispatch = useDispatch();
    const { productDetail, similarProduct } = useSelector((store) => store.product)
    const { loading, data} = productDetail
    const [isShowBookTourModal, setIsShowBookTourModal] = React.useState(false)
    const [count, setCount] = useState(0);
    const [openDrawerCart, setOpenDrawerCart] = useState(false)
    const navigate = useNavigate()
    // const [similarProducts, setSimilarProducts] = useState([])

    const handleOnClick = () => {
        setIsShowBookTourModal(true);
    }
    const {
        register,
        handleSubmit,
        reset,
        control,
        formState: { errors },
    } = useForm();

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [id])
    useEffect(() => {
        dispatch(getProductById(id, (res)=> {
            setCount(res?.minimumQuantity)
        }))
    }, [id])
    
    useEffect(()=> {
        if(productDetail.loading) return 
        dispatch(getSimilarProduct({...DEFAULT_PARAMS, subCategoryId: data.subCategory?._id}, (res)=> {
            // setSimilarProducts(res?.filter((p)=> p._id !== data?._id).slice(0, 3))
        }))
    }, [data.subCategory])

    useEffect(() => {
        let temp = []
        if(data?.imageSlide){
            temp = _.cloneDeep(data.imageSlide)
        }
        setSlides([data.imageAvatar,...temp])
    }, [data])
    
    useEffect(() => {
        document.title = 'Warehouse Protection | Chi tiết'
    }, [])

    const handleIncrement = (onChange) => {
        let countNext = count + 1;
        onChange(countNext);
        setCount(countNext);
    }
    const handleDecrement = (onChange) => {
        let countNext = count - 1;
        onChange(countNext);
        setCount(countNext);
    }
    const hanldeAddToCart = (detail) => {
        setOpenDrawerCart(true)
        if(count < data?.minimumQuantity) return 
        const products = (JSON.parse(localStorage.getItem('products')))?.length 
        ? JSON.parse(localStorage.getItem('products')) : [];
        if(!products.every((item)=> !item.id.includes(detail._id))) return
        localStorage.setItem('products', JSON.stringify([...products, {...detail, count: count}]));
    }

    const handlePayment = (data) => {
        hanldeAddToCart(data)
        navigate('/gio-hang')
    }

    const settings = {
        className: classes.sliderContainer,
        dots: false,
        arrows: true,
        infinite: true,
        autoplay: true,
        speed: 500,
        autoplaySpeed: 3000,
        slidesToShow: 3,
        slidesToScroll: 1,
        pauseOnHover: true,
        prevArrow: <PreArrow />,
        nextArrow: <NextArrow />,
        responsive: [
            {
                breakpoint: 1080,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                    initialSlide: 1
                }
            },
            {
                breakpoint: 710,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    initialSlide: 1
                }
            },
        ]
    };
    
    return (
        <div className='tour-detail-wrapper'>
            {loading ? <Spinner /> :
                (data &&
                    <Container maxWidth="lg">
                        <Box sx={{ paddingTop: '70px', paddingLeft: { md: '60px' }, paddingRight: { md: '60px' } }}>
                            <Grid container spacing={2}>
                                <Grid className='tour-slide-wrapper' item md={6} xs={12} style={{ position: "relative", marginBottom: '70px'}}>
                                    <div style={{width: '100%', height: '100%', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                                        {/* <TransformWrapper>
                                            <TransformComponent> */}
                                            <img src={ConvertToImageURL(data.imageUrl)} alt="test"/>
                                            {/* </TransformComponent>
                                        </TransformWrapper> */}
                                        </div>
                                </Grid>
                                <Grid item md={6} xs={12} className='tour-info-wrapper'>
                                    <Typography gutterBottom variant="h4" component="div" align='left'>
                                        {data.productName} 
                                    </Typography>
                                    <Typography gutterBottom variant="h6" component="div" align='left' style={{display:'flex'}}>
                                        {data.user?.companyName}{' '}{!data.user?.active && <h4 style={{marginLeft:'10px',textDecoration:'line-through', color:"#858585"}}>Tạm ngừng hoạt động</h4>}
                                    </Typography>
                                    <Typography gutterBottom variant="body1" component="div" align='left' color="secondary">
                                        <PriceDiscount valueDiscount={data.discount} valuePrice={data.price} />
                                    </Typography>
                                    {/* <Typography gutterBottom component="div" variant="body1" align="left" style={{ display: 'flex', fontFamily: 'system-ui', color: 'gray' }}>
                                        <Rating name="customized-rating"
                                            defaultValue={data.ratingsAverage}
                                            value={rating}
                                            max={5}
                                            precision={0.1}
                                            readOnly
                                            size="medium"
                                        />
                                    </Typography> */}
                                    <Typography gutterBottom variant="body1" component="div" align='left'>
                                        <span style={{ color: 'darkblue', fontWeight: 'bold' }}>Nhà sản xuất: </span>
                                        {data?.manufacturer?.companyName}
                                    </Typography>
                                    <Typography gutterBottom variant="body1" component="div" align='left'>
                                        <span style={{ color: 'darkblue', fontWeight: 'bold' }}>Ngày sản xuất: </span>
                                        {new Date(data?.dateOfInventory?.slice(0, 10))?.toLocaleDateString("en-GB")}
                                    </Typography>
                                    <Typography gutterBottom variant="body1" component="div" align='left'>
                                        <span style={{ color: 'darkblue', fontWeight: 'bold' }}>Thời hạn bảo hành: </span>
                                        {new Date(data?.warrantyPeriod?.slice(0, 10))?.toLocaleDateString("en-GB")}
                                    </Typography>
                                    <Typography gutterBottom variant="body1" component="div" align='left'>
                                        <span style={{ color: 'darkblue', fontWeight: 'bold' }}>Số lượng còn: </span>{data?.amount}
                                    </Typography>
                                    <Typography gutterBottom variant="body1" component="div" align='left'>
                                        <span style={{ color: 'darkblue', fontWeight: 'bold' }}>Trạng thái: </span>{data?.isSelling ? ' Đang bán' : 'Ngừng bán'}
                                    </Typography>
                                    <Typography gutterBottom variant="body1" component="div" align='left'>
                                    <span style={{ color: 'darkblue', fontWeight: 'bold' }}>Số lượng: </span>
                                        <ButtonGroup size="small" style={{ width: '100px' }}>
                                            <Button disabled={count <= data?.minimumQuantity}
                                                onClick={() => setCount(p=> p-1)}
                                            >-</Button>
                                            <input type='text' value={count} pattern="[0-9]" style={{background: '#E4EFF5', border: '0.5px solid rgb(210 205 205)', width: 70, textAlign: 'center', outline: 'none'
                                            }} onChange={(evt)=> {
                                                if(!Number(evt.target.value) && Number(evt.target.value) !==0) return 
                                                setCount(Number(evt.target.value))
                                            }}>
                                            </input>    
                                            <Button disabled={count >= data?.amount}
                                                onClick={() => setCount(p=> p+1)}
                                            >+</Button>
                                        </ButtonGroup>
                                    </Typography>
                                    <div style={{display: 'flex', marginTop: 10}}>
                                        <Typography gutterBottom variant="button" component="div" align='left'>
                                            <Button variant="contained" color="warning" sx={{marginRight: 1, height: 50}}
                                                // disabled={!getUser() || !data?.owner?.active || moment(data.timeStart).subtract(5, 'days').toDate().getTime() <  Date.now()}
                                                onClick={() => hanldeAddToCart(data)}
                                                >
                                                <div style={{display: 'flex', alignItems: 'center', paddingRight: 10, marginRight: 10, borderRight: '2px solid #fff'}}>
                                                    <ShoppingCartIcon />
                                                </div>
                                                Thêm vào giỏ
                                                </Button>
                                        </Typography>
                                        <Typography gutterBottom variant="button" component="div" align='left'>
                                            <Button variant="outlined" color="warning"
                                                // disabled={!getUser() || !data?.owner?.active || moment(data.timeStart).subtract(5, 'days').toDate().getTime() <  Date.now()}
                                                onClick={() => handlePayment(data)} sx={{height: 50}}>
                                                <div style={{display: 'flex', alignItems: 'center', paddingRight: 10, marginRight: 10, borderRight: '2px solid orange'}}>
                                                    <PaymentIcon />
                                                </div>
                                                Thanh toán
                                                </Button>
                                        </Typography>
                                    </div>
                                    <Divider style={{ margin: '10px 0' }} />
                                    <Typography gutterBottom variant="body1" component="div" align='left'>
                                        <span style={{ color: 'darkblue', fontWeight: 'bold' }}>Loại sản phẩm: </span>
                                        {data?.subCategory?.name}
                                    </Typography>
                                    <Typography gutterBottom variant="body1" component="div" align='left' style={{ display: 'flex', alignItems: 'center' }}>
                                        <span style={{ color: 'darkblue', fontWeight: 'bold' }}>Share on: </span> <FacebookIcon fontSize="large" color="warning" /> <InstagramIcon fontSize="large" color="warning" /> <LinkedInIcon fontSize="large" color='warning' />
                                    </Typography>
                                </Grid>
                            </Grid>

                            <Divider style={{ margin: '10px 0' }} />
                            {/* <Grid>
                                <TabDetail detail={data?.schedule} feedback={listFeedback} onHandleSendFeedback={onHandleSendFeedback} />
                            </Grid> */}
                            {console.log(similarProduct)}
                            <Box sx={{ padding: '20px' }}>
                                {
                                    similarProduct?.length > 0 &&
                                    <div>
                                        <h2 style={{ margin: '20px 0', textAlign: 'center', fontFamily: 'monospace', color: 'darkblue' }}>SẢN PHẨM TƯƠNG TỰ</h2>

                                        <Slider {...settings} style={{ padding: '20px'}}>
                                            {
                                                similarProduct.map((product, index) => (
                                                    <ProductCard
                                                        _id={product._id}
                                                        productName={product.productName}
                                                        description={product.description}
                                                        companyName={product?.user?.companyName}
                                                        imageUrl={ConvertToImageURL(product.imageUrl)}
                                                        price={product.price}
                                                        active={product?.user?.active}
                                                        dateOfInventory={product.dateOfInventory}
                                                        minimumQuantity={product.minimumQuantity}
                                                        manufacturer={product.manufacturer.companyName}
                                                        discount={product?.discount}
                                                        setOpenDrawerCart={setOpenDrawerCart}
                                                        dataDetail={product}
                                                />
                                                ))
                                            }
                                        </Slider>
                                    </div>
                                }
                            </Box>
                        </Box>
                        <Drawer
                            anchor='right'
                            open={openDrawerCart}
                            onClose={() => setOpenDrawerCart(false)}
                        >
                            <CartDrawer onClose={() => setOpenDrawerCart(false)}/>
                        </Drawer>
                    </Container>
                )
            }
        </div >
    );
}

export default ProductDetail;