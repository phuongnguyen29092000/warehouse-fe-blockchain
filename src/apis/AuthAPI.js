import axiosClient from "./axiosClient";
import {getHeaderWithToken, refreshTokenValue} from "./getHeaderWithToken";


const login = (data) => {
    let url = '/auth/login'
    return axiosClient.post(url, {email: data.get('email'), password: data.get("password")})
}

const refreshToken = (data) => {
    let url = '/auth/refresh-tokens'
    return axiosClient.post(url, data)
}

const logout = () => {
    let url = '/auth/logout'
    return axiosClient.post(url, refreshTokenValue(), {headers: getHeaderWithToken()})
}

export default {
    login,
    refreshToken,
    logout
}