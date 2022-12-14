import AppBar from "@mui/material/AppBar";
import Container from "@mui/material/Container";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Divider, Grid, TextField, Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import PriceDiscount from "LogicResolve/PriceDiscount";
import {getDistrict, getProvince, getWard} from '../../apis/apiAddress'
import Select from 'react-select'
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
import { addOrderToWarehouse} from "apis/contractAPI/Warehouse";
import { confirmPurchase} from "apis/contractAPI/OrderAPI";
import moment from "moment";
import CompanyInfomation from "components/CompanyInfomation";
import { useWeb3React } from "@web3-react/core";
import { injected } from "components/Wallet";
import { deleteItemCart, deleteMultipleItemCartById } from "redux/reducers/cart/action";
import { getUser } from "hooks/localAuth";
import CartAPI from 'apis/CartAPI'
import { debounce } from "lodash";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import RegardPrice from "LogicResolve/RegardPrice";
import { CheckExpiredToken } from "utils/authUtil";

const Order = ({order, getcontract, setTitleLoading, setLoadingEvent, loadingEvent, setDataOrders}) => {
	const navigate = useNavigate()
	const dispatch = useDispatch()
	const { active, activate, account } = useWeb3React();
 	const { newOrder } = useSelector((store)=> store.order)
 	const { cartData } = useSelector((store)=> store.cart)
 	const [loading, setLoading] = useState(false)
	const accountUser = getUser()
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
	const [openDialog, setOpenDialog] = useState(false)
	const [balance, setBalance] = useState(0)

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
        if (active) {
            return;
        }
        try {
        activate(injected);
        } catch (ex) {
        console.log(ex);
        }
    }, [active])

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
				setStateAddress((prev)=> ({
					...prev,
					wardOptions: dataWards,
					selectedWard: selectedWard
				}));
				setStateOrder((prev)=> ({...prev, detailAddress: accountUser?.address?.detail, ward: selectedWard?.name, phoneNumber: accountUser?.phoneNumber}) )
				})
				
		}
		fetchAddress()
	}, [])

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
			const {quantity} = value
			const {price, discount} = value?.product
			return total + quantity*price*(1 - discount)
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
	const hanleChangeCount = debounce(async(value, product) => {
		const newCount = Number(value)
		if(newCount < product.minimumQuantity) return
		const {_id} = product
		console.log(product);
		const data = {
			productId : _id, 
			newCount: newCount
		}
		await CheckExpiredToken()
		await CartAPI.updateCountItemCart(accountUser?._id, data).then((res)=> {
			if(res.status === 200) {
				setData((prev)=> {
					return prev?.map(p=> {
						if(p.product._id === _id) return {
							...p, quantity: newCount
						}
						return p
					})
				})
				
			}
		}).catch(()=> {
			console.log('err');
			return
		})

	}, 300)

	const handleRemoveProduct = (id) => {
		dispatch(deleteItemCart(accountUser?._id, {productId: id}, (res)=> {
			if(res) {
				setData(prev=> {
					return prev?.filter((p)=> p?.product._id !== id)
				})
			}
		}))
	}

	const getContractWarehouse = async() => {
		return await getContract(library, getWarehouseAdress());
	}

	const handlePayment = async() => {
		if(!stateOrder.phoneNumber) {
			useNotification.Error({
				title: "Th???t b???i!",
				message:"Vui l??ng nh???p ?????y ????? th??ng tin!",
				duration: 4000
			})
			return 
		}
		window.ethereum.request({method: 'eth_getBalance', params: [accountUser?.walletAddress, 'latest']})
			.then(async(balance)=> {
				const currBalance = parseFloat(Number(ethers.utils.formatEther(balance)))
				if(currBalance < (parseFloat(parseFloat(totalPrice) + parseFloat(deliveryPay)))) {
					setBalance(currBalance)
					setOpenDialog(true)
					return
				} else {
					setLoadingEvent(true)
					setTitleLoading('??ang th???c hi???n qu?? tr??nh t???o h??a ????n. Vui l??ng x??c nh???n!')
					const details = data.map((product)=> {
						const {discount, price} = product?.product
						return {
							product: product.product._id,
							priceDis: parseFloat(price*(1-discount)).toFixed(4),
							quantity: product.quantity
						}
					})
					const accountSeller = data?.[0]?.userInfo?.walletAddress
					const contract = await getContractWarehouse();
					
					await addOrderToWarehouse(
						contract,
						accountUser?.walletAddress,
						accountSeller,
						deliveryPay*1000000000000000000,
						details?.length,
						moment(Date.now()).add(10, 'minutes').toDate().getTime(),
					).then(async(res)=> {
						console.log({res})
						setTitleLoading('??ang th???c hi???n qu?? tr??nh chuy???n ti???n v??o h??a ????n. Vui l??ng x??c nh???n!')
						const getContractOrder = async () => {;
							return await getContract(library, res.events.createOrder.returnValues[0], "Order");
						}
						const contractOrder = await getContractOrder()
						await confirmPurchase(
							contractOrder,
							account,
							library.utils.toWei(`${parseFloat(parseFloat(totalPrice) + parseFloat(deliveryPay)).toFixed(4)}`, 'ether')
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
										dispatch(deleteMultipleItemCartById(accountUser?._id, {ids: detailIds}))
										setData([])
										setLoadingEvent(false)
										useNotification.Success({
											title: "Th??nh c??ng",
											message:"B???n ???? ?????t h??ng th??nh c??ng!",
											duration: 4000
										})
										navigate('/owner/order-history')
									}
								}))
							}).catch((e)=> {
								console.log({e});
								useNotification.Success({
									title: "Th???t b???i",
									message:"X??c nh???n g???i ti???n v??o h??a ????n th???t b???i!",
									duration: 4000
								})
								setLoadingEvent(false)
							})
					}).catch((e)=>{
						console.log({e});
						useNotification.Error({
							title: "Th???t b???i",
							message:"T???o h??a ????n th???t b???i!",
							duration: 4000
						})
						setLoadingEvent(false)
					})
				}
			})
	}

	if(isEmpty(data)) return null

	return (
		<Container maxWidth="xl" className="order-item-container">
			<Grid container spacing={2} style={{marginTop: 5, marginBottom: 20, marginLeft: 5}}>
				<CompanyInfomation info={data[0]?.userInfo}/>
			</Grid>
			<Grid container spacing={2} style={{width: '100%', marginLeft: '-8px'}}>
				<Grid item container xs={12} className='list-product'>
					<Grid item container xs={12} className='cart-header' style={{maxHeight: 60}}>
						<Grid item xs={5}>
							<Typography gutterBottom variant="body1" component="div" align='left'>
								<span style={{ color: 'darkblue', fontWeight: 'bold' }}>S???n ph???m</span>
							</Typography>
						</Grid>
						<Grid item xs={2}>
							<Typography gutterBottom variant="body1" component="div" align='right'>
								<span style={{ color: 'darkblue', fontWeight: 'bold' }}>Gi??</span>
							</Typography>
						</Grid>
						<Grid item xs={2}>
							<Typography gutterBottom variant="body1" component="div" align='right'>
								<span style={{ color: 'darkblue', fontWeight: 'bold' }}>S??? l?????ng</span>
							</Typography>
						</Grid>
						<Grid item xs={2}>
							<Typography gutterBottom variant="body1" component="div" align='right'>
								<span style={{ color: 'darkblue', fontWeight: 'bold' }}>T???m t??nh</span>
							</Typography>
						</Grid>
						<Grid item xs={1}>
							<Typography gutterBottom variant="body1" component="div" align='right'>
								<span style={{ color: 'darkblue', fontWeight: 'bold' }}>X??a</span>
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
													src={ConvertToImageURL(product.product.imageUrl)}
													style={{ width: 80, height: 80, marginRight: 8, cursor: 'pointer'}}
													alt=""
													onClick={() => navigate(`/chi-tiet-san-pham/${product.product._id}`)}
												/>
												<Tooltip title='Xem chi ti???t s???n ph???m' arrow placement="top">
													<Typography gutterBottom variant="body1" component="div" align='left' 
														onClick={() => navigate(`/chi-tiet-san-pham/${product.product._id}`)}
														style={{cursor: 'pointer'}}
														>
														<div style={{ color: '#fb5f1b', fontSize: 18, fontWeight: '600', letterSpacing: '1px'}}>{product.product.productName}</div>
													</Typography>
												</Tooltip>
										</div>
									</Grid>
									<Grid item xs={2} className="grid-cart">
											<PriceDiscount valueDiscount={product.product.discount} valuePrice={product.product.price} />
									</Grid>
									<Grid item xs={2} className="grid-cart">
										<input
											type="number"
											value={parseInt(product.quantity)}
											style={{outline: "none", height: 25, textAlign: 'end', width: 60}}
											onChange={(e)=> hanleChangeCount(e.target.value, product.product)}
											onKeyDown={(e)=> {
												if(e.key === "Backspace") {
													const key = e.target.value.slice(0,-1)
													hanleChangeCount(key, product.product)
												}
											}}
										></input>
									</Grid>
									<Grid item xs={2} className="grid-cart">
										<div>
											<PriceDiscount valueDiscount={0} valuePrice={parseFloat((product.quantity*(product.product.price*(1-product.product.discount))).toFixed(4))} />
										</div> 
									</Grid>
									<Grid item xs={1} className="grid-cart">
										<DeleteIcon
											htmlColor="#ff8000"
											sx={{ cursor: "pointer", textAlign: 'right'}}
											onClick={() => handleRemoveProduct(product.product?._id)}
										/>
									</Grid>
								</Grid>
							})
						)
					}
				</Grid>
				<Grid item container xs={12} className='form-info-user'>
					<Grid item xs={6} style={{borderRight: '1px solid #ececec', color: '#555555'}}>
						<h3 style={{ marginLeft: 5}} className='text-monospace' >TH??NG TIN THANH TO??N</h3>
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
									label="T??n doanh nghi???p/c??ng ty"
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
										placeholder="T???nh/Th??nh"
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
										placeholder="Qu???n/Huy???n"
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
										placeholder="Ph?????ng/X??"
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
										label="S??? ???????ng/Th??n..."
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
										label="??i???n tho???i li??n h???"
										name="phone"
										autoComplete="phone"
										defaultValue={accountUser?.phoneNumber}
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
										label="?????a ch??? Email"
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
										label="Ghi ch?? ????n h??ng"
										name="note"
										autoComplete="note"
										placeholder="Ghi ch?? v??? ????n h??ng, v?? d???: th???i gian hay ch??? d???n ?????a ??i???m giao h??ng chi ti???t h??n."
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
							<h3 style={{marginLeft: 10}} className='text-monospace'>????N H??NG C???A B???N</h3>
							<div className="wrapper-payment__info">
								<div style={{display: 'flex', flexDirection: 'column', width: '100%'}}>
									{
										data?.map((product, idx)=> {
											return (
												<div className="product-item" key={idx}>
													<div className="product-name">
														<span className="name">
															{product.product.productName}
														</span>
														<span className="total-count">
															x {product.quantity}
														</span>
													</div>
													<div className="view-price">
														<PriceDiscount valueDiscount={0} valuePrice={parseFloat((product.quantity*(product.product.price*(1-product.product.discount)))).toFixed(4)} />
													</div>
												</div>
											)
										})
									}
								</div>
								
							</div>
							<div style={{display: 'flex', alignItems: 'cetner', justifyContent: 'space-between', padding: '10px 25px 10px 20px'}}>
								<span style={{color: '#555555', fontSize: 16, fontWeight: 600}}>
									T???m t??nh:
								</span>
								<div className="view-price">
									<PriceDiscount valueDiscount={0} valuePrice={totalPrice} />
								</div>
							</div>
							<div style={{display: 'flex', alignItems: 'cetner', justifyContent: 'space-between', padding: '10px 25px 10px 20px'}}>
								<span style={{color: '#555555', fontSize: 16, fontWeight: 600}}>
									Ph?? v???n chuy???n:
								</span>
								<div className="view-price">
									<PriceDiscount valueDiscount={0} valuePrice={deliveryPay} />
								</div>
							</div>

							<div className="wrapper-total-price"style={{display: 'flex', alignItems: 'cetner', justifyContent: 'space-between', padding: '15px 25px 15px 20px'}}>
								<span style={{color: '#555555', fontSize: 20, fontWeight: 600}}>
									T???ng ti???n:
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
									Thanh to??n
									<div>
										<img style={{width: 30, height: 30, marginLeft: 8, marginTop: 5}} src={MetamaskIcon} alt='' />
									</div>
								</Button>
							</Typography>
						</div>
					</Grid>
				</Grid>
			</Grid>
			<Dialog
				open={openDialog}
				onClose={()=> setOpenDialog(false)}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
			>
				<DialogTitle id="alert-dialog-title" style={{color: 'orange', fontSize: 25, fontWeight: 600, textAlign: 'center'}}>
				{"Ch?? ??"}
				</DialogTitle>
				<DialogContent>
				<DialogContentText id="alert-dialog-description" style={{fontSize: 18}}>
					T??i kho???n hi???n t???i c???a b???n kh??ng ????? s??? d??. Vui l??ng n???p ti???n!!
					<div>S??? d?? hi???n t???i: {parseFloat(balance).toFixed(4)} ETH</div>
					
				</DialogContentText>
				</DialogContent>
				<DialogActions>
				<Button onClick={()=> setOpenDialog(false)}>????ng</Button>
				</DialogActions>
			</Dialog>
		</Container>
	)
}

export default Order