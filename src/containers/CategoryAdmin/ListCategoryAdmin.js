import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { deleteCategory, getAllCategory } from "redux/reducers/category/action";
import EditIcon from '@mui/icons-material/Edit'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import PaginationCustom from "components/common/PaginationCustom";
import { Button } from "@mui/material";
import ConfirmModal from "components/modal/ConfirmModal/ConfirmModal";
import AddCategoryModal from "components/modal/addCategoryModal";
import { setActiveUrl } from "redux/reducers/activeUrl/action";

const ListCategoryAdmin = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { categories } = useSelector((store) => store.category);

    const [open, setOpen] = useState(false) 
    const [page, setPage] = useState(1)
    const [openUpdate, setOpenUpdate] = useState(false) 
    const [openConfirmModal, setOpenConfirmModal] = useState(false)
    const [categorytDelete, setCategorytDelete] = useState({})
    const [categorytUpdate, setCategorytUpdate] = useState({})

    useEffect(()=> {
        document.title = 'Warehouse Protection | Quản lý danh mục'
        dispatch(setActiveUrl('list-category'))
    }, [])

    useEffect(()=> {
        if(categories?.length) return 
        dispatch(getAllCategory())
    }, [])

    const handleDelete = () => {
        dispatch(deleteCategory(categorytDelete.id,(res)=>{
            setOpenConfirmModal(false)
            if(res === 204) {
                //
            }
        }))
    }

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
                        <th className='th-2'>Số danh mục con</th>
                        <th className='th-2'>Ngày tạo</th>
                        <th className='th-2'></th>
                    </thead>
                    <tbody>
                        {
                            categories && categories.map((_category, index) => (
                                <tr key={index}>
                                    <td>{_category.parent.name}</td>
                                    <td>{_category.parent.description}</td>
                                    <td>{_category?.childrens?.length}</td>
                                    <td>{new Date(_category?.parent?.createdAt?.slice(0, 10))?.toLocaleDateString("en-GB")}</td>
                                    <td>
                                        <div className='action-col'>
                                            <div className='btn-action btn-edit' onClick={()=>{
                                                setCategorytUpdate(_category.parent)
                                                setOpenUpdate(true)
                                            }}>
                                                <EditIcon fontSize='15px' />
                                            </div>
                                            <div className='btn-action btn-delete' onClick={()=>{
                                                setCategorytDelete({id: _category.parent._id, cateName: _category.parent.name, existChild: !!_category?.childrens?.length})
                                                setOpenConfirmModal(true)
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
            <AddCategoryModal open={open} handleClose={handleClose} action="THÊM DANH MỤC MỚI"/>
            <AddCategoryModal open={openUpdate} handleClose={handleCloseUpdate} category={categorytUpdate} action="CẬP NHẬT DANH MỤC"/>
            <ConfirmModal 
                handleAction={handleDelete} 
                content={`${categorytDelete?.existChild ? 'Tất cả danh mục con sẽ bị xóa .' : ''}Bạn có chắc chắn muốn xóa danh mục ${categorytDelete.cateName}`} 
                setOpenConfirmModal = {setOpenConfirmModal}
                title= "Xác nhận"
                openConfirmModal={openConfirmModal}
            />
        </div>
    );
}

export default ListCategoryAdmin