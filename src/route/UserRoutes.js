import React, { useEffect } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import userLayout from '../HOCS/userLayout';
import {ROUTE_HOME, ROUTE_LOGIN, ROUTE_SIGNUP ,ROUTE_PRODUCT_DETAIL, ROUTE_CART, ROUTE_MY_WAREHOUSE, ROUTE_RESET_PASSWORD, ROUTE_CONTACT} from './type';
import { useDispatch } from 'react-redux';
import SignIn from 'containers/SignIn';
import HomePage from 'pages/HomePage';
import ResetPassword from 'pages/ResetPassword';
import SignUp from 'containers/SignUp';
import ProductDetail from 'containers/ProductDetail';
import CartPage from 'pages/CartPage';
import Contact from 'pages/Contact';
import ProductCompany from 'containers/ProductCompany';

function UserRoutes(props) {
    const navigate = useNavigate()
    // useEffect(() => {
    //     let account = getUser();
    //     if(account) dispatch(setAccountInfo(account, () => {
    //       if(account.role === 'admin') navigate('/admin/owner')
    //     }))
    //     else navigate('/')
    //   },[])
    return (
        <Routes>
            <Route
                path={ROUTE_HOME}
                exact
                element={userLayout({
                    Component: HomePage,
                })}
            />
            <Route
                path={ROUTE_LOGIN}
                exact
                element={userLayout({
                    Component: SignIn,
                })}
            />
            <Route
                path={ROUTE_SIGNUP}
                exact
                element={userLayout({
                    Component: SignUp,
                })}
            />
            <Route
                path={ROUTE_RESET_PASSWORD}
                exact
                element={userLayout({
                    Component: ResetPassword
                })}
            />
            <Route
                path={ROUTE_CONTACT}
                exact
                element={userLayout({
                    Component: Contact
                })}
            />
            <Route
                path={ROUTE_PRODUCT_DETAIL}
                exact
                element={userLayout({
                    Component: ProductDetail,
                })}
            />
            <Route
                path={ROUTE_CART}
                exact
                element={userLayout({
                    Component: CartPage,
                })}
            />
            <Route
                path={ROUTE_MY_WAREHOUSE}
                exact
                element={userLayout({
                    Component: ProductCompany,
                })}
            />
        </Routes>
    );
}

export default UserRoutes;