import * as types from './types'
import API from '../../../apis/CategoryAPI'
import { CheckExpiredToken } from 'utils/authUtil'
import useNotification from 'hooks/notification'

const getAllCategory = (callback = ()=>{}) => {
    return (dispatch) => {
        dispatch({type: types.GET_CATEGORY})
        API.getAllCategory()
        .then((result=>{
            if(result.status === 200){
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

const createCategory = (data, callback = ()=>{}) => {
    return async(dispatch) => {
        await CheckExpiredToken()
        dispatch({type: types.CREATE_CATEGORY})
        API.addCategory(data)
        // .then((response)=>response.json())
        .then((result=>{
            if(result.status === 201){
                dispatch({
                    type: types.CREATE_CATEGORY_SUCCESS,
                    payload: {
                        parent: {...result.data.category},
                        childrens: []
                    }
                })
                callback()
                useNotification.Success({
                    title: "Thành công!",
                    message:"Bạn đã thêm danh mục thành công!"
                })
            }else{
                dispatch({
                    type: types.CREATE_CATEGORY_FAIL
                })
            }
        }))
        .catch((error)=>{
            useNotification.Error({
                title: "Lỗi!",
                message:"Server Error!"
            })
            dispatch({
                type: types.CREATE_CATEGORY_FAIL
            })
        })
    }
}

const updateCategory = (id, data, callback = ()=>{}) => {
    return async(dispatch) => {
        await CheckExpiredToken()
        dispatch({type: types.UPDATE_CATEGORY})
        API.updateCategory(id, data)
        .then((result=>{
            if(result.status === 200){
                dispatch({
                    type: types.UPDATE_CATEGORY_SUCCESS,
                    payload: {
                        id: id,
                        data: {
                            parent: {...result.data.category},
                            childrens: []
                        }
                    }
                })
                useNotification.Success({
                    title: "Thành công!",
                    message:"Bạn đã cập nhật danh mục thành công!"
                })
                callback()
            }else{
                dispatch({
                    type: types.GET_CATEGORY_FAIL
                })
            }
        }))
        .catch((error)=>{
            useNotification.Error({
                title: "Lỗi!",
                message:"Server Error!"
            })
            dispatch({
                type: types.GET_CATEGORY_FAIL
            })
        })
    }
}

const createSubCategory = (data, callback = ()=>{}) => {
    return async(dispatch) => {
        await CheckExpiredToken()
        dispatch({type: types.CREATE_SUBCATEGORY})
        API.addSubCategory(data)
        // .then((response)=>response.json())
        .then((result=>{
            if(result.status === 201){
                dispatch({
                    type: types.CREATE_SUBCATEGORY_SUCCESS,
                    payload: {
                        parent: {...result.data.subCategory},
                        childrens: []
                    }
                })
                callback()
                useNotification.Success({
                    title: "Thành công!",
                    message:"Bạn đã thêm danh mục con thành công!"
                })
            }else{
                dispatch({
                    type: types.CREATE_SUBCATEGORY_FAIL
                })
            }
        }))
        .catch((error)=>{
            useNotification.Error({
                title: "Lỗi!",
                message:"Server Error!"
            })
            dispatch({
                type: types.CREATE_CATEGORY_FAIL
            })
        })
    }
}

const updateSubCategory = (id, data, callback = ()=>{}) => {
    return async(dispatch) => {
        await CheckExpiredToken()
        dispatch({type: types.UPDATE_SUBCATEGORY})
        API.updateSubCategory(id, data)
        .then((result=>{
            if(result.status === 200){
                dispatch({
                    type: types.UPDATE_SUBCATEGORY_SUCCESS,
                    payload: {
                        id: id,
                        data: {
                            parent: {...result.data.subCategory},
                            childrens: []
                        }
                    }
                })
                useNotification.Success({
                    title: "Thành công!",
                    message:"Bạn đã cập nhật danh mục con thành công!"
                })
                callback()
            }else{
                dispatch({
                    type: types.UPDATE_SUBCATEGORY_FAIL
                })
            }
        }))
        .catch((error)=>{
            useNotification.Error({
                title: "Lỗi!",
                message:"Server Error!"
            })
            dispatch({
                type: types.UPDATE_SUBCATEGORY_FAIL
            })
        })
    }
}

// const deleteCategory = (id, callback = ()=>{}) => {
//     return async(dispatch) => {
//         await CheckExpiredToken()
//         dispatch({type: types.DELETE_CATEGORY})
//         API.deleteCategory(id)
//         .then((result=>{
//             if(result.status === 204){
//                 dispatch({
//                     type: types.DELETE_CATEGORY_SUCCESS,
//                     payload: id
//                 })
//                 useNotification.Success({
//                     title: "Thành công!",
//                     message:"Bạn đã xóa danh mục thành công!"
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
//                 message:`Lỗi server`
//             })
//         })
//     }
// }

export {
    getAllCategory,
    createCategory,
    updateCategory,
    updateSubCategory,
    createSubCategory
}