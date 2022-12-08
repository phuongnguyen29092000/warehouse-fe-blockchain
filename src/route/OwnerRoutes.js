import React, { useEffect } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import OrderHistory from '../containers/OrderHistory';
import AccountOwner from '../containers/ManageAccount/AccountOwner';
import ListProductOwner from '../containers/ListProductOwner';
import WidthLayout from '../HOCS/widthLayout';
import { ROUTE_MANAGE_ACCOUNT_OWNER, ROUTE_WAREHOUSE_COMPANY, ROUTE_MANAGE_ORDER_HISTORY } from './type';
import { getUser } from 'hooks/localAuth';
import { setAccountInfo } from 'redux/reducers/user/action';
import { useDispatch } from 'react-redux';

function OwnerRoutes(props) {
    const dispatch = useDispatch()

    useEffect(() => {
        let account = getUser();
        if(account) dispatch(setAccountInfo(account))
    },[])

    return (
        <Routes>
            <Route
                path={ROUTE_WAREHOUSE_COMPANY}
                exact
                element={WidthLayout({
                    Component: ListProductOwner,
                    name: 'Quản lý sản phẩm',
                })}
            />
            <Route
                path={ROUTE_MANAGE_ORDER_HISTORY}
                exact
                element={WidthLayout({
                    Component: OrderHistory,
                    name: 'Quản lý xuất nhập kho',
                })}
            />
            <Route
                path={ROUTE_MANAGE_ACCOUNT_OWNER}
                exact
                element={WidthLayout({
                    Component: AccountOwner,
                    name: 'Quản lý tài khoản',
                })}
            />
        </Routes>
    );
}

export default OwnerRoutes;