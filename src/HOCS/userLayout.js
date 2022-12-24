import Footer from 'containers/Footer';
import React, { useState } from 'react';
import Header from '../containers/Header'
import { useSelector } from 'react-redux';

const UserLayout = ({
    Component,
}) => {
    const [searchKey, setSearchKey] = React.useState('');
    return (
        <div className='layout-user-app'>
            <Header searchKey={searchKey} setSearchKey={setSearchKey}/>
            <div className='component' style={{marginTop: 90}}>
                <Component />
            </div>
            <Footer/>
        </div>
    );
}

export default UserLayout;