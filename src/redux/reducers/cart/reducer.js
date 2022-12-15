import * as types from './types'

const initialState = {
  cartData: {},
  loading: false,
}
export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case types.GET_CART: {
      return {
        ...state,
        loading: true
      }
    }
    case types.GET_CART_FAIL: {
      return {
        ...state,
        loading: false
      }
    }
    case types.GET_CART_SUCCESS: {
      return {
        ...state,
        loading: false,
        cartData: action.payload,
      }
    }
    default:
      return state
  }
}
export default reducer
