import React, { useContext } from 'react'
import axios from 'axios'
import { FiLogOut } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import logo from '../assets/logo.png'
import { adminContext } from '../context/adminDataContext'
import { authDataContext } from '../context/authDataContext'

function Nav() {
  const navigate = useNavigate()
  const { serverUrl } = useContext(authDataContext)
  const { getAdmin } = useContext(adminContext)

  const logout = async () => {
    try {
      await axios.get(`${serverUrl}/api/auth/adminlogout`, { withCredentials: true })
      getAdmin()
      navigate('/login')
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <header className='fixed top-0 left-0 right-0 z-30 h-[64px] border-b border-white/10 bg-[#101819]/95 backdrop-blur-xl text-white'>
      <div className='h-full px-4 sm:px-6 flex items-center justify-between gap-4'>
        <button type='button' className='flex items-center gap-3 min-w-0' onClick={() => navigate('/')}>
          <img src={logo} alt='MyCart admin logo' className='w-[36px] h-[36px] object-contain' />
          <div className='text-left leading-tight'>
            <p className='text-[18px] sm:text-[20px] font-black'>MyCart</p>
            <p className='text-[11px] sm:text-[12px] text-white/55'>Admin panel</p>
          </div>
        </button>

        <button
          type='button'
          className='min-h-[40px] px-4 rounded-[8px] bg-white text-[#101819] font-bold flex items-center gap-2 hover:bg-[#88d9ee] transition-colors'
          onClick={logout}
        >
          <FiLogOut className='text-[18px]' />
          <span className='hidden sm:inline'>Logout</span>
        </button>
      </div>
    </header>
  )
}

export default Nav
