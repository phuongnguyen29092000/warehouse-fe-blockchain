import * as types from './types'
import API from '../../../apis/ProductAPI'
import useNotification from 'hooks/notification'
// import useNotification from 'hooks/notification'
import { CheckExpiredToken } from 'utils/authUtil'

const getAllProductByQueries = (queriesData, callback = ()=>{}) => {
    return (dispatch) => {
        dispatch({type: types.GET_PRODUCT})
        API.getAllProduct(queriesData)
        .then((result=>{
            if(result.status === 200){
                dispatch({
                    type: types.GET_PRODUCT_SUCCESS,
                    payload: {...result.data}
                })
                callback({...result.data?.data})
            }else{
                dispatch({
                    type: types.GET_PRODUCT_FAIL
                })
            }
        }))
        .catch((error)=>{
            console.log(error);
            dispatch({
                type: types.GET_PRODUCT_FAIL
            })
        })
    }
}

const getAllProductPerCompany = (id, queriesData, callback = ()=>{}) => {
    return (dispatch) => {
        dispatch({type: types.GET_PRODUCT_PER_COMPANY})
        API.getAllProductPerCompany(id,queriesData)
        .then((result=>{
            if(result.status === 200){
                dispatch({ 
                    type: types.GET_PRODUCT_PER_COMPANY_SUCCESS,
                    payload: {...result.data}
                })
                callback({...result.data.data})
            }else{
                dispatch({
                    type: types.GET_PRODUCT_PER_COMPANY_FAIL
                })
            }
        }))
        .catch((error)=>{
            console.log(error);
            dispatch({
                type: types.GET_PRODUCT_PER_COMPANY_FAIL
            })
        })
    }
}

const getProductById = (id, callback = ()=>{}) => {
    return (dispatch) => {
        dispatch({type: types.GET_PRODUCT_DETAIL})
        API.getProductById(id)
        // .then((response)=>response.json())
        .then((result)=>{
            if(result.status === 200){
                console.log(result);
                dispatch({
                    type: types.GET_PRODUCT_DETAIL_SUCCESS,
                    payload: {...result.data.product}
                })
                callback({...result.data.product})
            }else{
                dispatch({
                    type: types.GET_PRODUCT_DETAIL_FAIL
                })
            }
        })
        .catch((error)=>{
            dispatch({
                type: types.GET_PRODUCT_DETAIL_FAIL
            })
        })
    }
}

const getSimilarProduct = (queriesData, callback = ()=>{}) => {
    return (dispatch) => {
        dispatch({type: types.GET_PRODUCT_SIMILAR})
        API.getAllProduct(queriesData)
        .then((result=>{
            if(result.status === 200){
                dispatch({
                    type: types.GET_PRODUCT_SIMILAR_SUCCESS,
                    payload: {...result.data}
                })
                callback([...result.data.data.products])
            }else{
                dispatch({
                    type: types.GET_PRODUCT_SIMILAR_FAIL
                })
            }
        }))
        .catch((error)=>{
            console.log(error);
            dispatch({
                type: types.GET_PRODUCT_SIMILAR_FAIL
            })
        })
    }
}

const addProduct = (data, callback=()=>{}) =>{
    return async(dispatch) => {
        await CheckExpiredToken()
        dispatch({type: types.CREATE_PRODUCT})
        API.addProduct(data)
        .then((result)=>{
            if(result.status === 201){
                dispatch({
                    type: types.CREATE_PRODUCT_SUCCESS,
                    payload: result.data.product
                })
                callback()
                useNotification.Success({
                    title: "Thành công!",
                    message:"Bạn đã thêm sản phẩm thành công!"
                })
            }else{
                dispatch({
                    type: types.CREATE_PRODUCT_FAIL
                })
            }
        })
        .catch((error)=>{
            console.log({error});
            dispatch({
                type: types.CREATE_PRODUCT_FAIL
            })
            useNotification.Error({
                title: "Lỗi!",
                message:"Server Error!"
            })
        })
    }
}

const updateProduct = (id, data, callback=()=>{}) =>{
    return async(dispatch) => {
        await CheckExpiredToken()
        dispatch({type: types.UPDATE_PRODUCT})
        API.updateProduct(id, data)
        .then((result)=>{
            if(result.status === 200){
                dispatch({
                    type: types.UPDATE_PRODUCT_SUCCESS,
                    payload: {
                        id: id,
                        data: result.data.product
                    }
                })
                callback()
                useNotification.Success({
                    title: "Thành công!",
                    message:"Bạn đã cập nhật sản phẩm thành công!"
                })
            }else{
                dispatch({
                    type: types.UPDATE_PRODUCT_FAIL
                })
            }
        })
        .catch((error)=>{
            console.log({error});
            dispatch({
                type: types.UPDATE_PRODUCT_FAIL
            })
            useNotification.Error({
                title: "Lỗi!",
                message:"Server Error!"
            })
        })
    }
}

const deleteProduct = (id, callback = ()=>{}) => {
    return async(dispatch) => {
        await CheckExpiredToken()
        dispatch({type: types.DELETE_PRODUCT})
        API.deleteProduct(id)
        .then((result)=>{
            if(result.status === 204){
                dispatch({
                    type: types.DELETE_PRODUCT_SUCCESS,
                    payload: id
                })
                callback()
                useNotification.Success({
                    title:"Thành công!",
                    message:"Xóa sản phẩm thành công!"
                })
            }else{
                dispatch({
                    type: types.DELETE_PRODUCT_FAIL
                })
                useNotification.Error({
                    title:"Lỗi!",
                    message:"Server Error!"
                })
            }
        })
        .catch((error)=>{
            dispatch({
                type: types.DELETE_PRODUCT_FAIL
            })
            useNotification.Error({
                title:"Lỗi!",
                message:"Server Error!"
            })
        })
    }
}

export {
    getAllProductByQueries,
    getProductById,
    getSimilarProduct,
    getAllProductPerCompany,
    addProduct,
    updateProduct,
    deleteProduct
}