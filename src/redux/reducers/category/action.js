import * as types from './types'
import API from '../../../apis/CategoryAPI'
// import useNotification from 'hooks/notification'
// import { CheckExpiredToken } from 'ultis/authUtil'

const getAllCategory = (callback = ()=>{}) => {
    return (dispatch) => {
        dispatch({type: types.GET_CATEGORY})
        API.getAllCategory()
        // .then((response)=>response.json())
        .then((result=>{
            if(result.status === 200){
                console.log('---------------------');
                dispatch({
                    type: types.GET_CATEGORY_SUCCESS,
                    payload: [...result.data.categories]
                })
                callback([...result.data.categories])
            }else{
                dispatch({
                    type: types.GET_CATEGORY_FAIL
                })
            }
        }))
        .catch((error)=>{
            console.log(error);
            dispatch({
                type: types.GET_CATEGORY_FAIL
            })
        })
    }
}

// const createCategory = (data, callback = ()=>{}) => {
//     return async(dispatch) => {
//         await CheckExpiredToken()
//         dispatch({type: types.CREATE_CATEGORY})
//         API.createCATEGORY(data)
//         // .then((response)=>response.json())
//         .then((result=>{
//             if(result.status === 201){
//                 dispatch({
//                     type: types.CREATE_CATEGORY_SUCCESS,
//                     payload: {...result.data.CATEGORY}
//                 })
//                 callback()
//                 useNotification.Success({
//                     title: "Thành công!",
//                     message:"Bạn đã thêm loại địa hình thành công!"
//                 })
//             }else{
//                 dispatch({
//                     type: types.CREATE_CATEGORY_FAIL
//                 })
//             }
//         }))
//         .catch((error)=>{
//             useNotification.Error({
//                 title: "Lỗi!",
//                 message:"Server Error!"
//             })
//             dispatch({
//                 type: types.CREATE_CATEGORY_FAIL
//             })
//         })
//     }
// }

// const updateCategory = (id, data, callback = ()=>{}) => {
//     return async(dispatch) => {
//         await CheckExpiredToken()
//         dispatch({type: types.UPDATE_CATEGORY})
//         API.updateCATEGORY(id, data)
//         .then((result=>{
//             if(result.status === 200){
//                 dispatch({
//                     type: types.UPDATE_CATEGORY_SUCCESS,
//                     payload: {
//                         id: id,
//                         data: result.data.CATEGORY
//                     }
//                 })
//                 useNotification.Success({
//                     title: "Thành công!",
//                     message:"Bạn đã cập nhật loại địa hình thành công!"
//                 })
//                 callback()
//             }else{
//                 dispatch({
//                     type: types.GET_CATEGORY_FAIL
//                 })
//             }
//         }))
//         .catch((error)=>{
//             useNotification.Error({
//                 title: "Lỗi!",
//                 message:"Server Error!"
//             })
//             dispatch({
//                 type: types.GET_CATEGORY_FAIL
//             })
//         })
//     }
// }

// const deleteCategory = (id, callback = ()=>{}) => {
//     return async(dispatch) => {
//         await CheckExpiredToken()
//         dispatch({type: types.DELETE_CATEGORY})
//         API.deleteCATEGORY(id)
//         .then((result=>{
//             if(result.status === 204){
//                 dispatch({
//                     type: types.DELETE_CATEGORY_SUCCESS,
//                     payload: id
//                 })
//                 useNotification.Success({
//                     title: "Thành công!",
//                     message:"Bạn đã xóa loại địa hình thành công!"
//                 })
//                 callback()
//             } 
//             else{
//                 dispatch({
//                     type: types.DELETE_CATEGORY_FAIL
//                 })
//             }
//         }))
//         .catch((error)=>{
//             dispatch({
//                 type: types.DELETE_CATEGORY_FAIL,
//                 payload: error
//             })
//             useNotification.Error({
//                 title: "Lỗi",
//                 message:`Có tour đang sử dụng loại địa hình này!\n Không thể xóa`
//             })
//         })
//     }
// }

export {
    getAllCategory,
    // createCategory,
    // updateCategory,
    // deleteCategory
}