import * as types from './types'
import API from '../../../apis/CartAPI'
import { CheckExpiredToken } from 'utils/authUtil'
import useNotification from 'hooks/notification'

const getCartByUser = (id, callback = ()=>{}) => {
    return (dispatch) => {
        dispatch({type: types.GET_CART})
        API.getCartByUser(id)
        .then((result=>{
            if(result.status === 200){
                dispatch({
                    type: types.GET_CART_SUCCESS,
                    payload: {...result.data.cart}
                })
                callback({...result.data.cart})
            }else{
                dispatch({
                    type: types.GET_CART_FAIL
                })
            }
        }))
        .catch((error)=>{
            console.log(error);
            dispatch({
                type: types.GET_CART_FAIL
            })
        })
    }
}

const addOrUpdateCart = (id, data, callback = ()=>{}) => {
    return async(dispatch) => {
        await CheckExpiredToken()
        dispatch({type: types.GET_CART})
        API.addOrUpdateCart(id, data)
        // .then((response)=>response.json())
        .then((result=>{
            if(result.status === 201 || result.status === 200){
                dispatch({
                    type: types.GET_CART_SUCCESS,
                    payload: {...result.data.cart}
                })
                callback({...result.data.cart})
                // useNotification.Success({
                //     title: "Thành công!",
                //     message:`Bạn đã thêm vào giỏ hàng thành công!`
                // })
            }
            else{
                dispatch({
                    type: types.GET_CART_FAIL
                })
            }
        }))
        .catch((error)=>{
            useNotification.Error({
                title: "Lỗi!",
                message:"Server Error!"
            })
            dispatch({
                type: types.GET_CART_FAIL
            })
        })
    }
}

const deleteItemCart = (id, data, callback = ()=>{}) => {
    return async(dispatch) => {
        await CheckExpiredToken()
        dispatch({type: types.GET_CART})
        API.deleteItemCart(id, data)
        .then((result=>{
            if(result.status === 200){
                dispatch({
                    type: types.GET_CART_SUCCESS,
                    payload: {...result.data.cart}
                })
                // useNotification.Success({
                //     title: "Thành công!",
                //     message:"Bạn đã bỏ khỏi giỏ hàng thành công!"
                // })
                callback({...result.data.cart})
            }else{
                dispatch({
                    type: types.GET_CART_FAIL
                })
            }
        }))
        .catch((error)=>{
            useNotification.Error({
                title: "Lỗi!",
                message:"Server Error!"
            })
            dispatch({
                type: types.GET_CART_FAIL
            })
        })
    }
}

const deleteMultipleItemCartById = (id, data, callback = ()=>{}) => {
    return async(dispatch) => {
        await CheckExpiredToken()
        dispatch({type: types.GET_CART})
        API.deleteMultipleItemCart(id, data)
        .then((result=>{
            if(result.status === 200){
                dispatch({
                    type: types.GET_CART_SUCCESS,
                    payload: {...result.data.cart}
                })
                callback({...result.data.cart})
            }else{
                dispatch({
                    type: types.GET_CART_FAIL
                })
            }
        }))
        .catch((error)=>{
            useNotification.Error({
                title: "Lỗi!",
                message:"Server Error!"
            })
            dispatch({
                type: types.GET_CART_FAIL
            })
        })
    }
}

export {
    getCartByUser,
    addOrUpdateCart,
    deleteItemCart,
    deleteMultipleItemCartById
}