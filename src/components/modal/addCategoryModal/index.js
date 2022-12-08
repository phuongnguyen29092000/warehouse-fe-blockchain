import { Box, Button, Modal } from '@mui/material';
import React, { useEffect, useState } from 'react';
import CategoryForm from './CategoryForm';
import {useDispatch, useSelector} from 'react-redux'
import { format } from 'date-fns';
import { addProduct } from 'redux/reducers/product/action';
import { createCategory, createSubCategory, updateCategory, updateSubCategory } from 'redux/reducers/category/action';

const AddCategoryModal = ({ open, handleClose, category, action, isSub = false }) => {
    const dispatch = useDispatch()
    const [submit, setSubmit] = useState(false)

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 700,
        bgcolor: 'background.paper',
        boxShadow: 24,
        overflow: 'hidden',
        borderRadius:'5px',
    };

    const handleAddCategory = (data)=>{
        if(isSub) {
            dispatch(createSubCategory(data))
        } else 
        dispatch(createCategory(data, handleClose))
    }

    const handleUpdateCategory = (id, data)=>{
        if(isSub) {
            dispatch(updateSubCategory(id, data, handleClose))
        }
        else dispatch(updateCategory(id, data, handleClose))
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
                        <CategoryForm handleAddCategory={handleAddCategory} handleUpdateCategory={handleUpdateCategory} submit={submit} isSub={isSub} setSubmit={setSubmit} category={category}/>
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

export default AddCategoryModal;