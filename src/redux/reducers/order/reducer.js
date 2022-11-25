import * as types from './types'

const initialState = {
  orders: {
    data: [], 
    totalCount: 0,
    loading: false
  },
  orderDetail: {},
  loading: false,
  error: {},
  newOrder: {
    data: {},
    details: [],
    loading: false 
  },
}
export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case types.GET_ORDER: {
      return {
        ...state,
        orders: {
          ...state.orders,
          loading: true
        }
      }
    }
    case types.GET_ORDER_FAIL: {
      return {
        ...state,
        orders: {
          ...state.orders,
          loading: false
        }
      }
    }
    case types.GET_ORDER_SUCCESS: {
      const {orders, count} = action.payload
      return {
        ...state,
        orders: {
          ...state.orders,
          data: orders,
          totalCount: count,
          loading: false
        }
      }
    }

    case types.CREATE_ORDER: {
      return {
        ...state,
        newOrder: {
          ...state.newOrder,
          loading: true,
        }
      }
    }
    case types.CREATE_ORDER_FAIL: {
      return {
        ...state,
        newOrder: {
          ...state.newOrder,
          loading: false,
        }
      }
    }
    case types.CREATE_ORDER_SUCCESS: {
      const {order, details} = action.payload
      return {
        ...state,
        newOrder: {
          ...state.newOrder,
          data: {...order},
          details: details,
          loading: false,
        }
      }
    }

    case types.GET_ORDER_DETAIL: {
      return {
        ...state, 
        loading: true,
      }
    }
    case types.GET_ORDER_DETAIL_FAIL: {
      return {
        ...state, 
        loading: false,
      }
    }
    case types.GET_ORDER_DETAIL_SUCCESS: {
      return {
        ...state, 
        loading: false,
        orderDetail: action.payload
      }
    }

    default:
      return state
  }
}
export default reducer
