import React from 'react';
import { 
    ROUTE_WAREHOUSE_COMPANY,
    ROUTE_MANAGE_ACCOUNT_OWNER,
    ROUTE_MANAGE_ORDER_HISTORY,
    ROUTE_MANAGE_ACCOUNT_ADMIN,
    ROUTE_MANAGE_SUB_CATEGORY,
    ROUTE_MANAGE_OWNER,
    ROUTE_MANAGE_CATEGORY
 } from '../../route/type';
import Logo from '../../public/logoWarehouse.jpg'
import { Link, useNavigate } from 'react-router-dom';
import { Menu, MenuItem, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import {IconCustomer} from '../Icons'
import DescriptionIcon from '@mui/icons-material/Description';
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import CompanyIcon from '@mui/icons-material/SupervisedUserCircle';
import CategoryIcon from '@mui/icons-material/Category';
import SubCategoryIcon from '@mui/icons-material/MenuOpen';

function SideBar(props) {
    const dispatch = useDispatch()
    const navigate = useNavigate()
   
    const {activePage} = useSelector(store => store.activeUrl)

    const { accountUser } = useSelector((store) => store.user)
    return (
        <div className='sidebar-section'>
            <div className='sidebar-wrapper'>
                <div className='logo'>
                    <img src={Logo} />
                </div>                                                            
                {
                    accountUser.role == "user" && (
                        <div className='menu-list-item' style={{background: '#5584AC'}}>
                            <Link to={ROUTE_WAREHOUSE_COMPANY}>
                                <div className={`menu-item list-product-owner ${activePage === 'list-product' ? 'active' : ''}`}>
                                    <div className='menu-item__icon'>
                                        <ShoppingBasketIcon htmlColor='#fff' fontSize='large'/>
                                        <div className='menu-item__title'>
                                            SẢN PHẨM
                                        </div>
                                    </div>
                                </div>
                            </Link>
                            <Link to={ROUTE_MANAGE_ORDER_HISTORY}>
                                <div className={`menu-item order-history ${activePage === 'order-history' ? 'active' : ''}`} >
                                    <div className='menu-item__icon'>
                                        <DescriptionIcon htmlColor='#fff' fontSize='large'/>
                                        <div className='menu-item__title'>
                                            ĐƠN HÀNG
                                        </div>
                                    </div>
                                </div>
                            </Link>
                            <Link to={ROUTE_MANAGE_ACCOUNT_OWNER}>
                                <div className={`menu-item account-user ${activePage === 'account-user' ? 'active' : ''}`}>
                                    <div className='menu-item__icon'>
                                        <IconCustomer htmlColor='#fff' fontSize='large'/>
                                        <div className='menu-item__title'>
                                            TÀI KHOẢN
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    )
                }
                {
                    accountUser.role == "admin" && (
                        <div className='menu-list-item' style={{background: '#5584AC'}}>
                            <Link to={ROUTE_MANAGE_OWNER}>
                                <div className={`menu-item company`}>
                                    <div className='menu-item__icon'>
                                        <CompanyIcon htmlColor='#fff' fontSize='large'/>
                                        <div className='menu-item__title'>
                                            CÔNG TY
                                        </div>
                                    </div>
                                </div>
                            </Link>
                            <Link to={ROUTE_MANAGE_CATEGORY}>
                                <div className={`menu-item list-customer }`}>
                                    <div className='menu-item__icon'>
                                        <CategoryIcon htmlColor='#fff' fontSize='large'/>
                                        <div className='menu-item__title'>
                                            DANH MỤC
                                        </div>
                                    </div>
                                </div>
                            </Link>
                            <Link to={ROUTE_MANAGE_SUB_CATEGORY}>
                                <div className={`menu-item typeplace `}>
                                    <div className='menu-item__icon'>
                                        <SubCategoryIcon htmlColor='#fff' fontSize='large'/>
                                        <div className='menu-item__title'>
                                            DANH MỤC CON
                                        </div>
                                    </div>
                                </div>
                            </Link>
                            <Link to={ROUTE_MANAGE_ACCOUNT_ADMIN}>
                                <div className={`menu-item typeplace`}>
                                    <div className='menu-item__icon'>
                                        <IconCustomer htmlColor='#fff' fontSize='large'/>
                                        <div className='menu-item__title'>
                                            TÀI KHOẢN
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    )
                }
                </div>
            </div>
        // </div>
    );
}

export default SideBar;