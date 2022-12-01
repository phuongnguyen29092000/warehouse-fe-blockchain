import * as types from './types'

const initialState = {
  products: [],
  loading: false,
  error: {},
  totalCount: 0,
  productDetail: {
    data: {},
    loading: false,
    error: {}
  },
  similarProduct: {},
  productsPerCompany: {
    data: [],
    totalCount: 0,
    loading: false
  }
}
export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case types.GET_PRODUCT: {
      return {
        ...state,
        loading: true
      }
    }
    case types.GET_PRODUCT_FAIL: {
      return {
        ...state,
        loading: false,
        products: [],
        totalCount: 0
      }
    }
    case types.GET_PRODUCT_SUCCESS: {
      const {products, count} = action?.payload?.data
      return {
        ...state,
        loading: false,
        products: products,
        totalCount: count
      }
    }

    case types.GET_PRODUCT_PER_COMPANY: {
      return {
        ...state,
        productsPerCompany: {
          ...state.productsPerCompany,
          loading: true
        }
      }
    }
    case types.GET_PRODUCT_PER_COMPANY_FAIL: {
      return {
        ...state,
        productsPerCompany: {
          ...state.productsPerCompany,
          data: [],
          loading: false
        }
      }
    }
    case types.GET_PRODUCT_PER_COMPANY_SUCCESS: {
      const {products, count} = action.payload.data
      return {
        ...state,
        productsPerCompany: {
          ...state.productsPerCompany,
          data: products,
          totalCount: count,
          loading: false
        }}
    }

    case types.GET_PRODUCT_SIMILAR: {
      return {
        ...state,
        loading: true
      }
    }
    case types.GET_PRODUCT_SIMILAR_FAIL: {
      return {
        ...state,
        loading: false,
        products: [],
        totalCount: 0
      }
    }
    case types.GET_PRODUCT_SIMILAR_SUCCESS: {
      const {products} = action.payload.data
      return {
        ...state,
        loading: false,
        similarProduct: products,
      }
    }
    case types.GET_PRODUCT_DETAIL: {
      return {
        ...state,
        productDetail: {
          ...state.productDetail,
          loading: true,
        }
      }
    }
    case types.GET_PRODUCT_DETAIL_FAIL: {
      return {
        ...state,
        productDetail: {
          ...state.productDetail,
          loading: false,
          error: 'error'
        }
      }
    }
    case types.GET_PRODUCT_DETAIL_SUCCESS: {
      return {
        ...state,
        productDetail: {
          ...state.productDetail,
          loading: false,
          data: action.payload
        }
      }
    }
    case types.CREATE_PRODUCT: {
      return {
        ...state,
        loading: true
      }
    }
    case types.CREATE_PRODUCT_FAIL: {
      return {
        ...state,
        loading: false
      }
    }
    case types.CREATE_PRODUCT_SUCCESS: {
      return {
        ...state,
        products: [...state.product, action.payload],
        loading: false
      }
    }

    case types.UPDATE_PRODUCT: {
      return {
        ...state,
        loading: true
      }
    }
    case types.UPDATE_PRODUCT_FAIL: {
      return {
        ...state,
        loading: false
      }
    }
    case types.UPDATE_PRODUCT_SUCCESS: {
      let listTemp = [...state?.products];
      let indexUpdate = listTemp?.map((item) => item._id).indexOf(action.payload.id);
      let result = listTemp?.splice(indexUpdate, 1, action.payload.data);
      return {
        ...state,
        product: listTemp,
        loading: false
      }
    }
    case types.DELETE_PRODUCT: {
      return {
        ...state,
        loading: true
      }
    }
    case types.DELETE_PRODUCT_FAIL: {
      return {
        ...state,
        loading: false,
        error: action.payload
      }
    }
    case types.DELETE_PRODUCT_SUCCESS: {
      let listTemp = [...state?.product];
      return {
        ...state,
        products: listTemp?.filter((item) =>item._id.toString() !== action.payload),
        loading: false,
      };
    }

    default:
      return state
  }
}
export default reducer
