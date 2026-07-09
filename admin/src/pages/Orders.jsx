import React, { useCallback, useContext, useEffect, useState } from 'react'
import axios from 'axios'
import Nav from '../components/Nav'
import Sidebar from '../components/Sidebar'
import { authDataContext } from '../context/authDataContext'

const statusOptions = [
  'Order Placed',
  'Packing',
  'Shipped',
  'Out for delivery',
  'Delivered',
]

const formatAddress = (address) => {
  if (!address) return 'No address'
  if (typeof address === 'string') return address

  return Object.values(address).filter(Boolean).join(', ')
}

const formatDate = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString()
}

function Orders() {
  const { serverUrl } = useContext(authDataContext)
  const [allOrders, setAllOrders] = useState([])
  const [loading, setLoading] = useState(false)
  const [updatingId, setUpdatingId] = useState('')

  const showAllOrders = useCallback(async () => {
    try {
      setLoading(true)
      const result = await axios.get(`${serverUrl}/api/order/allOrders`, {
        withCredentials: true,
      })
      setAllOrders(Array.isArray(result.data.allOrder) ? result.data.allOrder : [])
    } catch (error) {
      console.log('Error in the fetching off the order', error.message)
    } finally {
      setLoading(false)
    }
  }, [serverUrl])

  const changeStatus = async (orderId, status) => {
    try {
      setUpdatingId(orderId)
      await axios.post(
        `${serverUrl}/api/order/status`,
        { orderId, status },
        { withCredentials: true }
      )
      showAllOrders()
    } catch (error) {
      console.log('Error updating order status', error.message)
    } finally {
      setUpdatingId('')
    }
  }

  useEffect(() => {
    showAllOrders()
  }, [showAllOrders])

  return (
    <div className='min-h-screen bg-[#f5f8f8] text-[#101819]'>
      <Nav />
      <Sidebar />

      <main className='pt-[64px] pl-[82px] lg:pl-[260px]'>
        <div className='px-4 sm:px-6 lg:px-8 py-6 lg:py-8'>
          <div className='flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4'>
            <div>
              <p className='text-[#2c737d] font-bold'>Fulfillment</p>
              <h1 className='mt-2 text-[30px] sm:text-[42px] font-black'>All Orders</h1>
            </div>
            <p className='w-fit rounded-full bg-white border border-black/5 px-4 py-2 font-bold shadow-sm'>
              {allOrders.length} order{allOrders.length === 1 ? '' : 's'}
            </p>
          </div>

          {loading ? (
            <div className='w-full min-h-[320px] flex items-center justify-center'>
              <div className='w-14 h-14 rounded-full border-4 border-[#d5e2e3] border-t-[#101819] animate-spin'></div>
            </div>
          ) : allOrders.length === 0 ? (
            <div className='mt-6 rounded-[8px] bg-white border border-black/5 p-8 text-[#607174] shadow-sm'>
              No orders available
            </div>
          ) : (
            <div className='mt-6 flex flex-col gap-4'>
              {allOrders.map((order) => (
                <article key={order._id} className='rounded-[8px] bg-white border border-black/5 p-4 sm:p-5 shadow-sm'>
                  <div className='flex flex-col xl:flex-row xl:items-start xl:justify-between gap-4'>
                    <div className='min-w-0'>
                      <h2 className='text-[20px] font-black'>Order #{order._id?.slice(-6)}</h2>
                      <p className='mt-1 text-[#607174] text-[14px]'>{formatDate(order.createdAt)}</p>
                      <p className='mt-2 text-[#607174] text-[14px] break-words'>{formatAddress(order.address)}</p>
                    </div>

                    <div className='flex flex-col sm:flex-row gap-3 sm:items-center shrink-0'>
                      <div className='rounded-[8px] bg-[#f1f6f6] px-4 py-2'>
                        <span className='text-[#607174]'>Total: </span>
                        <span className='font-black'>Rs. {order.amount}</span>
                      </div>
                      <select
                        value={order.status}
                        disabled={updatingId === order._id}
                        onChange={(e) => changeStatus(order._id, e.target.value)}
                        className='h-[42px] rounded-[8px] border border-black/10 bg-[#101819] px-3 text-white outline-none disabled:opacity-60'
                      >
                        {statusOptions.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
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
                            className='w-[64px] h-[64px] rounded-[8px] object-contain bg-white shrink-0'
                          />
                        )}
                        <div className='min-w-0'>
                          <p className='font-black truncate'>{item.name || 'Product'}</p>
                          <p className='text-sm text-[#607174]'>Qty: {item.quantity || 1}</p>
                          <p className='text-sm text-[#607174]'>Rs. {item.price}</p>
                          {item.selectedSize && (
                            <p className='text-sm text-[#607174]'>Size: {item.selectedSize}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className='mt-5 flex flex-wrap gap-3 text-sm text-[#607174]'>
                    <span className='rounded-full bg-[#f1f6f6] px-3 py-1 font-semibold'>Payment: {order.paymentMethod}</span>
                    <span className='rounded-full bg-[#f1f6f6] px-3 py-1 font-semibold'>{order.payment ? 'Paid' : 'Pending'}</span>
                    {updatingId === order._id && (
                      <span className='rounded-full bg-[#dff4f5] px-3 py-1 font-semibold text-[#2c737d]'>Updating...</span>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default Orders
