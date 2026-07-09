import React, { useContext, useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { IoIosEye, IoIosEyeOff } from 'react-icons/io'
import { useNavigate } from 'react-router-dom'
import logo from '../assets/logo.png'
import { adminContext } from '../context/adminDataContext'
import { authDataContext } from '../context/authDataContext'

function Login() {
  const [show, setShow] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { serverUrl } = useContext(authDataContext)
  const { getAdmin } = useContext(adminContext)
  const navigate = useNavigate()

  const adminLogin = async (e) => {
    e.preventDefault()

    if (!email || !password) {
      toast.error('Please fill all fields')
      return
    }

    try {
      setLoading(true)
      await axios.post(
        `${serverUrl}/api/auth/adminlogin`,
        { email, password },
        { withCredentials: true }
      )
      toast.success('Login successfully')
      getAdmin()
      navigate('/')
    } catch (error) {
      console.log('Login Error', error)
      toast.error(error.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className='min-h-screen bg-[#f5f8f8] text-[#101819] grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] overflow-x-hidden'>
      <section className='hidden lg:flex bg-[#101819] text-white p-10 flex-col justify-between'>
        <div className='flex items-center gap-3'>
          <img className='w-[42px] h-[42px] object-contain' src={logo} alt='MyCart logo' />
          <div>
            <p className='text-[24px] font-black'>MyCart</p>
            <p className='text-white/55 text-[13px]'>Admin panel</p>
          </div>
        </div>

        <div className='max-w-[560px]'>
          <p className='text-[#88d9ee] font-bold'>Store management</p>
          <h1 className='mt-4 text-[56px] leading-[1.04] font-black'>A cleaner panel for a cleaner store.</h1>
          <p className='mt-5 text-white/70 text-[18px] leading-8'>
            Login to manage products, orders, and customer messages from one responsive admin dashboard.
          </p>
        </div>

        <div className='grid grid-cols-3 gap-3 text-center'>
          <div className='rounded-[8px] bg-white/10 p-4'>
            <p className='text-[26px] font-black'>Products</p>
            <p className='text-white/60 text-[13px]'>Create and update</p>
          </div>
          <div className='rounded-[8px] bg-white/10 p-4'>
            <p className='text-[26px] font-black'>Orders</p>
            <p className='text-white/60 text-[13px]'>Track status</p>
          </div>
          <div className='rounded-[8px] bg-white/10 p-4'>
            <p className='text-[26px] font-black'>Support</p>
            <p className='text-white/60 text-[13px]'>Read messages</p>
          </div>
        </div>
      </section>

      <section className='min-h-screen flex flex-col justify-center px-4 sm:px-6 lg:px-14 py-8'>
        <div className='w-full max-w-[500px] mx-auto'>
          <div className='flex items-center gap-3 mb-8 lg:hidden'>
            <img className='w-[38px] h-[38px] object-contain' src={logo} alt='MyCart logo' />
            <div>
              <p className='text-[22px] font-black'>MyCart</p>
              <p className='text-[#607174] text-[13px]'>Admin panel</p>
            </div>
          </div>

          <div className='mb-7'>
            <p className='text-[#2c737d] font-bold'>Admin login</p>
            <h2 className='mt-2 text-[34px] sm:text-[44px] leading-tight font-black'>Welcome back</h2>
            <p className='mt-3 text-[#607174] leading-7'>Enter your admin credentials to continue.</p>
          </div>

          <form className='rounded-[8px] border border-black/5 bg-white p-5 sm:p-7 shadow-xl shadow-[#101819]/10' onSubmit={adminLogin}>
            <div className='flex flex-col gap-4'>
              <input
                type='email'
                className='w-full h-[50px] rounded-[8px] border border-black/10 bg-[#f7fbfb] px-4 outline-none focus:ring-2 focus:ring-[#88d9ee]'
                placeholder='Admin email'
                required
                onChange={(e) => setEmail(e.target.value)}
                value={email}
              />

              <div className='relative'>
                <input
                  type={show ? 'text' : 'password'}
                  className='w-full h-[50px] rounded-[8px] border border-black/10 bg-[#f7fbfb] px-4 pr-12 outline-none focus:ring-2 focus:ring-[#88d9ee]'
                  placeholder='Password'
                  required
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                />
                <button
                  type='button'
                  className='absolute right-3 top-1/2 -translate-y-1/2 text-[#607174]'
                  onClick={() => setShow((prev) => !prev)}
                  aria-label={show ? 'Hide password' : 'Show password'}
                >
                  {show ? <IoIosEyeOff className='size-6' /> : <IoIosEye className='size-6' />}
                </button>
              </div>

              <button
                className='w-full min-h-[50px] rounded-[8px] bg-[#101819] text-white font-bold hover:bg-[#28464a] transition-colors disabled:opacity-60'
                disabled={loading}
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </div>
          </form>
        </div>
      </section>
    </main>
  )
}

export default Login
