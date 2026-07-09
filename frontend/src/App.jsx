import React, { useContext } from 'react'
import { Route, Routes ,useLocation } from 'react-router-dom'
import Register from './pages/Register'
import Home from './pages/Home'
import Login from './pages/Login'
import { Toaster } from 'react-hot-toast'
import Navbar from './components/Navbar';
import { userDataContex } from './context/userDataContext'
import Contact from './pages/Contact'
import Collections from './pages/Collections'
import About from './pages/About'
import Products from './pages/Products'
import Cart from './pages/Cart'
import Orders from './pages/Orders'

function App() {

  const location= useLocation()
  const hideNavbar=["/login","/signup"].includes(location.pathname)
  const { userData ,loading} = useContext(userDataContex)

  if (loading) {
    return (
      <div className="w-screen h-screen bg-gradient-to-l from-[#141414] to-[#0c2025] flex items-center justify-center">
        <div className="w-16 h-16 rounded-full border-4 border-white/20 border-t-[#46d9ff] animate-spin"></div>
      </div>
    )
  }

  return (
    <>
         {!hideNavbar && <Navbar />}

      <Routes>
       <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Register />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/collections" element={<Collections />} />
        <Route path="/about" element={<About />} />
        <Route path="/product/:id" element={<Products />} />
        <Route path="/cart" element={userData?<Cart />:<Login/>} />
        <Route path="/orders" element={userData?<Orders />:<Login/>} />


      </Routes>

      <Toaster position="top-center" reverseOrder={false} />
    </>
  )
}

export default App
