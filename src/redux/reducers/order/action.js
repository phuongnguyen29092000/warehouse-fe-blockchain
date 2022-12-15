import * as types from './types'
import API from '../../../apis/OrderAPI'
import { CheckExpiredToken } from 'utils/authUtil'
// import useNotification from 'hooks/notification'

const getAllOrderByUser = (id, queriesData, callback = ()=>{}) => {
    return async(dispatch) => {
        await CheckExpiredToken()
        dispatch({type: types.GET_ORDER})
        API.getAllOrderByUser(id, queriesData)
        .then((result=>{
            if(result.status === 200){
                dispatch({
                    type: types.GET_ORDER_SUCCESS,
                    payload: {...result.data.data}
                })
                callback([...result.data.data.orders])
            }else{
                dispatch({
                    type: types.GET_ORDER_FAIL
                })
            }
        }))
        .catch((error)=>{
            console.log(error);
            dispatch({
                type: types.GET_ORDER_FAIL
            })
        })
    }
}

const createOrder = (data, callback = ()=>{}) => {
    return async(dispatch) => {
        await CheckExpiredToken()
        dispatch({type: types.CREATE_ORDER})
        API.addOrder(data)
        .then((result=>{
            if(result.status === 201){
                dispatch({
                    type: types.CREATE_ORDER_SUCCESS,
                    payload: {...result.data}
                })
                callback({...result.data})
            }else{
                dispatch({
                    type: types.CREATE_ORDER_FAIL
                })
            }
        }))
        .catch((error)=>{
            console.log(error);
            dispatch({
                type: types.CREATE_ORDER_FAIL
            })
        })
    }
}

const getOrderDetail = (id, callback = ()=>{}) => {
    return async(dispatch) => {
        await CheckExpiredToken()
        dispatch({type: types.GET_ORDER_DETAIL})
        API.getOrderById(id)
        .then((result=>{
            if(result.status === 200){
                dispatch({
                    type: types.GET_ORDER_DETAIL_SUCCESS,
                    payload: {...result.data.order}
                })
                callback({...result.data.order})
            }else{
                dispatch({
                    type: types.GET_ORDER_DETAIL_FAIL
                })
            }
        }))
        .catch((error)=>{
            console.log(error);
            dispatch({
                type: types.GET_ORDER_DETAIL_FAIL
            })
        })
    }
}

export {
    getAllOrderByUser,
    createOrder,
    getOrderDetail
}