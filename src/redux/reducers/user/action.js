import * as types from "./types";
// import API from '../../../api/UserAPI'
import AuthAPI from "apis/AuthAPI";
import UserAPI from "apis/UserAPI";
import {
  removeAccessToken,
  removeRefreshToken,
  removeTimeRefresh,
  removeUser,
  setAccessToken,
  setRefreshToken,
  setTimeRefresh,
  setUser,
} from "hooks/localAuth";
import Cookies from "js-cookie";
import useNotification from "../../../hooks/notification";
import { CheckExpiredToken } from "../../../utils/authUtil";

const setAccountInfo = (account, callback = () => {}) => {
  return (dispatch) => {
    dispatch({
      type: types.SET_ACCOUNT_INFO,
      payload: account,
    });
    callback();
  };
};

const login = (info, callback = () => {}) => {
  return (dispatch) => {
    AuthAPI.login(info)
      .then((result) => {
        if (result.status === 200) {
          setAccessToken(result.data.tokenAuth.access.token);
          setRefreshToken(result.data.tokenAuth.refresh.token);
          setTimeRefresh(result.data.tokenAuth.access.expires);
          setUser(JSON.stringify(result.data.user));
          callback(result.data.user);
          dispatch({
            type: types.SET_ACCOUNT_INFO,
            payload: result.data.user,
          });
        } else {
          useNotification.Error({
            title: "Vui lòng kiểm tra lại email và mật khẩu",
            message: "Đăng nhập thất bại!",
            duration: 5000,
          });
        }
      })
      .catch((error) => {
        console.log(error);
        useNotification.Error({
          title: "Vui lòng kiểm tra lại email và mật khẩu",
          message: "Đăng nhập thất bại!",
          duration: 5000,
        });
      });
  };
};
const logout = (callback = () => {}) => {
  return async (dispatch) => {
    await CheckExpiredToken();
    AuthAPI.logout()
      .then((res) => {
        if (res?.status === 200) {
          dispatch({
            type: types.RESET_ACCOUNT_INFO,
          });
          removeUser();
          removeAccessToken();
          removeRefreshToken();
          removeTimeRefresh();
          Cookies.remove();
          useNotification.Success({
            title: "Thành công!",
            message: "Đăng xuất thành công!",
            duration: 4000,
          });
          callback(true);
        } else {
          useNotification.Error({
            title: "Lỗi server!",
            message: "Đăng xuất thất bại!",
          });
        }
      })
      .catch((error) => {
        console.log(new Error(error));
        useNotification.Error({
          title: "Lỗi server!",
          message: "Đăng xuất thất bại!",
        });
      });
  };
  // window.location.reload()
};

const signup = (info, callback = () => {}) => {
  return async (dispatch) => {
    dispatch({ type: types.CREATE_USER });
    UserAPI.signup(info)
      .then((result) => {
        if (result.status === 201) {
          setAccessToken(result.data.tokenAuth.access.token);
          setRefreshToken(result.data.tokenAuth.refresh.token);
          setTimeRefresh(result.data.tokenAuth.access.expires);
          setUser(JSON.stringify(result.data.user));
          callback(result.data.user);
          useNotification.Success({
            title: "Thành công!",
            message: "Đăng kí thành công!",
            duration: 4,
          });
          dispatch({
            type: types.SET_ACCOUNT_INFO,
            payload: result.data.user,
          });
        } else {
          useNotification.Error({
            title: "Lỗi!",
            message: "Đăng kí thất bại!",
            duration: 4000,
          });
          dispatch({
            type: types.CREATE_USER_FAIL,
          });
        }
      })
      .catch((error) => {
        useNotification.Error({
          title: "Lỗi!",
          message: "Đăng kí thất bại!",
          duration: 4000,
        });
        dispatch({
          type: types.CREATE_USER_FAIL,
        });
      });
  };
};

const getAllUsers = (callback = () => {}) => {
  return async (dispatch) => {
    await CheckExpiredToken();
    dispatch({ type: types.GET_ALL_USER });
    UserAPI.getAllUser()
      .then((result) => {
        if (result.status === 200) {
          dispatch({
            type: types.GET_ALL_USER_SUCCESS,
            payload: [...result.data.users],
          });
          callback();
        } else {
          dispatch({
            type: types.GET_ALL_USER_FAIL,
          });
        }
      })
      .catch((error) => {
        dispatch({
          type: types.GET_ALL_USER_FAIL,
        });
      });
  };
};

const setActive = (owner, callback = () => {}) => {
  return async (dispatch) => {
    await CheckExpiredToken();
    dispatch({ type: types.SET_ACTIVE_OWNER });
    UserAPI.setActiveUser(owner._id)
      .then((result) => {
        if (result.status === 200) {
          dispatch({
            type: types.SET_ACTIVE_OWNER_SUCCESS,
            payload: {
              id: owner._id,
              data: { ...result.data.user },
            },
          });
          useNotification.Success({
            title: "Thành công!",
            message: `Bạn đã ${
              owner?.active ? "ngừng" : "thiết lập"
            } hoạt động ${owner?.companyName}!`,
          });
          callback();
        } else {
          dispatch({
            type: types.SET_ACTIVE_OWNER_FAIL,
          });
        }
      })
      .catch((error) => {
        dispatch({
          type: types.SET_ACTIVE_OWNER_FAIL,
        });
        useNotification.Error({
          title: "Lỗi!",
          message: "Server Error!",
        });
      });
  };
};

const updateAdminInfo = (id, data, callback = () => {}) => {
  return async (dispatch) => {
    await CheckExpiredToken();
    UserAPI.updateAdminInfo(id, data)
      .then((result) => {
        if (result.status === 200) {
          dispatch({
            type: types.SET_ACCOUNT_INFO,
            payload: result.data.user,
          });
          useNotification.Success({
            title: "Thành công!",
            message: 'Cập nhật thông tin thành công',
          });
          callback();
        } else {
          useNotification.Error({
          title: "Lỗi!",
          message: "Server Error!",
        });
        }
      })
      .catch((error) => {
        useNotification.Error({
          title: "Lỗi!",
          message: "Server Error!",
        });
      });
  };
};

const updateUserInfo = (id, data, callback = () => {}) => {
  return async (dispatch) => {
    await CheckExpiredToken();
    UserAPI.updateUserInfo(id, data)
      .then((result) => {
        if (result.status === 200) {
          dispatch({
            type: types.SET_ACCOUNT_INFO,
            payload: result.data.user,
          });
          useNotification.Success({
            title: "Thành công!",
            message: 'Cập nhật thông tin thành công',
          });
          callback();
        } else {
          useNotification.Error({
          title: "Lỗi!",
          message: "Server Error!",
        });
        }
      })
      .catch((error) => {
        useNotification.Error({
          title: "Lỗi!",
          message: "Server Error!",
        });
      });
  };
};

const changePassword = (data, callback = () => {}) => {
  return async (dispatch) => {
    await CheckExpiredToken();
    AuthAPI.changePass(data)
      .then((result) => {
        if (result.status === 200) {
          // dispatch({
          //   type: types.SET_ACCOUNT_INFO,
          //   payload: result.data.user,
          // });
          useNotification.Success({
            title: "Thành công!",
            message: 'Đổi mật khẩu thành công',
          });
          callback();
        } else {
          useNotification.Error({
          title: "Lỗi!",
          message: "Vui lòng thử lại!",
        });
        }
      })
      .catch((error) => {
        useNotification.Error({
          title: "Lỗi!",
          message: "Vui lòng thử lại!",
        });
      });
  };
};

export {changePassword, setAccountInfo, login, logout, signup, getAllUsers, setActive,updateAdminInfo, updateUserInfo};
