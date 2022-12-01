import Spinner from 'components/Spinner';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import Category from 'components/Category';
import { getAllProductByQueries } from 'redux/reducers/product/action';
import ProductResult from 'containers/ListCardProduct';
import FilterProduct from 'components/FilterProduct';
import { Divider, Drawer } from '@mui/material';
import CartDrawer from 'components/Cart/CartDrawer';
import {DEFAULT_PARAMS} from '../../utils/constant'

function HomePage() {
    const dispatch = useDispatch()
    const [queriesData, setQueriesData] = useState(DEFAULT_PARAMS)
    const [openDrawerCart, setOpenDrawerCart] = useState(false)
    const { products, totalCount, loading } = useSelector((store) => store.product)

    useEffect(()=> {
        dispatch(getAllProductByQueries(queriesData, (res)=> {  
            //
        }))
    }, [queriesData])

    console.log(queriesData);
    return (
        <div className='home-page' style={{
            background: '#f4f4f4',
            height: '100%',
            minHeight: 1500
        }}>
            <div className='home-page-container'>
                <div className='block-left'>
                    <FilterProduct queriesData={queriesData} setQueriesData={setQueriesData}/>
                    <Category queriesData={queriesData} setQueriesData={setQueriesData}/>
                </div>
                <div className='block-right'>
                    <ProductResult  
                        queriesData={queriesData} 
                        setQueriesData={setQueriesData} 
                        loading={loading}
                        dataResult={products}
                        totalCount={totalCount}
                        setOpenDrawerCart={setOpenDrawerCart}
                    />
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

export default HomePage;