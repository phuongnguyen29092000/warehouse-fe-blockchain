import { combineReducers } from "redux"
import category from "./reducers/category";
import product from "./reducers/product";

const rootReducer = combineReducers({
    category,
    product
});

export default rootReducer; 