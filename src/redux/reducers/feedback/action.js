import * as types from './types'
import API from '../../../apis/FeedbackAPI'
import { CheckExpiredToken } from 'utils/authUtil'
import useNotification from 'hooks/notification'
// import useNotification from 'hooks/notification'

const getAllFeedbackByCompany = (id, data, callback = ()=>{}) => {
    return async(dispatch) => {
        await CheckExpiredToken()
        dispatch({type: types.GET_FEEDBACK})
        API.getFeedbackByCompany(id, data)
        .then((result=>{
            if(result.status === 200){
                dispatch({
                    type: types.CREATE_FEEDBACK_SUCCESS,
                    payload: [...result.data.feedbacks]
                })
                callback([...result.data.feedbacks])
               
            }else{
                dispatch({
                    type: types.GET_FEEDBACK_FAIL
                })
            }
        }))
        .catch((error)=>{
            console.log(error);
            dispatch({
                type: types.GET_FEEDBACK_FAIL
            })
        })
    }
}

const createFeedback = (id, data, callback = ()=>{}) => {
    return async(dispatch) => {
        await CheckExpiredToken()
        dispatch({type: types.CREATE_FEEDBACK})
        API.addFeedback(id,data)
        .then((result=>{
            if(result.status === 201){
                dispatch({
                    type: types.CREATE_FEEDBACK_SUCCESS,
                    payload: {...result.data.feedback}
                })
                useNotification.Success({
                    title: "Thành công!",
                    message:"Bạn đã đánh giá thành công đơn hàng nhập kho!"
                })
                callback({...result.data.feedback})
            }else{
                dispatch({
                    type: types.CREATE_FEEDBACK_FAIL
                })
            }
        }))
        .catch((error)=>{
            console.log(error);
            dispatch({
                type: types.CREATE_FEEDBACK_FAIL
            })
        })
    }
}

const getFeedbackById = (id, callback = ()=>{}) => {
    return async(dispatch) => {
        await CheckExpiredToken()
        dispatch({type: types.GET_FEEDBACK_DETAIl})
        API.getFeedbackById(id)
        .then((result=>{
            if(result.status === 200){
                dispatch({
                    type: types.GET_FEEDBACK_DETAIl_SUCCESS,
                })
                callback(result.data.feedback)
               
            }else{
                dispatch({
                    type: types.GET_FEEDBACK_DETAIl_FAIL
                })
            }
        }))
        .catch((error)=>{
            console.log(error);
            dispatch({
                type: types.GET_FEEDBACK_DETAIl_FAIL
            })
        })
    }
}

export  {
    getAllFeedbackByCompany,
    createFeedback,
    getFeedbackById
}