import React, { useCallback, useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { FaBoxOpen, FaClipboardList, FaShoppingBag, FaTruck } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import { authDataContex } from '../context/authDataContext'

const formatAddress = (address) => {
  if (!address) return 'No address'
  if (typeof address === 'string') return address

  return Object.values(address).filter(Boolean).join(', ')
}

const formatDate = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString()
}

const statusStyles = {
  'Order Placed': 'bg-[#dff4f5] text-[#101819]',
  Packing: 'bg-[#fff4d6] text-[#7a5200]',
  Shipped: 'bg-[#e8edff] text-[#263b8f]',
  'Out for delivery': 'bg-[#e8fff0] text-[#12622c]',
  Delivered: 'bg-[#101819] text-white',
}

function Orders() {
  const { serverUrl } = useContext(authDataContex)
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true)
      const result = await axios.get(`${serverUrl}/api/order/userorders`, {
        withCredentials: true,
      })
      setOrders(Array.isArray(result.data.orders) ? result.data.orders : [])
    } catch (error) {
      console.log('Fetch user orders error', error.message)
    } finally {
      setLoading(false)
    }
  }, [serverUrl])

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  return (
    <main className='w-full min-h-screen pt-[64px] pb-[100px] md:pb-12 bg-[#f5f8f8] text-[#101819] overflow-x-hidden'>
      <section className='bg-[#101819] text-white'>
        <div className='max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-8 sm:py-10 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5'>
          <div>
            <div className='w-fit rounded-full bg-white/10 border border-white/10 px-4 py-2 text-[13px] font-bold text-[#88d9ee]'>
              Order history
            </div>
            <h1 className='mt-5 text-[36px] sm:text-[48px] lg:text-[58px] leading-tight font-black'>My Orders</h1>
            <p className='mt-3 text-white/70 text-[16px] sm:text-[18px] leading-8'>
              Track all your MyCart purchases and delivery status.
            </p>
          </div>

          <div className='rounded-[8px] bg-white/10 border border-white/10 p-5 min-w-[220px]'>
            <p className='text-[34px] font-black'>{orders.length}</p>
            <p className='text-white/70'>order{orders.length === 1 ? '' : 's'} found</p>
          </div>
        </div>
      </section>

      <section className='max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-6 lg:py-8'>
        {loading ? (
          <div className='w-full min-h-[360px] rounded-[8px] bg-white border border-black/5 flex items-center justify-center'>
            <div className='w-14 h-14 rounded-full border-4 border-[#d5e2e3] border-t-[#101819] animate-spin'></div>
          </div>
        ) : orders.length === 0 ? (
          <div className='rounded-[8px] bg-white border border-black/5 shadow-sm p-8 sm:p-10 text-center'>
            <div className='w-[62px] h-[62px] rounded-full bg-[#dff4f5] text-[#101819] flex items-center justify-center mx-auto text-[24px]'>
              <FaClipboardList />
            </div>
            <h2 className='mt-5 text-[28px] font-black'>No orders found</h2>
            <p className='mt-2 text-[#607174]'>Place your first order from the collections page.</p>
            <button
              type='button'
              onClick={() => navigate('/collections')}
              className='mt-6 min-h-[48px] px-6 rounded-[8px] bg-[#101819] text-white font-bold inline-flex items-center gap-2'
            >
              <FaShoppingBag />
              Shop now
            </button>
          </div>
        ) : (
          <div className='flex flex-col gap-5'>
            {orders.map((order) => (
              <article
                key={order._id}
                className='bg-white text-[#101819] rounded-[8px] border border-black/5 p-4 sm:p-5 shadow-sm'
              >
                <div className='flex flex-col xl:flex-row xl:items-start xl:justify-between gap-4'>
                  <div className='flex gap-3 min-w-0'>
                    <div className='w-[48px] h-[48px] rounded-[8px] bg-[#dff4f5] text-[#101819] flex items-center justify-center shrink-0'>
                      <FaBoxOpen />
                    </div>
                    <div className='min-w-0'>
                      <h2 className='text-[20px] font-black'>Order #{order._id?.slice(-6)}</h2>
                      <p className='mt-1 text-[#607174] text-[14px]'>{formatDate(order.createdAt)}</p>
                      <p className='mt-2 text-[#607174] text-[14px] leading-6 break-words'>
                        {formatAddress(order.address)}
                      </p>
                    </div>
                  </div>

                  <div className='flex flex-wrap xl:justify-end gap-2 shrink-0'>
                    <span className={`rounded-full px-3 py-1 text-[13px] font-black ${statusStyles[order.status] || 'bg-[#f1f6f6] text-[#101819]'}`}>
                      {order.status}
                    </span>
                    <span className='rounded-full bg-[#f1f6f6] px-3 py-1 text-[13px] font-bold text-[#607174]'>
                      {order.paymentMethod}
                    </span>
                    <span className='rounded-full bg-[#f1f6f6] px-3 py-1 text-[13px] font-bold text-[#607174]'>
                      {order.payment ? 'Paid' : 'Pending'}
                    </span>
                  </div>
                </div>

                <div className='mt-5 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3'>
                  {(order.items || []).map((item, index) => (
                    <div
                      key={`${order._id}-${item._id || index}`}
                      className='rounded-[8px] border border-black/5 bg-[#f7fbfb] p-3 flex gap-3 items-center min-w-0'
                    >
                      {item.image1 && (
                        <img
                          src={item.image1}
                          alt={item.name}
                          className='w-[66px] h-[66px] rounded-[8px] object-contain bg-white shrink-0'
                        />
                      )}
                      <div className='min-w-0'>
                        <p className='font-black truncate'>{item.name || 'Product'}</p>
                        <div className='mt-1 flex flex-wrap gap-x-3 gap-y-1 text-sm text-[#607174]'>
                          <span>Qty: {item.quantity || 1}</span>
                          <span>Rs. {item.price}</span>
                          {item.selectedSize && <span>Size: {item.selectedSize}</span>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className='mt-5 pt-4 border-t border-black/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3'>
                  <div className='flex items-center gap-2 text-[#607174]'>
                    <FaTruck className='text-[#2c737d]' />
                    <span className='font-semibold'>Latest status: {order.status}</span>
                  </div>
                  <p className='text-[24px] font-black text-[#2c737d]'>Rs. {order.amount}</p>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}

export default Orders
