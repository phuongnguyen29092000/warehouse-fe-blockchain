import axiosClient from "./axiosClient";
import {getHeaderWithToken, refreshTokenValue} from "./getHeaderWithToken";


const signup = (data) => {
    let url = '/user/create'
    return axiosClient.post(url,data)
}

const getAllUser = () => {
    let url = '/user'
    return axiosClient.get(url, { headers: getHeaderWithToken() });
}

const setActiveUser = (id) => {
    let url = `/user/set_active/${id}`
    return axiosClient.put(url, {}, { headers: getHeaderWithToken() });
}

export default {
    signup,
    getAllUser,
    setActiveUser
}