// require('dotenv').config()
import { Route, Routes, useNavigate } from 'react-router-dom'
import { BrowserRouter } from 'react-router-dom'
import { ReactNotifications } from 'react-notifications-component'
import React, { useEffect } from 'react'

import './App.css'
import './styles/index.scss'
import UserRoutes from 'route/UserRoutes'
import OwnerRoutes from 'route/OwnerRoutes'
import AdminRoutes from 'route/AdminRoutes'

function App() {
  return (
    <BrowserRouter>
        <div className="App">
          <ReactNotifications/>
          <UserRoutes/>
          <OwnerRoutes/>
          <AdminRoutes/> 
        </div>
      </BrowserRouter>
  );
}

export default App;
