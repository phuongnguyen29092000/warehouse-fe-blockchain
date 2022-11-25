import axiosClient from "./axiosClient";
import { getHeaderWithToken } from "./getHeaderWithToken";

const addProduct = (data) => {
  const url = "/product/create";
  return axiosClient.post(url, data, { headers: getHeaderWithToken() });
};

const getAllProduct = (queriesData) => {
  const url = `/product?skip=${queriesData.skip}&limit=${queriesData.limit}&min=${queriesData?.min}&max=${queriesData?.max}&cate=${queriesData?.categoryId}&subcate=${queriesData?.subCategoryId}&dis=${queriesData?.isDiscount}&s=${queriesData?.s}`;
  return axiosClient.get(url);
};

const getAllProductPerCompany = (id, queriesData) => {
  const url = `/product/company/${id}?skip=${queriesData.skip}&limit=${queriesData.limit}&min=${queriesData?.min}&max=${queriesData?.max}&cate=${queriesData?.categoryId}&subcate=${queriesData?.subCategoryId}&dis=${queriesData?.isDiscount}&s=${queriesData?.s}`;
  return axiosClient.get(url);
};

const getProductById = (id) => {
  const url = `/product/${id}`;
  return axiosClient.get(url);
};

const updateProduct = (id, data) => {
  const url = `/product/${id}`;
  return axiosClient.put(url, data, { headers: getHeaderWithToken() });
};

const deleteProduct = (id) => {
  const url = `/product/${id}`;
  return axiosClient.delete(url, { headers: getHeaderWithToken() });
};

export default {
  addProduct,
  getAllProduct,
  getProductById,
  updateProduct,
  deleteProduct,
  getAllProductPerCompany
};
