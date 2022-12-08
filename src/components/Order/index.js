import AppBar from "@mui/material/AppBar";
import Container from "@mui/material/Container";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Divider, Grid, IconButton, Menu, MenuItem, TextField, Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import PriceDiscount from "LogicResolve/PriceDiscount";
import {getDistrict, getProvince, getWard} from '../../apis/apiAddress'
import Select from 'react-select'
import Spinner from "components/Spinner";
import PaymentIcon from '@mui/icons-material/Payment';
import MetamaskIcon from '../../public/MetaMask_Fox.png'
import ConvertToImageURL from "LogicResolve/ConvertToImageURL";
import Tooltip from '@mui/material/Tooltip';
import { isEmpty } from "lodash";
import useNotification from "hooks/notification";
import { useDispatch, useSelector } from "react-redux";
import {createOrder} from '../../redux/reducers/order/action'
import CircularProgress from '@mui/material/CircularProgress';
import {ethers} from 'ethers'
import { getWarehouseAdress, getContract } from "helpers";
import { useLibrary } from "hooks/contract";
import { addOrderToWarehouse, getAllOrder, getOrderPerCompany } from "apis/contractAPI/Warehouse";
import { confirmPaymentToSeller, confirmPurchase, getAllTransactionOrder } from "apis/contractAPI/OrderAPI";
import moment from "moment";
import CompanyInfomation from "components/CompanyInfomation";
import { useWeb3React } from "@web3-react/core";
import { ConvertVNDToETH } from "utils/logicUntils";

const Order = ({order, getcontract, setTitleLoading, setLoadingEvent, loadingEvent}) => {
	const navigate = useNavigate()
	const dispatch = useDispatch()
	const { active, account } = useWeb3React();
 	const { newOrder } = useSelector((store)=> store.order)
 	const [loading, setLoading] = useState(false)
	const { accountUser } = useSelector((store)=> store.user)
	const [stateAddress, setStateAddress] = useState({
		cityOptions: [],
		districtOptions: [],
		wardOptions: [],
		selectedCity: null,
		selectedDistrict: null,
		selectedWard: null
	});
	const [data, setData] = useState([])
	const [deliveryPay, setDeliveryFee] = useState(0.005)

	const [stateOrder, setStateOrder] = useState({
		ward: '',
		phoneNumber: '',
		detailAddress: '',
		note: ''
	})
	const [totalPrice, setTotalPrice] = useState(0)
	const library = useLibrary();

	const {cityOptions, districtOptions, wardOptions, selectedCity, selectedDistrict, selectedWard} = stateAddress

	useEffect(()=> {
		if(isEmpty(order)) return 
		setData(order)
	}, [])

	useEffect(()=> {
		if(!Object.keys(accountUser)?.length) return
		const fetchAddress = async () => {
			await getProvince().then(res=> {
				const data = res.data.data.map((pro)=> ({...pro, label: pro.name, value: pro.name}))
				const selectedCity = data.find((item)=> item?.id === accountUser?.address.province)
				setStateAddress((prev)=> ({
					...prev, 
					cityOptions: data,
					selectedCity: selectedCity
				}))
			})
			await getDistrict(accountUser?.address.province).then((res)=> {
				const dataDistricts = res.data.data.map((dis)=> ({...dis, label: dis.name, value: dis.name}))
				const selectedDis = dataDistricts.find((item)=> item?.id === accountUser?.address.district)
				setStateAddress((prev)=> (
					{
						...prev,
						districtOptions: dataDistricts,
						selectedDistrict: selectedDis,
					}
				));
			})
			await getWard(accountUser?.address.district).then((res)=> {
				const dataWards = res.data.data.map((ward)=> ({...ward, label: ward.name, value: ward.name}))
				const selectedWard = dataWards.find((item)=> item?.id === accountUser?.address.ward)
				console.log({selectedWard});
				setStateAddress((prev)=> ({
					...prev,
					wardOptions: dataWards,
					selectedWard: selectedWard
				}));
				})

			setStateOrder((prev)=> ({...prev, detailAddress: accountUser?.address?.detail}) )
		}
		fetchAddress()
	}, [])

	console.log(stateAddress);
	useEffect(() => {
		if(Object.keys(accountUser)?.length) return
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
				console.log({value});
				return total + count*price*(1 - discount)
		}, 0)
		setTotalPrice(parseFloat(totalPrice).toFixed(4))
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
		setData((prev)=> {
			return prev?.map(p=> {
				if(p._id === _id) return {
					...p, count: newCount
				}
				return p
			})
		})
	}

	console.log(data);

	const handleRemoveProduct = (id) => {
		const products = JSON.parse(localStorage.getItem("products")).filter(
			(item) => item._id !== id
		);
		localStorage.setItem("products", JSON.stringify(products));
		setData((prev=> {
			return prev?.filter(p=> p._id !== id)
		}))
	}

	// const getcontractOrder = async () => {
	// 	return await getContract(library, '0xBC58a7865bFe90C7232b7a85C24835ca1Af71014', "Order");
	// };

	const getContractWarehouse = async() => {
		return await getContract(library, getWarehouseAdress());
	}

	const handlePayment = async() => {
		if(isEmpty(accountUser)) {
			return alert("Vui lòng đăng nhập để thanh toán!")
		}
		setLoadingEvent(true)
		setTitleLoading('Đang thực hiện quá trình thanh toán')
		const products = JSON.parse(localStorage.getItem('products'))
		const details = order.map((product)=> {
			const {discount, price} = product
			return {
					product: product._id,
					priceDis: price*(1-discount),
					quantity: product.count
			}
		})
		const accountSeller = products?.[0]?.user?.walletAddress
		const contract = await getContractWarehouse();
		
		addOrderToWarehouse(
			contract,
			accountUser?.walletAddress,
			accountSeller,
			2,
			order?.length,
			moment(Date.now()).add(15, 'days').toDate().getTime(),
		).then(async(res)=> {
			console.log({res})
			setTitleLoading('Đang tạo thanh toán')
			const getContractOrder = async () => {;
				return await getContract(library, res.events.createOrder.returnValues[0], "Order");
			}
			const contractOrder = await getContractOrder()
			await confirmPurchase(
				contractOrder,
				account,
				library.utils.toWei(`0.0017`, 'ether')
				).then((res1)=> {
					console.log(res1);
					const dataDB = {
						walletAddress: res1.events.confirmPurchaseEvent.returnValues[1],
						note: stateOrder.note,
						phoneNumber: stateOrder.phoneNumber,
						address: `${stateOrder.detailAddress}, ${stateOrder.ward}, ${stateAddress.selectedDistrict?.label}, ${stateAddress.selectedCity?.label}`,
						details: details
					}
					dispatch(createOrder(dataDB, (res)=> {
						if(res) {
							const detailIds = res.order.details?.map((d)=> d.product)
							const products = JSON.parse(localStorage.getItem("products")).filter(
								(item) => !detailIds.includes(item._id)
							);
							setData([...products]);
							localStorage.setItem("products", JSON.stringify(products));
							setData([])
							setLoadingEvent(false)
							useNotification.Success({
								title: "Thành công",
								message:"Bạn đã đặt hàng thành công!",
								duration: 4000
							  })
						}
					}))
				}).catch(()=> setLoadingEvent(false))
		}).catch(()=> setLoadingEvent(false))


		// confirmPurchase(
		// 	contract,
		// 	'0x87E459a7f037681f8bAd99522D3Cae1a734Ef9c6',
		// 	library.utils.toWei('0.002', 'ether')
		// ).then((res)=> {
		// 	console.log(res);
		// })
		// confirmPaymentToSeller(
		// 	contract,
		// 	'0x87E459a7f037681f8bAd99522D3Cae1a734Ef9c6'
		// ).then((res)=> {
		// 	console.log(res);
		// })

		// const transaction = await getAllTransactionOrder(contract)
		// console.log(transaction);

		// const formatted = moment(1669653372*1000).format("DD-MM-YYYY h:mm:ss");
		// const formatted1 = moment(1669654752*1000).format("DD-MM-YYYY h:mm:ss");
		
		// console.log(formatted, formatted1);

		const listOrder = await getAllOrder(contract)
		console.log({listOrder});

	}

	if(isEmpty(data)) return null

	return (
		<Container maxWidth="xl" className="order-item-container">
			<Grid container spacing={2} style={{marginTop: 5, marginBottom: 20, marginLeft: 5}}>
				<CompanyInfomation info={data[0]?.user}/>
			</Grid>
			<Grid container spacing={2} style={{width: '100%', marginLeft: '-8px'}}>
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
							data?.map((product, index)=> {
								return <Grid key={index} container item xs={12} className='line-product'>
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
														<div style={{ color: '#fb5f1b', fontSize: 18, fontWeight: '600', letterSpacing: '1px'}}>{product.productName}</div>
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
											<PriceDiscount valueDiscount={0} valuePrice={parseFloat((product.count*(product.price*(1-product.discount))).toFixed(4))} />
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
									disabled
									value={accountUser?.companyName}
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
										onChange={(option) => {
											setStateOrder((prev)=> ({...prev, ward: option.name}))
											setStateAddress((prev)=> ({...prev, selectedWard: option}))
										}}
										placeholder="Phường/Xã"
										style={{width: '50%', height: 55}}
										inputValue={selectedWard?.name}
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
										value={stateOrder.detailAddress}
										onChange={(e)=> setStateOrder((prev)=> ({...prev, detailAddress: e.target.value}))}
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
										value={accountUser?.phoneNumber}
										onChange={(e)=> setStateOrder((prev)=> ({...prev, phoneNumber: e.target.value}))}
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
										disabled
										autoComplete="email"
										value={accountUser?.email}
										style={{background: '#fff'}}
									/>
								</Grid>
								<Grid item xs={12}>
									<TextField
										variant="outlined"
										required
										multiline
										fullWidth
										id="note"
										label="Ghi chú đơn hàng"
										name="note"
										autoComplete="note"
										placeholder="Ghi chú về đơn hàng, ví dụ: thời gian hay chỉ dẫn địa điểm giao hàng chi tiết hơn."
										rows={5}
										maxRows={10}
										style={{background: '#fff'}}
										value={stateOrder.note}
										onChange={(e)=> setStateOrder((prev)=> ({...prev, note: e.target.value}))}
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
										data?.map((product, idx)=> {
											return (
												<div className="product-item" key={idx}>
													<div className="product-name">
														<span className="name">
															{product.productName}
														</span>
														<span className="total-count">
															x {product.count}
														</span>
													</div>
													<div className="view-price">
														<PriceDiscount valueDiscount={0} valuePrice={parseFloat((product.count*(product.price*(1-product.discount)))).toFixed(4)} />
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
									<PriceDiscount valueDiscount={0} valuePrice={deliveryPay} />
								</div>
							</div>

							<div className="wrapper-total-price"style={{display: 'flex', alignItems: 'cetner', justifyContent: 'space-between', padding: '15px 25px 15px 20px'}}>
								<span style={{color: '#555555', fontSize: 20, fontWeight: 600}}>
									Tổng tiền:
								</span>
								<div className="view-price">
									<PriceDiscount valueDiscount={0} valuePrice={parseFloat(parseFloat(totalPrice) + parseFloat(deliveryPay)).toFixed(4)} />
								</div>
							</div>

							<Typography gutterBottom variant="button" component="div" align='right' style={{display: 'flex', alignItems: 'center', justifyContent: 'right', marginLeft: 20}}>
								{
									loadingEvent ? <CircularProgress color="warning" size={30} sx={{marginRight: '10px'}}/> : <></> 
								}
								<Button variant="contained" color="warning"
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
	)
}

export default Order