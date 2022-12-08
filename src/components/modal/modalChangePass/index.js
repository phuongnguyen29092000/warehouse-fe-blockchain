import { Box, Button, Modal } from '@mui/material';
import React, { useEffect, useState } from 'react';
import {useDispatch, useSelector} from 'react-redux'
import { addProduct } from 'redux/reducers/product/action';
import { createCategory, createSubCategory, updateCategory, updateSubCategory } from 'redux/reducers/category/action';
import ChangePassForm from './ChangePassForm';
import { changePassword } from 'redux/reducers/user/action';

const ChangePassModal = ({ open, handleClose, info, action}) => {
    const dispatch = useDispatch()
    const [submit, setSubmit] = useState(false)

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 600,
        bgcolor: 'background.paper',
        boxShadow: 24,
        overflow: 'hidden',
        borderRadius:'5px',
    };

    const handleChangePass = (data)=>{
        dispatch(changePassword(data, handleClose))
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
                        <ChangePassForm handleChangePass={handleChangePass} submit={submit} setSubmit={setSubmit} info={info}/>
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

export default ChangePassModal;