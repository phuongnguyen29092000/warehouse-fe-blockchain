import * as types from './types'

const initialState = {
  feedbacks: [],
  loading: false,
  newFb: {},
}
export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case types.GET_FEEDBACK: {
      return {
        ...state,
        loading: true
      }
    }
    case types.GET_FEEDBACK_FAIL: {
      return {
        ...state,
        loading: false
      }
    }
    case types.GET_FEEDBACK_SUCCESS: {
      return {
        ...state,
        loading: false,
        feedbacks: action.payload
      }
    }

    case types.CREATE_FEEDBACK: {
      return {
        ...state,
        loading: true,
      }
    }
    case types.CREATE_FEEDBACK_FAIL: {
      return {
        ...state,
        loading: false,
      }
    }
    case types.CREATE_FEEDBACK_SUCCESS: {
      return {
        ...state,
        loading: false,
        newFb: {...action.payload}
      }
    }

    default:
      return state
  }
}
export default reducer
