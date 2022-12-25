import { getRefreshToken, getTimeRefresh, removeAccessToken, removeRefreshToken, removeTimeRefresh, removeUser, setAccessToken, setRefreshToken, setTimeRefresh, setUser } from "../hooks/localAuth"
import AuthAPI from "../apis/AuthAPI";
import useNotification from "../hooks/notification";
import Cookies from "js-cookie";
import { ROUTE_HOME } from "../route/type";

export const CheckExpiredToken = async() => {
  const now = Date.now()
  const time_refresh = getTimeRefresh()
  const refresh_token = getRefreshToken()
  if (now >= time_refresh) {
    if (refresh_token) {
      if (now >= time_refresh) {
        await AuthAPI
          .refreshToken({refreshToken: refresh_token})
          .then((result) => {
            if (result.status === 200) {
              setAccessToken(result.data.tokens.access.token)
              setTimeRefresh(result.data.tokens.access.expires)
              window.location.reload()
            } else {
              useNotification.Error({
                title: 'Message',
                message: result.message,
              })
            }
          })
          .catch((error) =>
            useNotification.Error({
              title: 'Message',
              message: 'Error connection server!',
            })
          )
      }
    }
    else Logout()
  }
}

export const Logout = () => {
  removeUser()
  removeAccessToken()
  removeRefreshToken()
  removeTimeRefresh()
  Cookies.remove()

  window.location.href = ROUTE_HOME
}
