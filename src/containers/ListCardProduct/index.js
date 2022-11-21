// import CarouselInstroduce from 'components/Carousel/CarouselInstroduce';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { setActiveUrl } from 'redux/reducers/activeUrl/action';
import ListCard from '../../components/ListCard';
import SpinnerLoading from '../../components/Spinner';

const ProductResult = ({queriesData, setQueriesData, setOpenDrawerCart}) => {
    const dispatch = useDispatch()
    const { products, loading } = useSelector((store) => store.product)
    // const { search } = useLocation();
    const [dataResult, setDataResult] = useState([])
    // let searchParagram = new URLSearchParams(search);
    // useEffect(() => {
    //     let param = {}
    //     for (const [key, value] of searchParagram.entries()) {
    //         param[key] = value
    //     }

    //     if(Object.keys(param).length > 1){
    //         dispatch(filterTour(param,(data) => setDataResult(data)))
    //     }else{
    //         ListTourAPI.searchTour(param)
    //             .then((rs) => {
    //                 if (rs.status === 200) {
    //                     setDataResult(rs.data.data)
    //                 } else {
    //                     setDataResult([])
    //                 }
    //             }).catch((error) => {
    //                 setDataResult([])
    //             })
    //     }
    // }, [search])
    
    useEffect(() => {
        setDataResult(products)
    }, [products])

    useEffect(() => {
        document.title = 'Kết quả'
        // dispatch(setActiveUrl(''))
    }, [])

    return (
        <div className='tour-list tour-result'>
            {
                !loading ?
                    <>
                        {/* <CarouselInstroduce /> */}
                        {/* <FilterTour /> */}
                        {
                            dataResult?.length > 0 ?
                                <ListCard data={dataResult} queriesData={queriesData} setQueriesData={setQueriesData} setOpenDrawerCart={setOpenDrawerCart}/>
                                :
                                <h3 className='title-not-found'>Không tìm thấy sản phẩm phù hợp</h3>
                        }
                    </>
                    : <SpinnerLoading />
            }
        </div>
    );
};

export default ProductResult;
