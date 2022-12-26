import React, { useEffect, useState } from 'react';
import { Box, Button, ButtonGroup, Container, Divider, Drawer, Grid, Typography } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Rating from "@mui/material/Rating";
import { styled } from "@mui/material/styles";
import ConvertToImageURL from '../../LogicResolve/ConvertToImageURL'
import { makeStyles } from '@mui/styles';
import PriceDiscount from '../../LogicResolve/PriceDiscount';
import Spinner from 'components/Spinner';
import { getUser } from 'hooks/localAuth';
import _, { isEmpty } from 'lodash';
import moment from 'moment';
import { getProductById, getSimilarProduct } from 'redux/reducers/product/action';
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { Controller, useForm } from 'react-hook-form';
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PaymentIcon from '@mui/icons-material/Payment';
import CartDrawer from 'components/Cart/CartDrawer';
import {DEFAULT_PARAMS} from '../../utils/constant'
import ProductCard from 'components/Cards/ProductCard';
import { Link, useNavigate } from "react-router-dom";
import TabDetail from 'components/TabDetail';
import useNotification from 'hooks/notification';
import { addOrUpdateCart } from 'redux/reducers/cart/action';
import EmptyProductIcon from '../../public/empty-product.jpg'

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
    const { accountUser } = useSelector((store) => store.user)
    const { cartData } = useSelector((store) => store.cart)
    const { loading, data} = productDetail
    const [isShowBookTourModal, setIsShowBookTourModal] = React.useState(false)
    const [count, setCount] = useState(0);
    const [openDrawerCart, setOpenDrawerCart] = useState(false)
    const navigate = useNavigate()

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
        if(!productDetail?.data?._id) return
        if(productDetail.loading) return 
        dispatch(getSimilarProduct({...DEFAULT_PARAMS, subCategoryId: data.subCategory?._id}, (res)=> {
            //
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

    const hanldeAddToCart = (detail) => {
        if(count < detail?.minimumQuantity) {
            useNotification.Error({
                title: "Chú ý!",
                message:`Số lượng sản phẩm phải lớn hơn đơn hàng nhỏ nhất!`,
                duration: 3000
              })
            return  
        }
        if(!Object.keys(accountUser)?.length) {
            useNotification.Error({
              title: "Chú ý!",
              message:`Vui lòng đăng nhập để mua hàng!`,
              duration: 3000
            })
            navigate('/dang-nhap')
            return 
        }
        if(detail?.user?._id === accountUser?._id) {
            useNotification.Error({
              title: "Chú ý!",
              message:`Bạn không thể thực hiện mua sản phẩm của công ty bạn!`,
              duration: 3000
            })
            return 
          }
        const existProduct = cartData?.products?.filter((p)=> p?.product._id.toString()?.includes(detail._id.toString()))
        if(!isEmpty(existProduct)) {
            useNotification.Error({
                title: "Chú ý!",
                message:`Sản phẩm đã có trong giỏ hàng!`,
                duration: 3000
            })
            setOpenDrawerCart(true);
            return 
        }
        const data = {
            product: detail._id,
            quantity: count
        }
        dispatch(addOrUpdateCart(accountUser?._id, data, (res)=> {
        if(res) {
            setOpenDrawerCart(true);
            console.log({res});
        }
        }))
    }

    const handlePayment = (detail) => {  
        if(!Object.keys(accountUser)?.length) {
            useNotification.Error({
              title: "Chú ý!",
              message:`Vui lòng đăng nhập để mua hàng!`,
              duration: 3000
            })
            navigate('/dang-nhap')
            return 
        }
        if(detail?.user?._id === accountUser?._id) {
            useNotification.Error({
              title: "Chú ý!",
              message:`Bạn không thể thực hiện mua sản phẩm của công ty bạn!`,
              duration: 3000
            })
            return 
          }
        const existProduct = cartData?.products?.filter((p)=> p?.product._id.toString()?.includes(detail._id.toString()))
        if(isEmpty(existProduct)) {
            const data = {
                product: detail._id,
                quantity: count
            }
            dispatch(addOrUpdateCart(accountUser?._id, data, (res)=> {
                if(res) {
                    console.log({res});
                }
            }))
        }
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
        <div className='product-detail-wrapper'>
            {loading ? <Spinner /> :
                (!!Object.keys(data)?.length ?
                    <Container maxWidth="lg">
                        <Box sx={{ paddingTop: '70px', paddingLeft: { md: '20px' }, paddingRight: { md: '20px' } }}>
                            <Grid container spacing={2}>
                                <Grid className='tour-slide-wrapper' item md={6} xs={12} style={{ position: "relative", marginBottom: '70px'}}>
                                    <div style={{width: '100%', height: '100%', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', maxHeight: 500}}>
                                        <TransformWrapper>
                                            <TransformComponent>
                                            <img src={ConvertToImageURL(data.imageUrl)} alt="test"/>
                                            </TransformComponent>
                                        </TransformWrapper>
                                        </div>
                                </Grid>
                                <Grid item md={6} xs={12} className='tour-info-wrapper'>
                                    <Typography gutterBottom variant="h4" component="div" align='left'>
                                        {data.productName} 
                                    </Typography>
                                    <Typography gutterBottom variant="h6" component="div" align='left' style={{display:'flex', cursor: 'pointer'}} onClick={()=> navigate(`/kho/${data.user._id}`)}>
                                        {data.user?.companyName}{' '}{!data.user?.active && <h4 style={{marginLeft:'10px',textDecoration:'line-through', color:"#858585"}}>Tạm ngừng hoạt động</h4>}
                                    </Typography>
                                    <Typography gutterBottom variant="body1" component="div" align='left' color="secondary">
                                        <PriceDiscount valueDiscount={data.discount} valuePrice={data.price} />
                                    </Typography>
                                    <Typography gutterBottom variant="body1" component="div" align='left'>
                                        <span style={{ color: 'darkblue', fontWeight: 'bold' }}>Nhà sản xuất: </span>
                                        {data?.manufacturer?.companyName}
                                    </Typography>
                                    <Typography gutterBottom variant="body1" component="div" align='left'>
                                        <span style={{ color: 'darkblue', fontWeight: 'bold' }}>Ngày sản xuất: </span>
                                        {new Date(data?.dateOfManufacture?.slice(0, 10))?.toLocaleDateString("en-GB")}
                                    </Typography>
                                    <Typography gutterBottom variant="body1" component="div" align='left'>
                                        <span style={{ color: 'darkblue', fontWeight: 'bold' }}>Thời hạn bảo hành: </span>
                                        {new Date(data?.warrantyPeriod?.slice(0, 10))?.toLocaleDateString("en-GB")}
                                    </Typography>
                                    <Typography gutterBottom variant="body1" component="div" align='left'>
                                        <span style={{ color: 'darkblue', fontWeight: 'bold' }}>Số lượng còn: </span>{data?.amount}
                                    </Typography>
                                    <Typography gutterBottom variant="body1" component="div" align='left'>
                                        <span style={{ color: 'darkblue', fontWeight: 'bold' }}>Đơn hàng nhỏ nhất: </span>{data?.minimumQuantity}
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
                                                // if(!Number(evt.target.value) && Number(evt.target.value) !==0) return 
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
                            <Grid>
                                <TabDetail detail={data?.description}/>
                            </Grid>
                            <Divider style={{ margin: '10px 0' }} />
                            <Box >
                                {
                                    similarProduct?.length > 0 &&
                                    <div>
                                        <h2 style={{ margin: '60px 0 30px 0', textAlign: 'center', fontFamily: 'monospace', color: 'darkblue' }}>SẢN PHẨM TƯƠNG TỰ</h2>

                                        <div style={{display: 'flex', width: '100%'}}>
                                            {
                                                similarProduct.slice(0,3)?.filter((product)=> product?._id !== id).map((product, index) => (
                                                    <div key={index} style={{padding: '0 10px'}}>
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
                                                    </div>
                                                ))
                                            }
                                        </div>
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
                    </Container> :
                    <div className='empty-product'>
                    <h2 className='title-not-found'>Không tìm thấy sản phẩm phù hợp</h2>
                    <img src={EmptyProductIcon} alt=''/>
                </div>
                )
            }
        </div >
    );
}

export default ProductDetail;