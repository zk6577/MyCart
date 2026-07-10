import React, { useContext, useState } from 'react'
import axios from 'axios'
import { signInWithPopup } from 'firebase/auth'
import toast from 'react-hot-toast'
import { IoIosEye, IoIosEyeOff } from 'react-icons/io'
import { useNavigate } from 'react-router-dom'
import Google from '../assets/Google.png'
import logo from '../assets/logo.png'
import { auth, provider } from '../../utils/Firebase'
import { authDataContex } from '../context/authDataContext'
import { userDataContex } from '../context/userDataContext'

function Login() {
  const [show, setShow] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { serverUrl } = useContext(authDataContex)
  const { getCurrentUser } = useContext(userDataContex)

  const handleLogin = async (e) => {
    e.preventDefault()

    if (!email || !password) {
      toast.error('Please fill all fields')
      return
    }

    try {
      setLoading(true)
      await axios.post(
        `${serverUrl}/api/auth/login`,
        { email, password },
        { withCredentials: true }
      )
      toast.success('Login successfully')
      getCurrentUser()
      navigate('/')
    } catch (error) {
      console.log('Login Error', error)
      toast.error(error.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  const googleLogin = async () => {
    try {
      setLoading(true)
      const response = await signInWithPopup(auth, provider)
      const user = response.user

      await axios.post(
        `${serverUrl}/api/auth/googlelogin`,
        { name: user.displayName, email: user.email },
        { withCredentials: true }
      )

      await getCurrentUser()
      toast.success('Login successfully')
      navigate('/')
    } catch (error) {
      console.log('Google login error', error)
      toast.error(error.response?.data?.message || error.message || 'Google login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className='min-h-screen bg-[#f5f8f8] text-[#101819] grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] overflow-x-hidden'>
      <section className='hidden lg:flex relative bg-[#101819] text-white p-10 flex-col justify-between overflow-hidden'>
        <div className='flex items-center gap-3 cursor-pointer' onClick={() => navigate('/')}>
          <img className='w-[42px] h-[42px] object-contain' src={logo} alt='MyCart logo' />
          <span className='text-[24px] font-black'>MyCart</span>
        </div>
        <div className='max-w-[520px]'>
          <p className='text-[#88d9ee] font-bold'>Welcome back</p>
          <h1 className='mt-4 text-[58px] leading-[1.03] font-black'>Manage your cart and orders with ease.</h1>
          <p className='mt-5 text-white/70 text-[18px] leading-8'>Login to continue shopping, add products to your cart, and track your latest MyCart orders.</p>
        </div>
      </section>

      <section className='min-h-screen flex flex-col justify-center px-4 sm:px-6 lg:px-14 py-8'>
        <button type='button' className='lg:hidden w-fit flex items-center gap-3 mb-8' onClick={() => navigate('/')}>
          <img className='w-[38px] h-[38px] object-contain' src={logo} alt='MyCart logo' />
          <span className='text-[22px] font-black'>MyCart</span>
        </button>

        <div className='w-full max-w-[520px] mx-auto'>
          <div className='mb-7'>
            <p className='text-[#2c737d] font-bold'>Customer login</p>
            <h2 className='mt-2 text-[34px] sm:text-[44px] leading-tight font-black'>Sign in to MyCart</h2>
            <p className='mt-3 text-[#607174] leading-7'>Continue shopping from where you left off.</p>
          </div>

          <form className='rounded-[8px] border border-black/5 bg-white p-5 sm:p-7 shadow-xl shadow-[#101819]/10' onSubmit={handleLogin}>
            <button
              type='button'
              onClick={googleLogin}
              disabled={loading}
              className='w-full min-h-[48px] rounded-[8px] border border-black/10 bg-white flex items-center justify-center gap-3 font-bold hover:bg-[#f1f6f6] transition-colors'
            >
              <img className='w-[24px] h-[24px] rounded-full' src={Google} alt='Google icon' />
              Login with Google
            </button>

            <div className='my-5 flex items-center gap-3 text-[#758487] text-[13px] font-semibold'>
              <span className='h-px flex-1 bg-black/10'></span>
              OR
              <span className='h-px flex-1 bg-black/10'></span>
            </div>

            <div className='flex flex-col gap-4'>
              <input
                type='email'
                className='w-full h-[50px] rounded-[8px] border border-black/10 bg-[#f7fbfb] px-4 outline-none focus:ring-2 focus:ring-[#88d9ee]'
                placeholder='Email address'
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

            <p className='mt-5 text-center text-[#607174]'>
              New to MyCart?{' '}
              <button type='button' className='font-bold text-[#2c737d]' onClick={() => navigate('/signup')}>
                Create account
              </button>
            </p>
          </form>
        </div>
      </section>
    </main>
  )
}

export default Login
