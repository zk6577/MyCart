import React, { useCallback, useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { FaArrowRight, FaBoxOpen, FaChartLine, FaClipboardList, FaEnvelope, FaPlus } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import Nav from '../components/Nav'
import Sidebar from '../components/Sidebar'
import { authDataContext } from '../context/authDataContext'

const actions = [
  { title: 'Add new product', text: 'Upload images, sizes, category, and price.', path: '/add', icon: FaPlus },
  { title: 'Manage products', text: 'Review, edit, and remove store products.', path: '/lists', icon: FaBoxOpen },
  { title: 'Process orders', text: 'Update delivery status for customer orders.', path: '/orders', icon: FaClipboardList },
  { title: 'Read messages', text: 'Mark customer messages read or delete them.', path: '/contact-messages', icon: FaEnvelope },
]

function Home() {
  const navigate = useNavigate()
  const { serverUrl } = useContext(authDataContext)
  const [loading, setLoading] = useState(false)
  const [dashboard, setDashboard] = useState({
    products: [],
    orders: [],
    messages: [],
  })

  const fetchDashboard = useCallback(async () => {
    try {
      setLoading(true)
      const [productsResult, ordersResult, messagesResult] = await Promise.all([
        axios.get(`${serverUrl}/api/product/list`),
        axios.get(`${serverUrl}/api/order/allOrders`, { withCredentials: true }),
        axios.get(`${serverUrl}/api/contact/allmsg`, { withCredentials: true }),
      ])

      setDashboard({
        products: Array.isArray(productsResult.data) ? productsResult.data : [],
        orders: Array.isArray(ordersResult.data.allOrder) ? ordersResult.data.allOrder : [],
        messages: Array.isArray(messagesResult.data.messages) ? messagesResult.data.messages : [],
      })
    } catch (error) {
      console.log('Dashboard fetch error', error)
    } finally {
      setLoading(false)
    }
  }, [serverUrl])

  useEffect(() => {
    fetchDashboard()
  }, [fetchDashboard])

  const unreadMessages = dashboard.messages.filter((item) => item.status !== 'read').length
  const activeOrders = dashboard.orders.filter((item) => item.status !== 'Delivered').length
  const totalRevenue = dashboard.orders.reduce((total, item) => total + (Number(item.amount) || 0), 0)

  const stats = [
    { label: 'Products', value: dashboard.products.length, text: 'Listed items', icon: FaBoxOpen },
    { label: 'Active orders', value: activeOrders, text: 'Not delivered yet', icon: FaClipboardList },
    { label: 'Unread messages', value: unreadMessages, text: 'Need admin review', icon: FaEnvelope },
    { label: 'Order value', value: `Rs. ${totalRevenue}`, text: 'Total placed orders', icon: FaChartLine },
  ]

  return (
    <div className='min-h-screen bg-[#f5f8f8] text-[#101819]'>
      <Nav />
      <Sidebar />

      <main className='pt-[64px] pl-[82px] lg:pl-[260px]'>
        <div className='px-4 sm:px-6 lg:px-8 py-6 lg:py-8'>
          <section className='rounded-[8px] bg-[#101819] text-white p-5 sm:p-7 lg:p-9 overflow-hidden'>
            <div className='max-w-[760px]'>
              <p className='text-[#88d9ee] font-bold'>MyCart Admin</p>
              <h1 className='mt-3 text-[32px] sm:text-[44px] lg:text-[54px] leading-tight font-black'>
                Control products, orders, and customer messages.
              </h1>
              <p className='mt-4 text-white/70 text-[16px] sm:text-[18px] leading-8'>
                Use this panel to keep the store updated and ready for customers.
              </p>
            </div>
          </section>

          <section className='mt-5 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4'>
            {stats.map((item) => (
              <div key={item.label} className='rounded-[8px] bg-white border border-black/5 p-5 shadow-sm'>
                <div className='flex items-start justify-between gap-3'>
                  <div>
                    <p className='text-[#607174] font-bold'>{item.label}</p>
                    <p className='mt-2 text-[30px] font-black'>{loading ? '...' : item.value}</p>
                  </div>
                  <div className='w-[44px] h-[44px] rounded-[8px] bg-[#dff4f5] flex items-center justify-center text-[#101819] text-[21px] shrink-0'>
                    {React.createElement(item.icon)}
                  </div>
                </div>
                <p className='mt-3 text-[#607174]'>{item.text}</p>
              </div>
            ))}
          </section>

          <section className='mt-5 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4'>
            {actions.map((item) => (
              <button
                type='button'
                key={item.path}
                onClick={() => navigate(item.path)}
                className='rounded-[8px] bg-white border border-black/5 p-5 text-left shadow-sm hover:-translate-y-1 hover:shadow-lg transition-all'
              >
                <div className='w-[44px] h-[44px] rounded-[8px] bg-[#dff4f5] flex items-center justify-center text-[#101819] text-[21px]'>
                  {React.createElement(item.icon)}
                </div>
                <h2 className='mt-5 text-[19px] font-black'>{item.title}</h2>
                <p className='mt-2 min-h-[48px] text-[#607174] leading-6'>{item.text}</p>
                <span className='mt-4 inline-flex items-center gap-2 font-bold text-[#2c737d]'>
                  Open <FaArrowRight />
                </span>
              </button>
            ))}
          </section>
        </div>
      </main>
    </div>
  )
}

export default Home
