import axiosClient from "./axiosClient";
import {getHeaderWithToken} from "./getHeaderWithToken";

const addOrder = (data) => {
  const url = '/order/create';
  return axiosClient.post(url, data, {headers: getHeaderWithToken()})
}

const getAllOrderByUser = (id, queriesData) => {
  const url = `/order/company/${id}?skip=${queriesData.skip}&limit=${queriesData.limit}&s=${queriesData?.s}&type=${queriesData?.type}`;
  return axiosClient.get(url, {headers: getHeaderWithToken()})
}
  
const getOrderById = (id) => {
	const url = `/order/${id}`
	return axiosClient.get(url)
}

const getOrderByAddress = (address, data) => {
	const url = `/order/wallet/${address}`
	return axiosClient.post(url ,data, {headers: getHeaderWithToken()})
}

const updateOrder = (id, data) => {
  const url = `/order/${id}`
  return axiosClient.put(url, data, {headers: getHeaderWithToken()})
}

export default {
  addOrder,
	getAllOrderByUser,
	getOrderById,
	updateOrder,
  getOrderByAddress
}