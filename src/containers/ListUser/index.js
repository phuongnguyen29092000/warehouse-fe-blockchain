import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getAllUsers, setActive } from '../../redux/reducers/user/action'
import ConfirmModal from '../../components/modal/ConfirmModal/ConfirmModal'
import moment from 'moment';
import { FormControlLabel, FormGroup, InputAdornment, Switch, TextField } from '@mui/material';
import { setActiveUrl } from 'redux/reducers/activeUrl/action';
import AccountAvatar from '../../public/account.png'
import ConvertToImageURL from 'LogicResolve/ConvertToImageURL';
import UserAPI from '../../apis/UserAPI' 
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';


function ListOwnerAdmin({keySearch = ''}) {
    const dispatch = useDispatch();
    const [open, setOpen] = useState(false)
    const [openConfirmModal, setOpenConfirmModal] = useState(false)
    const [updateActiveUser, setUpdateActiveUser] = useState('')
    const  {listUsers} = useSelector((store) => store.user)
    const [listAll, setListAll] = useState([])
    const [search, setSearch] = useState('')
    const [isSearch, setIsSearch] = useState(false)

    useEffect(() => {
        document.title = 'Warehouse Protection | Quản lý công ty'
        dispatch(setActiveUrl('list-company'))
    },[])
    
    const handleClose = ()=>{
        setOpen(!open)
    }
    
    useEffect(() => {
        setListAll(listUsers?.users)
    },[listUsers?.users])

    useEffect(()=>{
        if(!listUsers?.users?.length) dispatch(getAllUsers())
    }, [])

    const handleChangeActive = () =>{
        dispatch(setActive(updateActiveUser,()=> setOpenConfirmModal(false)))
    }

    const handleSearchName = () => {
        if(!search) return 
        try {
            UserAPI.getUserBySearchKey(search).then((res)=> {
              if(res.status === 200){
                setListAll(res?.data?.users)
                setIsSearch(true)
              } else {
                setListAll([])
              }
            })
          } catch (error) {
            setListAll([])
            setIsSearch(true)
          }
    }
    
    return (
        <div className='admin-manager'>
            <div style={{ display: "flex", width: "100%", marginTop: 10, marginBottom: 20, alignItems: 'center'}} className='search-product-name'>
              <TextField 
                id="standard-basic" 
                label="Tên công ty" 
                variant="standard" 
                value={search}
                className={search && 'hidden-label'}
                InputProps={{
                  endAdornment: (
                    <InputAdornment>
                        <div onClick={handleSearchName}>
                          <SearchIcon sx={{cursor: 'pointer'}}/>
                        </div>
                    </InputAdornment>
                  )
                }}
                onChange={(e)=> {
                  setSearch(e.target.value)
                }}
                />
                {
                    isSearch && 
                    <div style={{display: 'flex', alignItems: 'center', borderRadius: 20, padding: '3px 10px', backgroundColor: 'gray', marginLeft: 20, marginTop: 10}}>
                        <span style={{color: '#fff'}}>{search}</span> 
                        <div onClick={()=> {
                            dispatch(getAllUsers())
                            setSearch('')
                            setIsSearch(false)
                        }}
                        style={{display: 'flex', alignItems: 'center', cursor:'pointer'}}
                        ><CloseIcon htmlColor='#fff' fontSize='small'/></div>
                    </div>
                }
            </div>
            <div className='admin-manager__list-user'>
                <table>
                    <thead>
                        <th className='th-2'>Ảnh đại diện</th>
                        <th className='th-2'>Tên công ty</th>
                        <th className='th-2'>Mã doanh nghiệp</th>
                        <th className='th-1'>Email</th>
                        <th className='th-1'>Điện thoại</th>
                        <th className='th-1'>Địa chỉ</th>
                        <th className='th-2'>Ngày tạo</th>
                        <th className='th-2'>Hoạt động</th>
                    </thead>
                    <tbody>
                        {
                            listAll &&
                            listAll?.map((user, index) =>(
                                <tr key={index} style={{borderBottom:'5px solid white'}}>
                                    <td className='td-2' style={{display:'flex', alignItems:'center', justifyContent:'center'}}>
                                        <img style={{width:'70px', height:'70px'}} 
                                            src={user?.photoUrl ? ConvertToImageURL(user?.photoUrl) : AccountAvatar} 
                                            alt=''
                                        />
                                    </td>
                                    <td className='td-1'>{user?.companyName}</td>
                                    <td className='td-1'>{user?.businessCode}</td>
                                    <td className='td-1'>{user?.email}</td>
                                    <td className='td-1'>{user?.phoneNumber || '0395360327'}</td>
                                    <td className='td-3'>{user?.address?.value || 'Quang Nam'}</td>
                                    <td className='td-2'>{moment(user?.createdAt).format('YYYY-MM-DD LTS')}</td>
                                    <td className='td-switch'>  
                                        <FormGroup>
                                            <FormControlLabel control={<Switch checked={user?.active} onChange={()=>{
                                                setOpenConfirmModal(!openConfirmModal)
                                                setUpdateActiveUser(user)
                                            }} />}
                                            />
                                        </FormGroup>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
            <ConfirmModal 
                handleAction={handleChangeActive} 
                content={`Bạn muốn ${updateActiveUser?.active ? 'ngừng' : 'thiết lập'} hoạt động công ty ${updateActiveUser?.companyName}?`} 
                setOpenConfirmModal = {setOpenConfirmModal}
                title= "Xác nhận"
                openConfirmModal={openConfirmModal}
            />
        </div>
    );
}

export default ListOwnerAdmin