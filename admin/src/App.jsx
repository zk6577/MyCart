import React, { useContext } from 'react'
import { Route, Routes } from 'react-router-dom'
import Add from './pages/Add'
import Home from './pages/Home'
import Orders from './pages/Orders'
import Login from './pages/Login'
import Lists from './pages/Lists'
import ContactMsg from './pages/ContactMsg'
import { adminContext } from './context/adminDataContext'
import { Toaster } from 'react-hot-toast'

function App() {

   let {adminData}= useContext(adminContext)
  return (
<>
  {!adminData ? <Login /> : (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/add" element={<Add />} />
      <Route path="/lists" element={<Lists />} />
      <Route path="/login" element={<Login />} />
      <Route path="/orders" element={<Orders />} />
      <Route path="/contact-messages" element={<ContactMsg />} />
    </Routes>
  )}
  <Toaster position="top-center" reverseOrder={false} />
</>
  )
}

export default App
