// import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Box, Button, MenuItem, Select } from '@mui/material';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import React, { useEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import AddIcon from '@mui/icons-material/Add';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers';
import { format } from 'date-fns';
import { useDispatch, useSelector } from 'react-redux';
import ConvertToImageURL from '../../../LogicResolve/ConvertToImageURL';
import { getAllCategory } from 'redux/reducers/category/action';
import { isEmpty } from 'lodash';

const Discounts = ["10", "20", "30", "40", "50", "60", "70"]

function ProductForm({ handleAddProduct, handleUpdateProduct, product, submit = false, setSubmit = ()=>{} }) {
    const {
        register,
        handleSubmit,
        reset,
        control,
        formState: { errors },
    } = useForm();
    const formRef = useRef(null)
    const [start, setStart] = useState(product ? new Date(product.dateOfManufacture) : new Date());
    const [end, setEnd] = useState(product ? new Date(product.warrantyPeriod) : new Date());
    const [imagePreview, setImagePreview] = useState();
    const {accountUser} = useSelector((store) => store.user) 
    const [listSubCat, setListSubCat] = useState([])
    const [selectedCate, setSelectedCate] = useState()
    const [previousCate, setPreviousCate] = useState()
    let {categories} = useSelector((store) => store.category)
    const dispatch = useDispatch()

    useEffect(()=>{
        if(isEmpty(categories)) dispatch(getAllCategory())
    },[categories])

    useEffect(()=>{
        if(!product || isEmpty(categories)) return 
        categories?.map((item)=> {
            item.childrens.map((child)=> {
                if(child._id === product.subCategory)
                setPreviousCate({
                    parent: item.parent.name,
                    child: child.name
                })
            })
        })
    }, [product])

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

    useEffect(() => {
        if(submit){
            formRef.current.click()
        }
    }, [submit]);

    const onHandleSubmit = (data) => {
        let formData = new FormData();
        for (let key in data) {
            if (key == 'imageUrl') {
                formData.append('imageUrl',imagePreview)                
            }
            else if(key == 'dateOfInventory'){
                formData.append('dateOfManufacture', format(start, 'yyyy/MM/dd'))
            }
            else if(key == 'warrantyPeriod'){
                formData.append('warrantyPeriod', format(end, 'yyyy/MM/dd'))
            }
            else formData.append(key, data[key])
        }
        console.log(121345643);

        formData.append("user", accountUser._id)
        formData.append("manufacturer", accountUser._id)
        formData.append("subCategory", selectedCate)
        if(product) handleUpdateProduct(product?._id.toString(), formData)
        else handleAddProduct(formData);
        setSubmit(false)
    };

    console.log(product);

    return (
        <div className='create-tour-form-wrapper'>
            <form className='create-tour-formbody' action=" " onSubmit={handleSubmit(onHandleSubmit)} >
                <div className='form-group col-1'>
                    <label>Tên sản phẩm: </label>
                    <input {...register("productName", {
                        required: "* Nhập tên sản phẩm.",
                        maxLength: {
                            value: 100,
                            message: '* Nhập tên quá dài.'
                        },
                        minLength: {
                            value: 5,
                            message: '* Tên quá ngắn.'
                        }
                    })}
                        disabled={product && product.manufacturer._id !== accountUser._id}
                        defaultValue={product && product.productName}
                    />
                    {errors.productName && <div className="alert">{errors.productName.message}</div>}
                </div>
                <div className="form-group col-1">
                    <label>Danh mục:</label>
                    {
                        product ? 
                        <span style={{color: '#292929',}}>{previousCate?.parent}</span>
                        : 
                        <Select
                            labelId="demo-simple-select-helper-label"
                            id="demo-simple-select-helper"
                            name="category"
                            placeholder='Chọn...'
                            variant='standard'
                            style={{width: 170, fontSize:12}}
                            disabled={product && product.manufacturer._id !== accountUser._id}
                            onChange={(e) => {
                                setListSubCat(categories?.find((cate)=> cate.parent._id === e.target.value)?.childrens)
                            }}
                        >
                            {
                                categories?.map((value, index) => (
                                    <MenuItem key={index} value={value.parent._id}>{value.parent.name}</MenuItem>
                                ))
                            }
                        </Select>
                    }
                    {errors.category && <div className="alert">{errors.category.message}</div>}
                </div>
                <div className="form-group col-1">
                    <label>Danh mục con:</label>
                    {
                        product ? 
                        <span style={{color: '#292929',}}>{previousCate?.child}</span>
                        : 
                        <Select
                            labelId="demo-simple-select-helper-label"
                            id="demo-simple-select-helper"
                            name="subCategory"
                            placeholder='Chọn...'
                            variant='standard'
                            value={selectedCate}
                            disabled={product && product.manufacturer._id !== accountUser._id}
                            defaultValue={!isEmpty(listSubCat) && listSubCat[0]}
                            onChange={(e)=> {
                                setSelectedCate(e.target.value)
                            }}
                            style={{width: 170, fontSize:12}}
                        >
                            {
                                listSubCat?.map((value, index) => (
                                    <MenuItem key={index} value={value._id}>{value.name}</MenuItem>
                                ))
                            }
                        </Select>
                    }
                    {errors.category && <div className="alert">{errors.subCategory.message}</div>}
                </div>
                <div className="form-group col-1">
                    <label>Giá: </label>
                    <input type='text' {...register("price",
                        {
                            required: "* Nhập giá tiền",
                            min: {
                                value: 0,
                                message: "* Nhập lỗi"
                            },
                            max: {
                                value: 100000000,
                                message: "* Nhập lỗi"
                            },
                            pattern: {
                                value: /[0-9]/,
                                message: "* Nhập lỗi"
                            }
                        }
                    )}
                        defaultValue={product && product.price}
                    />
                    {errors.price && <div className="alert">{errors.price.message}</div>}
                </div>
                <div className="form-group col-1">
                    <label>Số lượng: </label>
                    <input type='text' defaultValue={product && product.amount} {...register("amount",
                        {
                            required: "* Nhập số lượng",
                            min: {
                                value: 0,
                                message: "* Nhập lỗi"
                            },
                            max: {
                                value: 10000000000,
                                message: "* Nhập lỗi"
                            },
                            pattern: {
                                value: /[0-9]/,
                                message: "* Nhập lỗi"
                            }
                        }
                    )} />
                    {errors.amount && <div className="alert">{errors.amount.message}</div>}
                </div>
                <div className="form-group col-1">
                    <label>Đơn hàng nhỏ nhất: </label>
                    <input type='text' defaultValue={product && product.minimumQuantity} {...register("minimumQuantity",
                        {
                            required: "* Nhập số lượng",
                            min: {
                                value: 0,
                                message: "* Nhập lỗi"
                            },
                            max: {
                                value: 50,
                                message: "* Nhập lỗi"
                            },
                            pattern: {
                                value: /[0-9]/,
                                message: "* Nhập lỗi"
                            }
                        }
                    )} />
                    {errors.minimumQuantity && <div className="alert">{errors.minimumQuantity.message}</div>}
                </div>
                <div className="form-group-date col-1 select-day" style={{ textAlign: 'left', marginTop: '10px' }}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <Typography sx={{ mt: 2, mb: 1, color: 'cadetblue', fontSize: '14px', width: '130px' }}>Ngày sản xuất: </Typography>
                        <Controller
                            name="dateOfManufacture"
                            control={control}
                            defaultValue={start}
                            
                            render={({ field }) => (
                                <DatePicker
                                    value={start}
                                    mask="____/__/__"
                                    onChange={(newValue) => {
                                        setStart(newValue);
                                    }}
                                    disabled={product && product.manufacturer._id !== accountUser._id}
                                    renderInput={(startProps) => (
                                        <TextField {...startProps} />
                                    )}
                                />)}
                        />
                        <Box sx={{ margin: '10px', color: 'cadetblue', fontSize: '14px', width: 130 }}>Thời hạn bảo hành</Box>
                        <Controller
                            name="warrantyPeriod"
                            control={control}
                            defaultValue={end}
                            render={({ field }) => (
                                <DatePicker
                                    value={end}
                                    mask="____/__/__"
                                    onChange={(newValue) => {
                                        setEnd(newValue);
                                    }}
                                    disabled={product && product.manufacturer._id !== accountUser._id}
                                    renderInput={(endProps) => (
                                        <TextField {...endProps} />
                                    )}
                                />)}
                        />
                    </LocalizationProvider>
                </div>
                <div className="form-group col-1">
                    <label>Giảm giá:</label>
                    <select {...register("discount", { required: "* Chọn mức giảm giá" })} placeholder='discount' defaultValue={product && product.discount}>
                        <option value={0}>0%</option>
                        {
                            Discounts.map((value, index) => (
                                <option value={value / 100} key={index} selected={product ? product.discount == value / 100 : false}>{value}%</option>
                            ))
                        }
                    </select>
                    {errors.discount && <div className="alert">{errors.discount.message}</div>}
                </div>
                <div className="form-group col-2">
                    <label>Mô tả: </label>
                    <textarea style={{ height: '500px', border: '1px solid #e2dede', outline: 'none' }}  {...register("description", {
                        required: "* Nhập mô tả!",
                        minLength: {
                            value: 20,
                            message: "* Nhập thêm thông tin mô tả",
                        },
                        maxLength: {
                            value: 2024,
                            message: "* Mô tả quá dài!"
                        }
                    })}
                        defaultValue={product && product.description}
                        disabled={product && product.manufacturer._id !== accountUser._id}
                    />
                    {errors.description && <div className="alert">{errors.description.message}</div>}
                </div>
                <div className="form-group form-group-img col-2" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                    <label>Hình ảnh: </label>
                    <input type='file' {...register("imageUrl")} name="imageUrl" onChange={(e)=>handleChangePreview(e)} id='image-0' className='image-select' />
                    <div className='image-slide'>
                        <div className='image-slide__item' onClick={()=>{
                                if(product && product.manufacturer._id !== accountUser._id) return
                                document.getElementById('image-0').click()}}
                            >
                            {(!imagePreview && !product) && <AddIcon fontSize='large' />}
                            {imagePreview && <img src={imagePreview.preview}/>}
                            {(!imagePreview && product) && <img src={ConvertToImageURL(product?.imageUrl)}/>}
                        </div>
                    </div>
                </div>
                <button type='submit' ref={formRef} style={{display:'none'}}>SUBMIT</button>
            </form>
        </div>
    );
}

export default ProductForm;