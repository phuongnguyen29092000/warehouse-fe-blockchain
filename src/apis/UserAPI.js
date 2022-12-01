import axiosClient from "./axiosClient";
import {getHeaderWithToken, refreshTokenValue} from "./getHeaderWithToken";

const signup = (data) => {
    let url = '/user/create'
    return axiosClient.post(url,data)
}

const getUserById = (id) => {
    let url = `/user/${id}`
    return axiosClient.get(url)
}

const getAllUser = () => {
    let url = '/user'
    return axiosClient.get(url, { headers: getHeaderWithToken() });
}

const setActiveUser = (id) => {
    let url = `/user/set_active/${id}`
    return axiosClient.put(url, {}, { headers: getHeaderWithToken() });
}

const getUserBySearchKey = (searchKey) => {
    let url = `/user/search?key=${searchKey}`
    return axiosClient.get(url);
}

export default {
    signup,
    getAllUser,
    setActiveUser,
    getUserById,
    getUserBySearchKey
}