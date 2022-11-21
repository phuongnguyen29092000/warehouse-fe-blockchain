import { Route, Routes, useNavigate } from 'react-router-dom'
import { BrowserRouter } from 'react-router-dom'
import { ReactNotifications } from 'react-notifications-component'
import React, { useEffect } from 'react'
import Header from './containers/Header'

import './App.css'
import './styles/index.scss'
import UserRoutes from 'route/UserRoutes'

function App() {
  return (
    <BrowserRouter>
        <div className="App">
          <ReactNotifications/>
          <Routes>
            {/* <Route path="/" exact element={<SideBar />} /> */}
          </Routes>
          <UserRoutes/>
          {/* <OwnerRoutes/>
          <UserRoutes/>
          <AdminRoutes/> */}
          {/* <Header /> */}
          {/* <HomePage/> */}
        </div>
      </BrowserRouter>
  );
}

export default App;
