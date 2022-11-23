import { getAccessToken, getRefreshToken } from "hooks/localAuth"

const getHeaderWithToken = () => {
    const token = getAccessToken()
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    }
}

const refreshTokenValue = () =>{
    const token = getAccessToken()
    const refreshToken = getRefreshToken()
    return {accessToken: token,  refreshToken : refreshToken}
}

export {
    getHeaderWithToken,
    refreshTokenValue
}