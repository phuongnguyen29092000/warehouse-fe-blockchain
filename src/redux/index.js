import { combineReducers } from "redux"
import category from "./reducers/category";
import product from "./reducers/product";
import user from './reducers/user'
import order from "./reducers/order";

const rootReducer = combineReducers({
    category,
    product,
    user,
    order
});

export default rootReducer; 