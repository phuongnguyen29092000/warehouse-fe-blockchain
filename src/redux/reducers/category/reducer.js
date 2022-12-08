import * as types from './types'

const initialState = {
  categories: [],
  loading: false,
  error: {}
}
export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case types.GET_CATEGORY: {
      return {
        ...state,
        loading: true
      }
    }
    case types.GET_CATEGORY_FAIL: {
      return {
        ...state,
        loading: false
      }
    }
    case types.GET_CATEGORY_SUCCESS: {
      return {
        ...state,
        loading: false,
        categories: action.payload,
      }
    }
    case types.CREATE_CATEGORY: {
      return {
        ...state,
        loading: true
      }
    }
    case types.CREATE_CATEGORY_FAIL: {
      return {
        ...state,
        loading: false
      }
    }
    case types.CREATE_CATEGORY_SUCCESS: {
      return {
        ...state,
        categories: [...state.categories, action.payload],
        loading: false
      }
    }

    case types.UPDATE_CATEGORY: {
      return {
        ...state,
        loading: true
      }
    }
    case types.UPDATE_CATEGORY_FAIL: {
      return {
        ...state,
        loading: false
      }
    }
    case types.UPDATE_CATEGORY_SUCCESS: {
      let listTemp = [...state?.categories];
      let indexUpdate = listTemp?.map((item) => item._id).indexOf(action.payload.id);
      let result = listTemp?.splice(indexUpdate, 1, action.payload.data);
      return {
        ...state,
        categories: listTemp,
        loading: false
      }
    }

    default:
      return state
  }
}
export default reducer
