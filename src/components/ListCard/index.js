import { Box, Container, Divider, Grid, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import ProductCard from '../Cards/ProductCard';
import PaginationCustom from '../common/PaginationCustom';
import ConvertToImageURL from '../../LogicResolve/ConvertToImageURL';
import { useDispatch, useSelector } from 'react-redux';
// import { getAllNews } from 'redux/reducers/news/action';
import { Link } from 'react-router-dom';

const ListCard = ({ data, queriesData, setQueriesData, totalCount, setOpenDrawerCart}) => {
    const handleOnChange = (e, value) => {
        setQueriesData({...queriesData, skip: value})
    }
    useEffect(() => {
        window.scrollTo(0, 0)
    })
    return (
        <div className='list-card-tour'>
            {data &&
                <React.Fragment>
                    <Container maxWidth="xl">
                        <Box sx={{ flexGrow: 1, marginTop: '30px' }}>
                            <Grid container spacing={1}>
                                <Grid container item xs={12} md={12} spacing={2}>
                                    {
                                        data.map((product, index) => (
                                            <Grid item key={index} xl={3} lg={4} md={4} xs={12} sm={6}>
                                                <ProductCard
                                                    _id={product._id}
                                                    productName={product.productName}
                                                    description={product.description}
                                                    companyName={product?.user?.companyName}
                                                    imageUrl={ConvertToImageURL(product.imageUrl)}
                                                    price={product.price}
                                                    active={product?.user?.active}
                                                    dateOfInventory={product.dateOfInventory}
                                                    minimumQuantity={product.minimumQuantity}
                                                    manufacturer={product.manufacturer.companyName}
                                                    discount={product?.discount}
                                                    setOpenDrawerCart={setOpenDrawerCart}
                                                    dataDetail={product}
                                                />
                                            </Grid>
                                        ))
                                    }
                                    <PaginationCustom total={totalCount} limit={queriesData?.limit} page={queriesData?.skip} onChange={handleOnChange} />   
                                </Grid>
                            </Grid>
                        </Box>
                    </Container>
                </React.Fragment>
            }
        </div>
    );
};

export default ListCard;