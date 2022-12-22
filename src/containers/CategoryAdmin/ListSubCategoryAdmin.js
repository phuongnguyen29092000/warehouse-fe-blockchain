

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getAllCategory } from "redux/reducers/category/action";
import EditIcon from '@mui/icons-material/Edit'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import PaginationCustom from "components/common/PaginationCustom";
import { Button } from "@mui/material";
import ConfirmModal from "components/modal/ConfirmModal/ConfirmModal";
import AddCategoryModal from "components/modal/addCategoryModal";
import { previousDay } from "date-fns";
import { setActiveUrl } from "redux/reducers/activeUrl/action";

const ListSubCategoryAdmin = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { categories } = useSelector((store) => store.category);

    const [open, setOpen] = useState(false) 
    const [page, setPage] = useState(1)
    const [openUpdate, setOpenUpdate] = useState(false) 
    const [categorytDelete, setCategorytDelete] = useState({})
    const [categorytUpdate, setCategorytUpdate] = useState({})
    const [data, setData] = useState([])

    useEffect(()=> {
        document.title = 'Warehouse Protection | Quản lý danh mục con'
        dispatch(setActiveUrl('list-subcategory'))
    }, [])

    useEffect(()=> {
        dispatch(getAllCategory((res)=> {
            res?.map((cate)=> {
                console.log(cate);
                return setData((prev)=> {
                    const temp = [...cate?.childrens]
                    return [...prev, ...temp]
                })
            })
        }))
    }, [])

    console.log({data});
    const handleClose = () => {
        setOpen(!open);
    }
    const handleCloseUpdate = () => {
        setOpenUpdate(!openUpdate);
    }

    return (
        <div className='user-manager'>
            <div className='user-manager__category' style={{display: 'flex', marginBottom: 20}}>
                <div className='btn-add'>
                    <Button variant="contained" className='btn-add-product' onClick={() => setOpen(true)}>Thêm danh mục</Button>
                </div>
            </div>
            <div className='user-manager__listproduct'>
                <table>
                    <thead>
                        <th className='th-1'>Tên danh mục</th>
                        <th className='th-2'>Mô tả</th>
                        <th className='th-2'>Danh mục cha</th>
                        <th className='th-2'>Ngày tạo</th>
                        <th className='th-2'></th>
                    </thead>
                    <tbody>
                        {
                            data && data.map((_category, index) => (
                                <tr key={index}>
                                    <td>{_category.name}</td>
                                    <td>{_category.description}</td>
                                    <td>{_category?.category?.name}</td>
                                    <td>{new Date(_category?.createdAt?.slice(0, 10))?.toLocaleDateString("en-GB")}</td>
                                    <td>
                                        <div className='action-col'>
                                            <div className='btn-action btn-edit' onClick={()=>{
                                                setCategorytUpdate(_category)
                                                setOpenUpdate(true)
                                            }}>
                                                <EditIcon fontSize='15px' />
                                            </div>
                                            <div className='btn-action btn-delete' onClick={()=>{
                                                        // setProductDelete({id: _product._id, productName: _product.productName})
                                                        // setOpenConfirmModal(true)
                                            }}>
                                                <DeleteOutlineIcon fontSize='15px' />
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table> 
                   
            </div>
            <AddCategoryModal open={open} handleClose={handleClose} isSub={true} action="THÊM DANH MỤC MỚI"/>
            <AddCategoryModal open={openUpdate} handleClose={handleCloseUpdate} category={categorytUpdate} isSub={true} action="CẬP NHẬT DANH MỤC"/>
        </div>
    );
}

export default ListSubCategoryAdmin