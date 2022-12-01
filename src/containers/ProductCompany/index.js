import Spinner from 'components/Spinner';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import Category from 'components/Category';
import { getAllProductPerCompany } from 'redux/reducers/product/action';
import ProductResult from 'containers/ListCardProduct';
import FilterProduct from 'components/FilterProduct';
import { Divider, Drawer } from '@mui/material';
import CartDrawer from 'components/Cart/CartDrawer';
import {DEFAULT_PARAMS} from '../../utils/constant'
import CompanyInfomation from 'components/CompanyInfomation';
import { useNavigate, useParams } from 'react-router-dom';
import UserAPI from '../../apis/UserAPI'

function ProductCompany() {
    const [loading, setLoading] = useState(false)
    const {id} = useParams()
    const [queriesData, setQueriesData] = useState(DEFAULT_PARAMS)
    const [openDrawerCart, setOpenDrawerCart] = useState(false)
    const dispatch = useDispatch()
	const { account } = useSelector((store)=> store.user)
    const { productsPerCompany } = useSelector((store) => store.product)
    const [companyInfo, setCompanyInfo] = useState({})

    useEffect(()=> {
        const fetchCompany = async(id) => {
            await UserAPI.getUserById(id).then((res)=> {
                setCompanyInfo({...res.data.user})
            })
        }
        fetchCompany(id)
    }, [])

    useEffect(()=> {
        dispatch(getAllProductPerCompany(
            id,
            queriesData, 
            (res)=> {
            // if(res) {
            //     setData(res?.products)
            //     setTotalCount(res?.count)
            // }
        }))
    }, [queriesData])

    return (
        <div className='home-page' style={{
            background: '#f4f4f4',
            height: '100%',
        }}>
            <div className='product-company-container'>
                <CompanyInfomation info={
                    companyInfo
                }/>
                <div className='home-page-container'>
                    <div className='block-left'>
                        <FilterProduct queriesData={queriesData} setQueriesData={setQueriesData}/>
                        <Category queriesData={queriesData} setQueriesData={setQueriesData}/>
                    </div>
                    <div className='block-right'>
                        <ProductResult 
                            queriesData={queriesData} 
                            setQueriesData={setQueriesData} 
                            loading={productsPerCompany.loading}
                            dataResult={productsPerCompany?.data}
                            totalCount={productsPerCompany?.totalCount}
                            setOpenDrawerCart={setOpenDrawerCart}/>
                    </div>
                </div>
            </div>
        <Drawer
            anchor='right'
            open={openDrawerCart}
            onClose={() => setOpenDrawerCart(false)}
        >
            <CartDrawer onClose={() => setOpenDrawerCart(false)} />
        </Drawer>
        </div>
    );
}

export default ProductCompany;