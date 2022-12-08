import CommonHeader from 'components/common/CommonHeader';
import React, { useState } from 'react';
import SideBar from '../components/SideBar';

const WidthLayout = ({
    Component,
    showHeader = true,
    name,
}) => {
    const [keySearch, setKeySearch] = useState('')
    return (
        <div className='layout-app'>
            <SideBar/>
            <div className='component'>
                {
                    showHeader && (
                        <div>
                            <CommonHeader
                                keySearch = {keySearch}
                                setKeySearch = {setKeySearch}
                                name = {name}
                            />
                        </div>
                    )
                }
                <Component
                    Component = {Component}
                    showHeader = {showHeader}
                    name = {name}
            />
            </div>
        </div>
    );
}

export default WidthLayout;