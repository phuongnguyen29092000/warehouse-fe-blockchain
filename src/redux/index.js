import { combineReducers } from "redux"
import category from "./reducers/category";
import product from "./reducers/product";
import user from './reducers/user'

const rootReducer = combineReducers({
    category,
    product,
    user
});

export default rootReducer; 