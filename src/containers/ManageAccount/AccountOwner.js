import { Button, Grid , TextField } from "@mui/material"
import { makeStyles } from "@material-ui/core/styles";
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { setActiveUrl } from "redux/reducers/activeUrl/action"
import {getDistrict, getProvince, getWard} from '../../apis/apiAddress'
import Select from 'react-select'
import AddIcon from '@mui/icons-material/Add';
import ConvertToImageURL from "LogicResolve/ConvertToImageURL";
import axios from "axios";
import { updateUserInfo } from "redux/reducers/user/action";
import ChangePassForm from "components/modal/modalChangePass";

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

const AccountOwner = () => {
    const classes = useStyles();
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const {accountUser} = useSelector(store=> store.user)
    const [loading, setLoading] = useState(false)
    const [imagePreview, setImagePreview] = useState();
    const [openUpdate, setOpenUpdate] = useState(false) 
    const [stateMoreInfo, setStateMoreInfo] = useState({
		ward: '',
        wardId: '',
		detailAddress: '',
	})

    const [stateAddress, setStateAddress] = useState({
		cityOptions: [],
		districtOptions: [],
		wardOptions: [],
		selectedCity: null,
		selectedDistrict: null,
		selectedWard: null
	});
    const {cityOptions, districtOptions, wardOptions, selectedCity, selectedDistrict, selectedWard} = stateAddress

    useEffect(()=> {
        document.title = 'Warehouse Protection | Tài khoản'
        dispatch(setActiveUrl('account-user'))
    }, [])

    useEffect(() => {
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

    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        console.log(selectedWard);
        const address = {
            value: `${stateMoreInfo.detailAddress && `${stateMoreInfo.detailAddress}`} ${stateMoreInfo?.wardId && `${stateMoreInfo.ward},` } ${selectedDistrict?.id && `${selectedDistrict.name},` } ${selectedCity?.id && `${selectedCity.name}` }`,
            province: selectedCity?.id,
            district: selectedDistrict?.id,
            ward: stateMoreInfo?.wardId,
            detail: stateMoreInfo.detailAddress
        }
        data.append('address1', JSON.stringify(address))
        dispatch(updateUserInfo(accountUser?._id, data))
    };

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

    const callApi = async () => {
        return await axios.get(`https://api-goerli.etherscan.io/api?module=account&action=balance&address=${accountUser?.walletAddress}&tag=latest&apikey=1PQQQ3PTKPWJAB64XGHTW1T3UHKQIF458N`).then((res)=> {
            console.log({res});
        })
      };

      useEffect(()=> {
        callApi()
      }, [])

      useEffect(()=> {
		if(!Object.keys(accountUser)?.length) return
        if(!accountUser?.province) return
		const fetchAddress = async () => {
			await getProvince().then(res=> {
				const data = res.data.data.map((pro)=> ({...pro, label: pro.name, value: pro.name}))
				const selectedCity = data.find((item)=> item?.id === accountUser?.address?.province)
				setStateAddress((prev)=> ({
					...prev, 
					cityOptions: data,
					selectedCity: selectedCity
				}))
			})
			await getDistrict(accountUser?.address.province).then((res)=> {
				const dataDistricts = res.data.data.map((dis)=> ({...dis, label: dis.name, value: dis.name}))
				const selectedDis = dataDistricts.find((item)=> item?.id === accountUser?.address?.district)
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
				const selectedWard = dataWards.find((item)=> item?.id === accountUser?.address?.ward)
				console.log({selectedWard});
				setStateAddress((prev)=> ({
					...prev,
					wardOptions: dataWards,
					selectedWard: selectedWard
				}));
				})
            setStateMoreInfo((prev)=> ({
                ...prev,
                detailAddress: accountUser?.address?.detail
            }))
		}
		fetchAddress()
	}, [])
    
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
                    <Grid container spacing={2}>
                        <Grid item container xs={10} spacing={2} style={{paddingLeft: 30}}>
                            <Grid item xs={12}>
                            <TextField
                                autoComplete="companyName"
                                name="companyName"
                                variant="outlined"
                                required
                                fullWidth
                                id="companyName"
                                defaultValue={accountUser?.companyName}
                                label="Tên doanh nghiệp/công ty"
                            />
                            </Grid>
                            <Grid item xs={12}>
                            <TextField
                                autoComplete="walletAddress"
                                name="walletAddress"
                                variant="outlined"
                                required
                                fullWidth
                                id="walletAddress"
                                label="Địa chỉ ví Metmask"
                                defaultValue={accountUser?.walletAddress}
                            />
                            </Grid>
                        </Grid>
                        <Grid xs={2}>
                            <div className="" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                                <input type='file' name="photoUrl" onChange={(e)=>handleChangePreview(e)} id='image-0' className='image-select' />
                                <div className='image-slide'>
                                    <div className='image-slide__item' onClick={()=>{document.getElementById('image-0').click()}}>
                                        {(!imagePreview && !accountUser?.photoUrl) && <AddIcon fontSize='large' />}
                                        {imagePreview && <img src={imagePreview.preview}/>}
                                        {(!imagePreview && accountUser?.photoUrl) && <img src={ConvertToImageURL(accountUser?.photoUrl)}/>}
                                    </div>
                                </div>
                            </div>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                    <TextField
                        variant="outlined"
                        required
                        fullWidth
                        id="businessCode"
                        label="Mã doanh nghiệp"
                        name="businessCode"
                        autoComplete="businessCode"
                        defaultValue={accountUser?.businessCode}
                    />
                    </Grid>
                    <Grid item xs={12} sm={6}>
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
                    <Grid item xs={6}>
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
                    <Grid item xs={6}>
                    <TextField
                        variant="outlined"
                        required
                        fullWidth
                        id="phoneNumber"
                        label="Điện thoại liên hệ"
                        name="phoneNumber"
                        defaultValue={accountUser?.phoneNumber}
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
                                setStateMoreInfo((prev)=> ({...prev, ward: option.name, wardId: option.id}))
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
                        id="phoneNumber"
                        label="Số nhà/đường"
                        name="detail"
                        onChange={(e)=> setStateMoreInfo((prev)=> ({...prev, detailAddress: e.target.value}))}
                        defaultValue={accountUser?.address?.detail}
                    />
                    </Grid>
                    {/* {
                    error && <Grid>
                        <span style={{fontSize: 15, color: 'red', marginLeft: 8}}>{error}</span>
                    </Grid>
                    } */}
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
                            style={{padding: '10px 0', marginLeft: 10, width: 120}}
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

export default AccountOwner