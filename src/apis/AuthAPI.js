import axiosClient from "./axiosClient";
import {getHeaderWithToken, refreshTokenValue} from "./getHeaderWithToken";


const login = (data) => {
    let url = '/auth/login'
    return axiosClient.post(url, {email: data.get('email'), password: data.get("password")})
}

const changePass = (data) => {
    let url = '/auth/changepass'
    return axiosClient.post(url, data, {headers: getHeaderWithToken()})
}

const refreshToken = (data) => {
    let url = '/auth/refresh-tokens'
    return axiosClient.post(url, data)
}

const logout = () => {
    let url = '/auth/logout'
    return axiosClient.post(url, refreshTokenValue(), {headers: getHeaderWithToken()})
}

const forgotPassword = (data) => {
    let url = '/auth/forgot-password'
    return axiosClient.post(url, data)
}

const resetPassword = (token, data) => {
    let url = `/auth/reset-password?token=${token}`
    return axiosClient.post(url, data)
}

export default {
    login,
    refreshToken,
    logout,
    changePass,
    forgotPassword,
    resetPassword
}