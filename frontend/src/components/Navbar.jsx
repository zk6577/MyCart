import React, { useContext, useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { FaHome, FaUserCircle } from 'react-icons/fa'
import { HiCollection } from 'react-icons/hi'
import { IoSearchCircleOutline, IoSearchCircleSharp } from 'react-icons/io5'
import { MdContacts } from 'react-icons/md'
import { TiShoppingCart } from 'react-icons/ti'
import { useNavigate } from 'react-router-dom'
import logo from '../assets/logo.png'
import { authDataContex } from '../context/authDataContext'
import { cartDataContext } from '../context/cartDataContext'
import { userDataContex } from '../context/userDataContext'

const navItems = [
  { label: 'Home', path: '/' },
  { label: 'Collections', path: '/collections' },
  { label: 'About', path: '/about' },
  { label: 'Contact', path: '/contact' },
]

function Navbar() {
  const { userData, getCurrentUser } = useContext(userDataContex)
  const { cartItems } = useContext(cartDataContext)
  const { serverUrl } = useContext(authDataContex)
  const [showSearch, setShowSearch] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const [searchText, setSearchText] = useState('')
  const navigate = useNavigate()

  const cartCount = cartItems?.length || 0

  const goTo = (path) => {
    navigate(path)
    setShowProfile(false)
    setShowSearch(false)
  }

  const handleLogout = async () => {
    try {
      await axios.get(`${serverUrl}/api/auth/logout`, { withCredentials: true })
      getCurrentUser()
      navigate('/login')
      toast.success('Logged out successfully')
    } catch (error) {
      console.log('Logout Error', error)
      toast.error(error.response?.data?.message || 'Logout failed')
    }
  }

  const handleSearch = () => {
    const query = searchText.trim()
    if (!query) return

    navigate(`/collections?search=${encodeURIComponent(query)}`)
    setShowSearch(false)
    setSearchText('')
  }

  return (
    <>
      <header className='fixed top-0 left-0 right-0 z-30 h-[64px] border-b border-white/10 bg-white/90 backdrop-blur-xl shadow-lg shadow-black/10'>
        <div className='h-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 flex items-center justify-between gap-4'>
          <button
            type='button'
            onClick={() => goTo('/')}
            className='flex items-center gap-3 min-w-0'
          >
            <img className='w-[36px] h-[36px] object-contain' src={logo} alt='MyCart logo' />
            <span className='font-bold text-[21px] text-[#101819]'>MyCart</span>
          </button>

          <nav className='hidden md:flex items-center justify-center gap-1 rounded-[8px] bg-black/[0.04] p-1'>
            {navItems.map((item) => (
              <button
                key={item.path}
                type='button'
                onClick={() => goTo(item.path)}
                className='h-[40px] px-4 rounded-[8px] text-[14px] font-semibold text-[#101819] hover:bg-[#101819] hover:text-white transition-colors'
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className='flex items-center justify-end gap-2'>
            <button
              type='button'
              aria-label='Search products'
              onClick={() => setShowSearch((prev) => !prev)}
              className='w-[42px] h-[42px] rounded-full flex items-center justify-center text-[#101819] hover:bg-black/[0.07] transition-colors'
            >
              {showSearch ? (
                <IoSearchCircleSharp className='w-[32px] h-[32px]' />
              ) : (
                <IoSearchCircleOutline className='w-[32px] h-[32px]' />
              )}
            </button>

            <button
              type='button'
              aria-label='Profile menu'
              onClick={() => setShowProfile((prev) => !prev)}
              className='w-[42px] h-[42px] rounded-full flex items-center justify-center text-[#101819] hover:bg-black/[0.07] transition-colors'
            >
              {!userData ? (
                <FaUserCircle className='w-[28px] h-[28px]' />
              ) : (
                <span className='w-[32px] h-[32px] rounded-full bg-[#101819] text-white flex items-center justify-center font-bold'>
                  {userData?.name?.slice(0, 1).toUpperCase()}
                </span>
              )}
            </button>

            <button
              type='button'
              aria-label='Cart'
              onClick={() => navigate('/cart')}
              className='relative hidden md:flex w-[42px] h-[42px] rounded-full items-center justify-center text-[#101819] hover:bg-black/[0.07] transition-colors'
            >
              <TiShoppingCart className='w-[31px] h-[31px]' />
              <span className='absolute -top-1 -right-1 min-w-[20px] h-[20px] px-1 rounded-full bg-[#101819] text-white text-[11px] flex items-center justify-center'>
                {cartCount}
              </span>
            </button>
          </div>
        </div>

        {showSearch && (
          <div className='absolute top-full left-0 right-0 border-b border-white/10 bg-[#0f2023]/95 backdrop-blur-xl px-4 py-4'>
            <div className='max-w-[760px] mx-auto flex items-center gap-3'>
              <input
                type='text'
                placeholder='Search shirts, jackets, kids wear...'
                className='w-full h-[46px] rounded-[8px] px-4 bg-white text-[#101819] placeholder:text-gray-500 outline-none'
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSearch()
                }}
                autoFocus
              />
              <button
                type='button'
                onClick={handleSearch}
                className='h-[46px] px-5 rounded-[8px] bg-[#88d9ee] text-black font-semibold hover:bg-white transition-colors'
              >
                Search
              </button>
            </div>
          </div>
        )}

        {showProfile && (
          <div className='absolute top-[72px] right-4 sm:right-8 w-[190px] rounded-[8px] border border-white/10 bg-[#101819] shadow-2xl shadow-black/30 text-white overflow-hidden'>
            {userData ? (
              <button
                type='button'
                className='w-full px-4 py-3 text-left hover:bg-white/10'
                onClick={() => {
                  handleLogout()
                  setShowProfile(false)
                }}
              >
                Logout
              </button>
            ) : (
              <button type='button' className='w-full px-4 py-3 text-left hover:bg-white/10' onClick={() => goTo('/login')}>
                Login
              </button>
            )}
            <button type='button' className='w-full px-4 py-3 text-left hover:bg-white/10' onClick={() => goTo('/orders')}>
              Orders
            </button>
            <button type='button' className='w-full px-4 py-3 text-left hover:bg-white/10' onClick={() => goTo('/about')}>
              About
            </button>
          </div>
        )}
      </header>

      <nav className='fixed bottom-0 left-0 right-0 z-30 md:hidden border-t border-white/10 bg-[#101819]/95 backdrop-blur-xl px-2 py-2'>
        <div className='grid grid-cols-4 gap-1 text-[11px]'>
          <button type='button' className='min-h-[56px] rounded-[8px] flex flex-col items-center justify-center gap-1 text-white hover:bg-white/10' onClick={() => goTo('/')}>
            <FaHome className='w-[22px] h-[22px]' />
            Home
          </button>
          <button type='button' className='min-h-[56px] rounded-[8px] flex flex-col items-center justify-center gap-1 text-white hover:bg-white/10' onClick={() => goTo('/collections')}>
            <HiCollection className='w-[22px] h-[22px]' />
            Shop
          </button>
          <button type='button' className='min-h-[56px] rounded-[8px] flex flex-col items-center justify-center gap-1 text-white hover:bg-white/10' onClick={() => goTo('/contact')}>
            <MdContacts className='w-[22px] h-[22px]' />
            Contact
          </button>
          <button type='button' className='relative min-h-[56px] rounded-[8px] flex flex-col items-center justify-center gap-1 text-white hover:bg-white/10' onClick={() => goTo('/cart')}>
            <TiShoppingCart className='w-[24px] h-[24px]' />
            Cart
            <span className='absolute top-1 right-[24%] min-w-[18px] h-[18px] rounded-full bg-[#88d9ee] text-black text-[10px] flex items-center justify-center font-bold'>
              {cartCount}
            </span>
          </button>
        </div>
      </nav>
    </>
  )
}

export default Navbar
