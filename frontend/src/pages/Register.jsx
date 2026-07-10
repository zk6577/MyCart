import React, { useContext, useState } from 'react'
import axios from 'axios'
import { signInWithPopup } from 'firebase/auth'
import toast from 'react-hot-toast'
import { IoIosEye, IoIosEyeOff } from 'react-icons/io'
import { useNavigate } from 'react-router-dom'
import Google from '../assets/Google.png'
import logo from '../assets/logo.png'
import { auth, provider } from '../../utils/Firebase.js'
import { authDataContex } from '../context/authDataContext'
import { userDataContex } from '../context/userDataContext.js'
import { clearAuthToken, setAuthToken } from '../utils/authToken'

function Register() {
  const [show, setShow] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { serverUrl } = useContext(authDataContex)
  const { getCurrentUser } = useContext(userDataContex)
  const navigate = useNavigate()

  const handleSignup = async (e) => {
    e.preventDefault()

    try {
      setLoading(true)
      const result = await axios.post(
        `${serverUrl}/api/auth/register`,
        { name, email, password },
        { withCredentials: true }
      )
      setAuthToken(result.data?.token)
      const currentUser = await getCurrentUser()
      if (!currentUser) {
        throw new Error('The browser blocked the login session. Please reload and try again.')
      }
      toast.success('Account created')
      navigate('/')
    } catch (error) {
      clearAuthToken()
      console.log('Signup error', error)
      toast.error(error.response?.data?.message || error.message || 'Signup failed')
    } finally {
      setLoading(false)
    }
  }

  const googleSignup = async () => {
    try {
      setLoading(true)
      const response = await signInWithPopup(auth, provider)
      const user = response.user

      const loginResult = await axios.post(
        `${serverUrl}/api/auth/googlelogin`,
        { name: user.displayName, email: user.email },
        { withCredentials: true }
      )
      setAuthToken(loginResult.data?.token)

      const currentUser = await getCurrentUser()
      if (!currentUser) {
        throw new Error('The browser blocked the login session. Please reload and try again.')
      }
      toast.success('Account created')
      navigate('/')
    } catch (error) {
      clearAuthToken()
      console.log('Google signup error', error)
      toast.error(error.response?.data?.message || error.message || 'Google signup failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className='min-h-screen bg-[#f5f8f8] text-[#101819] grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] overflow-x-hidden'>
      <section className='min-h-screen flex flex-col justify-center px-4 sm:px-6 lg:px-14 py-8'>
        <button type='button' className='w-fit flex items-center gap-3 mb-8' onClick={() => navigate('/')}>
          <img className='w-[38px] h-[38px] object-contain' src={logo} alt='MyCart logo' />
          <span className='text-[22px] font-black'>MyCart</span>
        </button>

        <div className='w-full max-w-[540px] mx-auto'>
          <div className='mb-7'>
            <p className='text-[#2c737d] font-bold'>Create account</p>
            <h1 className='mt-2 text-[34px] sm:text-[44px] leading-tight font-black'>Start shopping with MyCart</h1>
            <p className='mt-3 text-[#607174] leading-7'>Save your cart, place orders, and track every purchase in one place.</p>
          </div>

          <form className='rounded-[8px] border border-black/5 bg-white p-5 sm:p-7 shadow-xl shadow-[#101819]/10' onSubmit={handleSignup}>
            <button
              type='button'
              onClick={googleSignup}
              disabled={loading}
              className='w-full min-h-[48px] rounded-[8px] border border-black/10 bg-white flex items-center justify-center gap-3 font-bold hover:bg-[#f1f6f6] transition-colors'
            >
              <img className='w-[24px] h-[24px] rounded-full' src={Google} alt='Google icon' />
              Signup with Google
            </button>

            <div className='my-5 flex items-center gap-3 text-[#758487] text-[13px] font-semibold'>
              <span className='h-px flex-1 bg-black/10'></span>
              OR
              <span className='h-px flex-1 bg-black/10'></span>
            </div>

            <div className='flex flex-col gap-4'>
              <input
                type='text'
                className='w-full h-[50px] rounded-[8px] border border-black/10 bg-[#f7fbfb] px-4 outline-none focus:ring-2 focus:ring-[#88d9ee]'
                placeholder='Full name'
                required
                onChange={(e) => setName(e.target.value)}
                value={name}
              />
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
                {loading ? 'Creating...' : 'Create account'}
              </button>
            </div>

            <p className='mt-5 text-center text-[#607174]'>
              Already have an account?{' '}
              <button type='button' className='font-bold text-[#2c737d]' onClick={() => navigate('/login')}>
                Login
              </button>
            </p>
          </form>
        </div>
      </section>

      <section className='hidden lg:flex bg-[#101819] text-white p-10 flex-col justify-between'>
        <div className='rounded-[8px] bg-white/10 p-6'>
          <p className='text-[#88d9ee] font-bold'>MyCart customer benefits</p>
          <h2 className='mt-4 text-[48px] leading-tight font-black'>Create once, shop faster every time.</h2>
        </div>
        <div className='grid gap-4'>
          {['Smart cart quantity updates', 'Order history after checkout', 'Fast product search and filters'].map((item) => (
            <div key={item} className='rounded-[8px] border border-white/10 bg-white/[0.06] p-4 font-semibold'>
              {item}
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}

export default Register
