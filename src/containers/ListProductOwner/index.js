import { Button, Checkbox, Grid } from "@mui/material"
import PaginationCustom from "components/common/PaginationCustom"
import RegardPrice from "LogicResolve/RegardPrice"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { setActiveUrl } from "redux/reducers/activeUrl/action"
import { deleteProduct, getAllProductPerCompany, updateProduct } from "redux/reducers/product/action"
import EditIcon from '@mui/icons-material/Edit'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import {DEFAULT_PARAMS} from 'utils/constant'
import AddProductModal from "components/modal/addProductModal"
import ConfirmModal from "components/modal/ConfirmModal/ConfirmModal"
import { getUser } from "hooks/localAuth"
import ProductCard from "components/Cards/ProductCard"
import { isEmpty } from "lodash"
import ConvertToImageURL from "LogicResolve/ConvertToImageURL"
import TableViewIcon from '@mui/icons-material/TableView';
import GridViewIcon from '@mui/icons-material/GridView';
import FilterProduct from "components/FilterProduct"
import Spinner from "components/Spinner"
import Collapse from 'react-collapse';
import moment from "moment"

const ListProductOwner = () => {
    const dispatch = useDispatch()
    const [queriesData, setQueriesData] = useState(DEFAULT_PARAMS)
    const {productsPerCompany} = useSelector((store)=> store.product)
    const [open, setOpen] = useState(false) 
    const [openUpdate, setOpenUpdate] = useState(false) 
    const [openConfirmModal, setOpenConfirmModal] = useState(false)
    const [productDelete, setProductDelete] = useState({})
    const [productUpdate, setProductUpdate] = useState({})
    const [page, setPage] = useState(1)
    const [viewType, setViewType] = useState()
    const [expandSearch, setExpandSearch] = useState(false)

    useEffect(()=> {
        document.title = 'Warehouse Protection | Sản phẩm'
        setViewType('table')
        dispatch(setActiveUrl('list-product'))
    }, [])

    useEffect(()=> {
        const account = getUser()
        dispatch(getAllProductPerCompany(
            account?._id,
            queriesData, 
           ))
    }, [queriesData])

    const handleDelete = () => {
        dispatch(deleteProduct(productDelete.id,()=>setOpenConfirmModal(false)))
    }
    
    const handleClose = () => {
        setOpen(!open);
    }
    const handleCloseUpdate = () => {
        setOpenUpdate(!openUpdate);
    }

    const handleOnChange = (e, value) => {
        setQueriesData({...queriesData, skip: value})
        setPage(value)
    }

    return (
        <div className='user-manager'>
             {/* <div>
                <div style={{display: 'flex', justifyContent: 'right', position: 'relative', marginBottom: 15}}>
                    <h3 style={{marginTop: 30, marginRight: 80, color: '#5584ac'}}>Lọc</h3>
                    <div className="action-collapse" onClick={()=> setExpandSearch(!expandSearch)}>
                    {
                        expandSearch ? <RemoveIcon htmlColor='#fff'/> : <AddIcon htmlColor='#fff'/>
                    }
                </div>
                </div>
                <Collapse isOpened={expandSearch}>
                    <FilterProduct queriesData={queriesData} setQueriesData={setQueriesData} manage={true}/>            
                </Collapse>
            </div> */}
            <div className='user-manager__product'>
                <div className='btn-add'>
                    <Button variant="contained" className='btn-add-product' onClick={() => setOpen(true)}>Thêm sản phẩm</Button>
                </div>
                <div className="user-manager__product-view">
                    <div className={`view-item ${viewType !== 'table' ? 'bg-white' : ''}`}
                        onClick={()=> setViewType('table')}
                    >
                        <TableViewIcon htmlColor="#292929"/>
                    </div>
                    <div className={`view-item ${viewType !== 'grid' ? 'bg-white' : ''}`} style={{marginLeft: 10}}
                        onClick={()=> setViewType('grid')}
                    >
                        <GridViewIcon  htmlColor="#292929"/>
                    </div>
                </div>
            </div>
           
            {
                productsPerCompany?.loading ? <Spinner />
                :
                <div className='user-manager__listproduct'>
                    {
                        viewType === 'table' ? 
                        <table>
                            <thead>
                                <th className='th-1'>Tên sản phẩm</th>
                                <th className='th-2'>Số lượng còn</th>
                                <th className='th-2'>Giá</th>
                                <th className='th-2'>Đang bán</th>
                                <th className='th-2'>Ngày sản xuất</th>
                                <th className='th-2'>Thời hạn bảo hành</th>
                                <th className='th-2'>Đơn hàng nhỏ nhất</th>
                                <th className='th-2'></th>
                            </thead>
                            <tbody>
                                {
                                    productsPerCompany?.data && productsPerCompany?.data.map((_product, index) => (
                                        <tr key={index}>
                                            <td>{_product.productName}</td>
                                            <td>{_product.amount}</td>
                                            <td>{RegardPrice(_product.price)}</td>
                                            <td style={{display: 'flex', justifyContent: 'center'}}><Checkbox
                                                id="discountCheck"
                                                name="discountCheck"
                                                onChange={(e) => {
                                                    dispatch(updateProduct(_product._id, {..._product, isSelling: !_product?.isSelling}))
                                                }}
                                                checked={_product?.isSelling}
                                                style={{ padding: 0, paddingLeft: 5}}
                                                />
                                            </td>
                                            <td>{moment(_product?.dateOfInventory).format('YYYY-MM-DD LTS')}</td>
                                            <td>{moment(_product?.warrantyPeriot).format('YYYY-MM-DD LTS')}</td>
                                            <td>{_product.minimumQuantity}</td>
                                            <td>
                                                <div className='action-col'>
                                                    <div className='btn-action btn-edit' onClick={()=>{
                                                        setProductUpdate(_product)
                                                        setOpenUpdate(true)
                                                    }}>
                                                        <EditIcon fontSize='15px' />
                                                    </div>
                                                    <div className='btn-action btn-delete' onClick={()=>{
                                                        setProductDelete({id: _product._id, productName: _product.productName})
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
                        </table> : 
                        <Grid container spacing={1}>
                            <Grid container item xs={12} md={12} spacing={2}>
                            {
                                !isEmpty(productsPerCompany?.data) && productsPerCompany?.data.map((product, index) => (
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
                                            dataDetail={product}
                                            manage={true}
                                            handleEdit={()=> {
                                                setProductUpdate(product)
                                                setOpenUpdate(true)
                                            }}
                                            handleDelete={()=> {
                                                setProductDelete({id: product._id, productName: product.productName})
                                                setOpenConfirmModal(true)
                                            }}
                                        />
                                    </Grid>
                                ))
                            }
                        </Grid>
                    </Grid>
                    }
                    <PaginationCustom total={productsPerCompany.totalCount} limit={10} page={page} onChange={handleOnChange} />
                </div>
            }
            <AddProductModal open={open} handleClose={handleClose} action="THÊM SẢN PHẨM MỚI"/>
            <AddProductModal open={openUpdate} handleClose={handleCloseUpdate} product={productUpdate} action="CẬP NHẬT SẢN PHẨM"/>
            <ConfirmModal 
                handleAction={handleDelete} 
                content={`Bạn muốn xóa sản phẩm ${productDelete.productName}`} 
                setOpenConfirmModal = {setOpenConfirmModal}
                title= "Xác nhận"
                openConfirmModal={openConfirmModal}
            />
        </div>
    );
}

export default ListProductOwner