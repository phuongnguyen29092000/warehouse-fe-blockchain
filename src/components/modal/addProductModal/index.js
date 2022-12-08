import { Box, Button, Modal } from '@mui/material';
import React, { useEffect, useState } from 'react';
import ProductForm from './ProductForm';
import {useDispatch, useSelector} from 'react-redux'
import { format } from 'date-fns';
import { addProduct } from 'redux/reducers/product/action';

const AddProductModal = ({ open, handleClose, product, action }) => {
    const dispatch = useDispatch()
    const [submit, setSubmit] = useState(false) 
    const {productsPerCompany} = useSelector((store)=>store.product)

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 1100,
        bgcolor: 'background.paper',
        boxShadow: 24,
        overflow: 'hidden',
        borderRadius:'5px',
    };

    const handleAddProduct = (data)=>{
        dispatch(addProduct(data, handleClose))
    }

    const handleUpdateProduct = (id,data)=> {
        // dispatch(updateProduct(id, data, handleClose))
    }
    return (
        <div className='add-tour-modal'>
            <Modal
                open={open}
                onClose={handleClose}

            >
                <Box sx={style}>
                    <div className='modal-header'>
                        <div className='modal-title'>
                            <h3>{action}</h3>
                        </div>
                    </div>
                    <div className='modal-body'>
                        <ProductForm handleAddProduct={handleAddProduct} handleUpdateProduct={handleUpdateProduct} submit={submit} setSubmit={setSubmit} product={product}/>
                    </div>
                    <div className='modal-footer'>
                        <div className='btn-footer'>
                            <Button variant="contained" className='btn-footer__action btn-add' onClick={()=>setSubmit(true)}>Lưu</Button>
                            <Button variant="contained" className='btn-footer__action btn-cancel' onClick={() => handleClose(false)}>Hủy</Button>
                        </div>
                    </div>
                </Box>
            </Modal>
        </div>
    );
};

export default AddProductModal;