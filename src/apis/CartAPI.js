import axiosClient from "./axiosClient";
import {getHeaderWithToken} from "./getHeaderWithToken";

const addOrUpdateCart = (id,data) => {
    const url = `/cart/${id}`;
    return axiosClient.post(url, data, {headers: getHeaderWithToken()})
}  

const updateCountItemCart = (id,data) => {
    console.log({data});
    const url = `/cart/change-count/${id}`;
    return axiosClient.put(url, data, {headers: getHeaderWithToken()})
}  

const getCartByUser = (id) => {
	const url = `/cart/${id}`
	return axiosClient.get(url, {headers: getHeaderWithToken()})
}

const deleteItemCart = (id, data) => {
	const url = `/cart/${id}`
	return axiosClient.put(url, data, {headers: getHeaderWithToken()})
}

const deleteMultipleItemCart = (id, data) => {
	const url = `/cart/multiple/${id}`
	return axiosClient.put(url, data, {headers: getHeaderWithToken()})
}

export default {
    addOrUpdateCart, 
    getCartByUser,
    deleteItemCart,
    deleteMultipleItemCart,
    updateCountItemCart
}