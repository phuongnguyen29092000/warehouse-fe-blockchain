import * as types from './types'

const initialState = {
  accountUser: {},
  listUsers: {
    users: [],
    loading: false,
  },
}
export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case types.SET_ACCOUNT_INFO :{
      return {
        ...state,
        accountUser: action.payload
      }
    }
    case types.RESET_ACCOUNT_INFO :{
      return {
        ...state,
        accountUser: {}
      }
    }
    case types.GET_ALL_USER :{
      return {
        ...state,
        listUsers: {
          users: [],
          loading: true
        }
      }
    }
    case types.GET_ALL_USER_SUCCESS: {
      return {
        ...state,
        listUsers: {
          users: action.payload,
          loading: false
        }
      }
    }
    case types.GET_ALL_USER_FAIL: {
      return {
        ...state,
        listUsers: {
          loading: false
        }
      }
    }
    case types.SET_ACTIVE_OWNER :{
      return {
        ...state,
        listOwnerAdmin: {
          ...state.listOwnerAdmin,
          loading: true
        }
      }
    }
    case types.SET_ACTIVE_OWNER_SUCCESS: {
      let listOwnerTemp = [...state?.listUsers?.users];
      let indexUpdate = listOwnerTemp?.map((owner) => owner._id).indexOf(action.payload.id)
      let result = listOwnerTemp?.splice(indexUpdate, 1, action.payload.data);
      return {
        ...state,
        listUsers: {
          users: listOwnerTemp,
          loading: false
        }
      }
    }
    case types.SET_ACTIVE_OWNER_FAIL: {
      return {
        ...state,
        listUsers: {
          ...state.listUsers,
          loading: false
        }
      }
    }

    default:
      return state
  }
}
export default reducer
