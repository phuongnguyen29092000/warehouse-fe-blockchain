import AppBar from "@mui/material/AppBar";
import Container from "@mui/material/Container";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Divider, Grid, IconButton, Menu, MenuItem, TextField, Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import PriceDiscount from "LogicResolve/PriceDiscount";
import { height } from "@mui/system";
import {getDistrict, getProvince, getWard} from '../../apis/apiAddress'
import Select from 'react-select'
import Spinner from "components/Spinner";
import PaymentIcon from '@mui/icons-material/Payment';
import MetamaskIcon from '../../public/MetaMask_Fox.png'
import ConvertToImageURL from "LogicResolve/ConvertToImageURL";
import EmptyCart from '../../public/emptyCart.jpg'
import ShopIcon from '@mui/icons-material/Shop';
import Tooltip from '@mui/material/Tooltip';

const CartPage = () => {
  const [auth, setAuth] = React.useState(true);
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState([]);
  const [stateAddress, setStateAddress] = useState({
    cityOptions: [],
    districtOptions: [],
    wardOptions: [],
    selectedCity: null,
    selectedDistrict: null,
    selectedWard: null
  });
  const [totalPrice, setTotalPrice] = useState(0)

  const {cityOptions, districtOptions, wardOptions, selectedCity, selectedDistrict, selectedWard} = stateAddress
  
  useEffect(()=> {
    document.title = 'Giỏ hàng'  
    const productsStore = JSON.parse(localStorage.getItem("products"));
    if (!productsStore?.length) return;
    setData(productsStore);

  },[])

  useEffect(() => {
    if(!data?.length) return
      setLoading(true)
      const fetchProvinces = async() => {
        
        await getProvince().then(res=> {
        const data = res.data.data.map((pro)=> ({...pro, label: pro.name, value: pro.name}))
        setStateAddress((prev)=> ({
            ...prev, 
            cityOptions: data,
            selectedCity: data[0]
        }))
    }).then(()=> setLoading(false))
    
    }
    fetchProvinces()
  }, []);

  useEffect(()=> {
    if(!data?.length) return
    const totalPrice = data.reduce((total, value) => {
        const {count, price, discount} = value
        return total + count*price*(1 - discount)
    }, 0)
    setTotalPrice(totalPrice)
  }, [data])

  const onCitySelect = async(option) => {
    await getDistrict(option.id).then((res)=> {
        const dataDistricts = res.data.data.map((dis)=> ({...dis, label: dis.name, value: dis.name}))
        if (option !== selectedCity) {
          setStateAddress({
              ...stateAddress,
              districtOptions: dataDistricts,
              selectedCity: option,
              selectedDistrict: dataDistricts[0],
            });
        }
    })
    .then(()=> setLoading(false))
  }

  const onDistrictSelect = async(option) => {
    await getWard(option.id).then((res)=> {
        const dataWards = res.data.data.map((ward)=> ({...ward, label: ward.name, value: ward.name}))
        if (option !== selectedDistrict) {
            setStateAddress({
                ...stateAddress,
                wardOptions: dataWards,
                selectedDistrict: option,
                selectedWard: dataWards[0]
              });
          }
    }).then(()=> setLoading(false))
  }

  const handleRemoveProduct = (id) => {
    const products = JSON.parse(localStorage.getItem("products")).filter(
        (item) => item._id !== id
      );
      setData([...products]);
      localStorage.setItem("products", JSON.stringify(products));
  }

  const hanleChangeCount = (value, product) => {
    const newCount = Number(value)
    if(newCount < product.minimumQuantity) return
    const {_id} = product
    const products = JSON.parse(localStorage.getItem('products'))
    const newCarts = products.map((product)=> {
        if(_id === product._id) return { ...product, count: newCount}
        return product
    })
    localStorage.setItem('products', JSON.stringify(newCarts));
    setData(newCarts)
  }

  const handlePayment = () => {
    //
  }

  return (
    <AppBar
      position="fixed"
      style={{
        marginTop: 100,
        backgroundColor: data?.length !== 0 ? "rgb(244, 244, 244)" : '#fff',
        paddingRight: "0 !important",
        padding: '0 100px 50px 100px',
        height: '100%',
        overflowY: 'scroll',
      }}
    >
        {
            loading ? <Spinner /> : 
            <>
            {
                data?.length === 0 ? 
                    <div className="empty-cart">
                    <span style={{fontSize: 18, fontWeight: 600, color: '#292929'}}>
                        Giỏ hàng của bạn hiện chưa có sản phẩm nào!
                    </span>
                    <img src={EmptyCart} alt=''/>
                    <Button variant="contained" color="warning" style={{width: '270px', height: 60, marginTop: 30, display: 'flex', marginLeft: 'auto', marginRight: 'auto'}} onClick={()=> navigate('/')}>
                        <div style={{height: 30, marginRight: 20, paddingRight: 20, borderRight: '1px solid #fff'}}>
                            <ShopIcon sx={{width: '40px', height: '40px', marginTop: '-5px'}}/>
                        </div>Tiếp tục mua hàng
                        </Button>
                    </div> : 
                    <Container maxWidth="xl" sx={{ display: "flex", width: '100%', padding: 2,borderRadius: 3, background: '#fff', height: 'auto', paddingBottom:'50px'}}>
                        <Grid container xs={12} spacing={2} style={{width: '100%', marginLeft: '-8px'}}>
                            <Grid item container xs={12} className='list-product'>
                                <Grid item container xs={12} className='cart-header' style={{maxHeight: 60}}>
                                    <Grid item xs={5}>
                                        <Typography gutterBottom variant="body1" component="div" align='left'>
                                            <span style={{ color: 'darkblue', fontWeight: 'bold' }}>Sản phẩm</span>
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={2}>
                                        <Typography gutterBottom variant="body1" component="div" align='right'>
                                            <span style={{ color: 'darkblue', fontWeight: 'bold' }}>Giá</span>
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={2}>
                                        <Typography gutterBottom variant="body1" component="div" align='right'>
                                            <span style={{ color: 'darkblue', fontWeight: 'bold' }}>Số lượng</span>
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={2}>
                                        <Typography gutterBottom variant="body1" component="div" align='right'>
                                            <span style={{ color: 'darkblue', fontWeight: 'bold' }}>Tạm tính</span>
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={1}>
                                        <Typography gutterBottom variant="body1" component="div" align='right'>
                                            <span style={{ color: 'darkblue', fontWeight: 'bold' }}>Xóa</span>
                                        </Typography>
                                    </Grid>
                                </Grid>
                                {
                                    !!data?.length && (
                                        data.map((product, index)=> {
                                            return <Grid  key={index} container item xs={12} className='line-product'>
                                                <Grid item xs={5} className="grid-cart" style={{justifyContent: 'normal'}}>
                                                    <div style={{display: 'flex', alignItems: 'center'}}>
                                                            <img
                                                                src={ConvertToImageURL(product.imageUrl)}
                                                                style={{ width: 80, height: 80, marginRight: 8, cursor: 'pointer'}}
                                                                alt=""
                                                                onClick={() => navigate(`/chi-tiet-san-pham/${product._id}`)}
                                                            />
                                                            <Tooltip title='Xem chi tiết sản phẩm' arrow placement="top">
                                                                <Typography gutterBottom variant="body1" component="div" align='left' 
                                                                    onClick={() => navigate(`/chi-tiet-san-pham/${product._id}`)}
                                                                    style={{cursor: 'pointer'}}
                                                                    >
                                                                    <span style={{ color: '#6b0000', fontWeight: 'lighter' }}>{product.productName}</span>
                                                                </Typography>
                                                            </Tooltip>
                                                    </div>
                                                </Grid>
                                                <Grid item xs={2} className="grid-cart">
                                                        <PriceDiscount valueDiscount={product.discount} valuePrice={product.price} />
                                                </Grid>
                                                <Grid item xs={2} className="grid-cart">
                                                    <input
                                                        type="number"
                                                        value={parseInt(product.count)}
                                                        style={{outline: "none", height: 25, textAlign: 'end', width: 60}}
                                                        onChange={(e)=> hanleChangeCount(e.target.value, product)}
                                                        onKeyDown={(e)=> {
                                                            if(e.key === "Backspace") {
                                                                const key = e.target.value.slice(0,-1)
                                                                hanleChangeCount(key, product)
                                                            }
                                                        }}
                                                    ></input>
                                                </Grid>
                                                <Grid item xs={2} className="grid-cart">
                                                    <div>
                                                        <PriceDiscount valueDiscount={0} valuePrice={product.count*(product.price*(1-product.discount))} />
                                                    </div> 
                                                </Grid>
                                                <Grid item xs={1} className="grid-cart">
                                                    <DeleteIcon
                                                        htmlColor="#ff8000"
                                                        sx={{ cursor: "pointer", textAlign: 'right'}}
                                                        onClick={() => handleRemoveProduct(product?._id)}
                                                    />
                                                </Grid>
                                            </Grid>
                                        })
                                    )
                                }
                            </Grid>
                            <Grid item container xs={12} className='form-info-user'>
                                <Grid item xs={6} style={{borderRight: '1px solid #ececec', color: '#555555'}}>
                                    <h3 style={{ marginLeft: 5}} className='text-monospace' >THÔNG TIN THANH TOÁN</h3>
                                    <form noValidate style={{padding: 20, backgroundColor: '#f7fafc'}} onSubmit={()=> {}}>
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
                                                autoFocus
                                                style={{background: '#fff'}}
                                            />
                                            </Grid>
                                            <Grid item xs={6}>
                                                <Select
                                                    name="cityId"
                                                    key={`cityId_${selectedCity?.value}`}
                                                    isDisabled={cityOptions?.length === 0}
                                                    options={cityOptions}
                                                    onChange={(option) => {
                                                        setLoading(true)
                                                        onCitySelect(option)
                                                    }}
                                                    placeholder="Tỉnh/Thành"
                                                    style={{width: '50%', height: 55}}
                                                    inputValue={selectedCity?.name}
                                                    onInputChange={(e)=> {
                                                        setStateAddress((prev) => ({
                                                            ...prev, 
                                                            selectedCity: e
                                                        }))
                                                    }}
                                                    styles={{
                                                        control: (provided, state) => ({
                                                            ...provided,
                                                            background: '#fff',
                                                            borderColor: '#9e9e9e',
                                                            minHeight: '55px',
                                                            height: '55px',
                                                            boxShadow: state.isFcused ? null : null,
                                                        }),
                                                        placeholder: (provided) => ({
                                                            ...provided, 
                                                            textAlign: 'left'
                                                        }),
                                                        menu: (provided, state) => ({
                                                            ...provided,
                                                            background: '#fff',
                                                            zIndex: 10000,
                                                        }),
                                                        singleValue: (provided) => ({
                                                            ...provided,
                                                            textAlign: 'left'
                                                        })
                                                    }}
                                                />
                                            </Grid>
                                            <Grid item xs={6}>
                                                <Select
                                                    name="cityId"
                                                    key={`cityId_${selectedDistrict?.value}`}
                                                    isDisabled={selectedCity?.length === 0}
                                                    options={districtOptions}
                                                    onChange={(option) => {
                                                        setLoading(true)
                                                        onDistrictSelect(option)
                                                    }}
                                                    placeholder="Quận/Huyện"
                                                    style={{width: '50%', height: 55}}
                                                    inputValue={selectedDistrict?.name}
                                                    onInputChange={(e)=> {
                                                        setStateAddress((prev) => ({
                                                            ...prev, 
                                                            selectedDistrict: e
                                                        }))
                                                    }}
                                                    styles={{
                                                        control: (provided, state) => ({
                                                            ...provided,
                                                            background: '#fff',
                                                            borderColor: '#9e9e9e',
                                                            minHeight: '55px',
                                                            height: '55px',
                                                            boxShadow: state.isFocused ? null : null,
                                                        }),
                                                        placeholder: (provided) => ({
                                                            ...provided, 
                                                            textAlign: 'left'
                                                        }),
                                                        menu: (provided) => ({
                                                            ...provided,
                                                            background: '#fff',
                                                            zIndex: 10000
                                                        }),
                                                        singleValue: (provided) => ({
                                                            ...provided,
                                                            textAlign: 'left'
                                                        })
                                                    }}
                                                />
                                            </Grid>
                                            <Grid item xs={6}>
                                                <Select
                                                    name="cityId"
                                                    key={`cityId_${selectedCity?.value}`}
                                                    isDisabled={selectedDistrict?.length === 0}
                                                    options={wardOptions}
                                                    onChange={(option) => setStateAddress((prev)=> ({...prev, selectedWard: option}))}
                                                    placeholder="Phường/Xã"
                                                    style={{width: '50%', height: 55}}
                                                    defaultValue={selectedWard?.name}
                                                    onInputChange={(e)=> {
                                                        setStateAddress((prev) => ({
                                                            ...prev, 
                                                            selectedWard: e
                                                        }))
                                                    }}
                                                    styles={{
                                                        control: (provided, state) => ({
                                                            ...provided,
                                                            background: '#fff',
                                                            borderColor: '#9e9e9e',
                                                            minHeight: '55px',
                                                            height: '55px',
                                                            boxShadow: state.isFocused ? null : null,
                                                        }),
                                                        placeholder: (provided) => ({
                                                            ...provided, 
                                                            textAlign: 'left'
                                                        }),
                                                        menu: (provided) => ({
                                                            ...provided,
                                                            background: '#fff',
                                                            zIndex: 10000
                                                        }),
                                                        singleValue: (provided) => ({
                                                            ...provided,
                                                            textAlign: 'left'
                                                        })
                                                    }}
                                                />
                                            </Grid>
                                            <Grid item xs={6}>
                                                <TextField
                                                    variant="outlined"
                                                    required
                                                    fullWidth
                                                    id="detail"
                                                    label="Số đường/Thôn..."
                                                    name="detail"
                                                    autoComplete="detail"
                                                    style={{background: '#fff'}}
                                                />
                                            </Grid>
                                            <Grid item xs={6}>
                                                <TextField
                                                    variant="outlined"
                                                    required
                                                    fullWidth
                                                    id="phone"
                                                    label="Điện thoại liên hệ"
                                                    name="phone"
                                                    autoComplete="phone"
                                                    style={{background: '#fff'}}
                                                />
                                            </Grid>
                                            <Grid item xs={6}>
                                                <TextField
                                                    variant="outlined"
                                                    required
                                                    fullWidth
                                                    id="email"
                                                    label="Địa chỉ Email"
                                                    name="email"
                                                    autoComplete="email"
                                                    style={{background: '#fff'}}
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField
                                                    variant="outlined"
                                                    required
                                                    multiline
                                                    fullWidth
                                                    id="email"
                                                    label="Ghi chú đơn hàng"
                                                    name="email"
                                                    autoComplete="email"
                                                    placeholder="Ghi chú về đơn hàng, ví dụ: thời gian hay chỉ dẫn địa điểm giao hàng chi tiết hơn."
                                                    rows={4}
                                                    maxRows={10}
                                                    style={{background: '#fff'}}
                                                />
                                            </Grid>
                                        </Grid>
                                    </form>
                                </Grid>
                                <Grid item xs={6} style={{paddingBottom: 50}}>
                                    <div className="wrapper-payment">
                                        <h3 style={{marginLeft: 10}} className='text-monospace'>ĐƠN HÀNG CỦA BẠN</h3>
                                        <div className="wrapper-payment__info">
                                            <div style={{display: 'flex', flexDirection: 'column', width: '100%'}}>
                                                {
                                                    data?.map((product)=> {
                                                        return (
                                                            <div className="product-item">
                                                                <div className="product-name">
                                                                    <span className="name">
                                                                        {product.productName}
                                                                    </span>
                                                                    <span className="total-count">
                                                                        x {product.count}
                                                                    </span>
                                                                </div>
                                                                <div className="view-price">
                                                                    <PriceDiscount valueDiscount={0} valuePrice={product.count*(product.price*(1-product.discount))} />
                                                                </div>
                                                            </div>
                                                        )
                                                    })
                                                }
                                            </div>
                                            
                                        </div>
                                        <div style={{display: 'flex', alignItems: 'cetner', justifyContent: 'space-between', padding: '10px 25px 10px 20px'}}>
                                            <span style={{color: '#555555', fontSize: 16, fontWeight: 600}}>
                                                Tạm tính:
                                            </span>
                                            <div className="view-price">
                                                <PriceDiscount valueDiscount={0} valuePrice={totalPrice} />
                                            </div>
                                        </div>
                                        <div style={{display: 'flex', alignItems: 'cetner', justifyContent: 'space-between', padding: '10px 25px 10px 20px'}}>
                                            <span style={{color: '#555555', fontSize: 16, fontWeight: 600}}>
                                                Phí vận chuyển:
                                            </span>
                                            <div className="view-price">
                                                <PriceDiscount valueDiscount={0} valuePrice={15000} />
                                            </div>
                                        </div>

                                        <div className="wrapper-total-price"style={{display: 'flex', alignItems: 'cetner', justifyContent: 'space-between', padding: '15px 25px 15px 20px'}}>
                                            <span style={{color: '#555555', fontSize: 20, fontWeight: 600}}>
                                                Tổng tiền:
                                            </span>
                                            <div className="view-price">
                                                <PriceDiscount valueDiscount={0} valuePrice={totalPrice + 15000} />
                                            </div>
                                        </div>

                                        <Typography gutterBottom variant="button" component="div" align='right' style={{marginLeft: 20}}>
                                            <Button variant="contained" color="warning"
                                                // disabled={!getUser() || !data?.owner?.active || moment(data.timeStart).subtract(5, 'days').toDate().getTime() <  Date.now()}
                                                onClick={() => handlePayment()} sx={{height: 50}}
                                                style={{alignItems: 'center'}}
                                                >
                                                <div style={{display: 'flex', alignItems: 'center', paddingRight: 10, marginRight: 10, borderRight: '2px solid orange'}}>
                                                    <PaymentIcon />
                                                </div>
                                                Thanh toán
                                                <div>
                                                    <img style={{width: 30, height: 30, marginLeft: 8, marginTop: 5}} src={MetamaskIcon} alt='' />
                                                </div>
                                            </Button>
                                        </Typography>
                                    </div>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Container>
            }
            </>
            
        }
    </AppBar>
  );
};

export default CartPage;
