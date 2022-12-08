import SearchIcon from '@mui/icons-material/Search';
import { FormControl, InputAdornment, Menu, MenuItem, OutlinedInput, Typography } from '@mui/material';
import { debounce } from 'lodash';
import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PersonIcon from '@mui/icons-material/Person';
import { useNavigate } from 'react-router-dom';
import { logout } from 'redux/reducers/user/action';
import ConvertToImageURL from 'LogicResolve/ConvertToImageURL';

const CommonHeader = ({
    keySearch,
    setKeySearch,
    name,
    isSearch
}) => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const {accountUser} = useSelector((store)=> store.user)
    const [searchValue, setSearchValue] = useState('')
    const [anchorElUser, setAnchorElUser] = React.useState(null);
    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };
    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };
    const onChange =  useCallback(debounce((value) => {
        setKeySearch(value)
    },500),)
    
    return (
        <div className='common-header'>
            <div className='page-name'>
                <h1 >{name}</h1>
            </div>
            {
                isSearch && (
                    <div className='common-header__search-box'>
                        <FormControl style={{ width: '250px'}} variant="outlined">
                            <OutlinedInput
                                id="outlined-adornment-weight"
                                value={searchValue}
                                onChange={(e)=>{ 
                                    setSearchValue(e.target.value)
                                    onChange(e.target.value)
                                }}
                                endAdornment={<InputAdornment position="end"><SearchIcon/></InputAdornment>}
                                aria-describedby="outlined-searh"
                                inputProps={{
                                    'aria-label': 'Search',
                                }}
                            />
                        </FormControl>
                    </div>
                )
            }
            <div className='block-account'>
                <div className='' onClick={handleOpenUserMenu} style={{cursor: 'pointer'}}>
                    {
                        accountUser?.photoUrl ? 
                        <img src={ConvertToImageURL(accountUser?.photoUrl)} style={{borderRadius:'50%', width:'50px', height: 50}}/>
                        : <PersonIcon htmlColor='#fff' fontSize='large'/>
                    }
                    <div className='user-name' style={{fontSize:'14px'}}>
                        {accountUser?.userName}
                    </div>
                </div>
                <Menu
                    sx={{ mt: '-35px' }}
                    id="menu-profile"
                    anchorEl={anchorElUser}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                    }}
                    keepMounted
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    open={Boolean(anchorElUser)}
                    onClose={handleCloseUserMenu}
                >
                    <MenuItem onClick={() => {
                        navigate('/')
                    }}><Typography textAlign="center">Trang chủ</Typography></MenuItem>
                    <MenuItem onClick={()=> {
                        dispatch(logout((res)=> {
                            if(res) navigate('/')
                        }))
                    }}>
                        <Typography textAlign="center">Đăng xuất</Typography>
                    </MenuItem>
                </Menu>
            </div>
        </div>
    );
};

export default CommonHeader