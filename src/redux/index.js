import { combineReducers } from "redux"
import category from "./reducers/category";
import product from "./reducers/product";
import user from './reducers/user'
import order from "./reducers/order";
import feedback from "./reducers/feedback";
import activeUrl from "./reducers/activeUrl";

const rootReducer = combineReducers({
    category,
    product,
    user,
    order,
    activeUrl,
    feedback
});

export default rootReducer; 