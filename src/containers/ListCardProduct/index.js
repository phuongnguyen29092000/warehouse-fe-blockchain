// import CarouselInstroduce from 'components/Carousel/CarouselInstroduce';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { setActiveUrl } from 'redux/reducers/activeUrl/action';
import ListCard from '../../components/ListCard';
import SpinnerLoading from '../../components/Spinner';
import EmptyProductIcon from '../../public/empty-product.jpg'

const ProductResult = ({queriesData, setQueriesData, dataResult, loading, totalCount, setOpenDrawerCart}) => {
    const dispatch = useDispatch()
    useEffect(() => {
        document.title = 'Warehouse Protection'
        dispatch(setActiveUrl(''))
    }, [])

    return (
        <div>
            {
                !loading ?
                    <>
                        {
                            dataResult?.length > 0 ?
                                <ListCard data={dataResult} queriesData={queriesData} setQueriesData={setQueriesData} setOpenDrawerCart={setOpenDrawerCart} totalCount={totalCount}/>
                                :
                                <div className='empty-product'>
                                    <h2 className='title-not-found'>Không tìm thấy sản phẩm phù hợp</h2>
                                    <img src={EmptyProductIcon} alt=''/>
                                </div>
                        }
                    </>
                    : <SpinnerLoading />
            }
        </div>
    );
};

export default ProductResult;
