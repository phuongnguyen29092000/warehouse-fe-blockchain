import React, { useEffect } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import AccountAdmin from '../containers/ManageAccount/AccountAdmin';
import ListCategoryAdmin from 'containers/CategoryAdmin/ListCategoryAdmin';
import ListSubCategoryAdmin from 'containers/CategoryAdmin/ListSubCategoryAdmin';
import ListUser from 'containers/ListUser';
import WidthLayout from '../HOCS/widthLayout';
import { ROUTE_MANAGE_CATEGORY, ROUTE_MANAGE_ACCOUNT_ADMIN, ROUTE_MANAGE_SUB_CATEGORY, ROUTE_MANAGE_OWNER } from './type';
import { getUser } from 'hooks/localAuth';
import { setAccountInfo } from 'redux/reducers/user/action';
import { useDispatch } from 'react-redux';

function AdminRoutes(props) {
    return (
        <Routes>
            <Route
                path={ROUTE_MANAGE_OWNER}
                exact
                element={WidthLayout({
                    Component: ListUser,
                    name: 'QUẢN LÝ DOANH NGHIỆP/CÔNG TY',
                })}
            />
            <Route
                path={ROUTE_MANAGE_CATEGORY}
                exact
                element={WidthLayout({
                    Component: ListCategoryAdmin,
                    name: 'QUẢN LÝ DANH MỤC',
                })}
            />
            <Route
                path={ROUTE_MANAGE_SUB_CATEGORY}
                exact
                element={WidthLayout({
                    Component: ListSubCategoryAdmin,
                    name: 'QUẢN LÝ DANH MỤC CON',
                })}
            />
            <Route
                path={ROUTE_MANAGE_ACCOUNT_ADMIN}
                exact
                element={WidthLayout({
                    Component: AccountAdmin,
                    name: 'QUẢN LÝ TÀI KHOẢN',
                })}
            />
        </Routes>
    );
}

export default AdminRoutes