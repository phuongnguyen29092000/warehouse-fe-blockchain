import axiosClient from "./axiosClient";
import {getHeaderWithToken} from "./getHeaderWithToken";

const addCategory = (data) => {
  const url = '/category/create';
  return axiosClient.post(url, data, {headers: getHeaderWithToken()})
}

const getAllCategory = () => {
  const url = '/category';
  console.log(url);
  return axiosClient.get(url)
}
  
const getCateById = (id) => {
	const url = `/category/${id}`
	return axiosClient.get(url)
}

const updateCategory = (id, data) => {
  const url = `/category/${id}`
  return axiosClient.put(url, data, {headers: getHeaderWithToken()})
}

const deleteCategory = (id) => {
  const url = `/category/${id}`;
  return axiosClient.delete(url, {headers: getHeaderWithToken()});
}


export default {
  addCategory,
	getAllCategory,
	getCateById,
	updateCategory,
	deleteCategory,
}