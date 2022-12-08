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

const updateUserInfo = (id, data) => {
    console.log({data});
    let url = `/user/${id}`
    return axiosClient.put(url, data, { headers: getHeaderWithToken() });
}

const updateAdminInfo = (id, data) => {
    console.log({data});
    let url = `/admin/${id}`
    return axiosClient.put(url, data, { headers: getHeaderWithToken() });
}

export default {
    signup,
    getAllUser,
    setActiveUser,
    getUserById,
    getUserBySearchKey,
    updateAdminInfo,
    updateUserInfo
}