import React, { useContext, useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { FaArrowRight, FaMinus, FaPlus, FaShoppingBag, FaTrashAlt, FaTruck } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import { authDataContex } from '../context/authDataContext'
import { cartDataContext } from '../context/cartDataContext'

function Cart() {
  const {
    cartItems,
    setCartItems,
    removeCart,
    increaseQty,
    decreaseQty,
  } = useContext(cartDataContext)
  const { serverUrl } = useContext(authDataContex)
  const navigate = useNavigate()
  const razorpayKeyId = import.meta.env.VITE_RAZORPAY_KEY_ID

  const [loading, setLoading] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('COD')
  const [address, setAddress] = useState({
    fullName: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    pincode: '',
  })

  const totalAmount = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  )
  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0)

  const handleAddressChange = (e) => {
    const { name, value } = e.target
    setAddress((prev) => ({ ...prev, [name]: value }))
  }

  const finishOrder = () => {
    setCartItems([])
    toast.success('Order placed successfully')
    navigate('/orders')
  }

  const placeCodOrder = async () => {
    await axios.post(
      `${serverUrl}/api/order/place`,
      {
        items: cartItems,
        address,
        paymentMethod: 'COD',
      },
      { withCredentials: true }
    )

    finishOrder()
  }

  const verifyRazorpayPayment = async (paymentResponse) => {
    await axios.post(
      `${serverUrl}/api/verify-payment`,
      {
        ...paymentResponse,
      },
      { withCredentials: true }
    )

    finishOrder()
  }

  const placeRazorpayOrder = async () => {
    if (!razorpayKeyId) {
      toast.error('Razorpay key is missing')
      setLoading(false)
      return
    }

    if (!window.Razorpay) {
      toast.error('Razorpay checkout could not be loaded')
      setLoading(false)
      return
    }

    const amountInPaise = Math.round(totalAmount * 100)
    const result = await axios.post(
      `${serverUrl}/api/create-order`,
      {
        amount: amountInPaise,
        currency: 'INR',
        receipt: `receipt_${Date.now()}`,
        items: cartItems,
        address,
      },
      { withCredentials: true }
    )

    const razorpayOrder = result.data
    const checkout = new window.Razorpay({
      key: razorpayKeyId,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      name: 'MyCart',
      description: 'MyCart order payment',
      order_id: razorpayOrder.order_id,
      prefill: {
        name: address.fullName,
        contact: address.phone,
      },
      theme: {
        color: '#101819',
      },
      modal: {
        ondismiss: () => {
          setLoading(false)
          toast.error('Payment cancelled')
        },
      },
      handler: async (response) => {
        try {
          await verifyRazorpayPayment(response)
        } catch (error) {
          console.log('Razorpay verify error', error)
          toast.error(error.response?.data?.message || 'Payment verification failed')
          setLoading(false)
        }
      },
    })

    checkout.on('payment.failed', (response) => {
      console.log('Razorpay payment failed', response.error)
      toast.error(response.error?.description || 'Payment failed')
      setLoading(false)
    })

    checkout.open()
  }

  const placeOrder = async (e) => {
    e.preventDefault()

    if (cartItems.length === 0) {
      toast.error('Cart is empty')
      return
    }

    try {
      setLoading(true)

      if (paymentMethod === 'Razorpay') {
        await placeRazorpayOrder()
        return
      }

      await placeCodOrder()
    } catch (error) {
      console.log('Place order error', error)
      toast.error(error.response?.data?.message || 'Order failed')
      setLoading(false)
    }
  }

  return (
    <main className='w-full min-h-screen pt-[64px] pb-[100px] md:pb-12 bg-[#f5f8f8] text-[#101819] overflow-x-hidden'>
      <section className='bg-[#101819] text-white'>
        <div className='max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-8 sm:py-10 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5'>
          <div>
            <div className='w-fit rounded-full bg-white/10 border border-white/10 px-4 py-2 text-[13px] font-bold text-[#88d9ee]'>
              Checkout
            </div>
            <h1 className='mt-5 text-[36px] sm:text-[48px] lg:text-[58px] leading-tight font-black'>My Cart</h1>
            <p className='mt-3 text-white/70 text-[16px] sm:text-[18px] leading-8'>
              Review your products and place your MyCart order.
            </p>
          </div>

          <div className='rounded-[8px] bg-white/10 border border-white/10 p-5 min-w-[220px]'>
            <p className='text-[34px] font-black'>Rs. {totalAmount}</p>
            <p className='text-white/70'>{totalItems} item{totalItems === 1 ? '' : 's'} in cart</p>
          </div>
        </div>
      </section>

      <section className='max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-6 lg:py-8'>
        {cartItems.length === 0 ? (
          <div className='rounded-[8px] bg-white border border-black/5 shadow-sm p-8 sm:p-10 text-center'>
            <div className='w-[62px] h-[62px] rounded-full bg-[#dff4f5] text-[#101819] flex items-center justify-center mx-auto text-[24px]'>
              <FaShoppingBag />
            </div>
            <h2 className='mt-5 text-[28px] font-black'>Your cart is empty</h2>
            <p className='mt-2 text-[#607174]'>Add products from collections before checkout.</p>
            <button
              type='button'
              onClick={() => navigate('/collections')}
              className='mt-6 min-h-[48px] px-6 rounded-[8px] bg-[#101819] text-white font-bold inline-flex items-center gap-2'
            >
              Shop collections
              <FaArrowRight />
            </button>
          </div>
        ) : (
          <div className='grid grid-cols-1 xl:grid-cols-[1fr_430px] gap-5 lg:gap-6 items-start'>
            <div className='flex flex-col gap-4'>
              {cartItems.map((item) => {
                const cartKey = item.cartKey || (item.selectedSize ? `${item._id}:${item.selectedSize}` : item._id)
                const itemTotal = item.price * item.quantity
                const image = item.image1 || item.image2 || item.image3 || item.image4

                return (
                  <article
                    key={cartKey}
                    className='bg-white border border-black/5 text-[#101819] rounded-[8px] p-4 shadow-sm flex flex-col md:flex-row gap-4 md:items-center'
                  >
                    <div className='w-full md:w-[116px] h-[180px] md:h-[116px] rounded-[8px] bg-[#f1f6f6] flex items-center justify-center p-3 shrink-0'>
                      <img
                        src={image}
                        alt={item.name}
                        className='w-full h-full object-contain'
                      />
                    </div>

                    <div className='min-w-0 flex-1'>
                      <h2 className='text-[18px] sm:text-[20px] font-black leading-snug'>{item.name}</h2>
                      <p className='mt-1 text-[#607174]'>{item.category}</p>
                      <div className='mt-3 flex flex-wrap gap-2'>
                        <span className='rounded-full bg-[#dff4f5] px-3 py-1 text-[13px] font-bold'>
                          Rs. {item.price}
                        </span>
                        {item.selectedSize && (
                          <span className='rounded-full bg-[#f1f6f6] px-3 py-1 text-[13px] font-bold text-[#607174]'>
                            Size: {item.selectedSize}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className='flex flex-wrap md:flex-col lg:flex-row xl:flex-col items-center md:items-end gap-3 md:gap-4'>
                      <div className='h-[42px] rounded-[8px] border border-black/10 bg-[#f7fbfb] flex items-center overflow-hidden'>
                        <button
                          type='button'
                          className='w-[42px] h-full flex items-center justify-center hover:bg-[#e6eeee]'
                          onClick={() => decreaseQty(cartKey)}
                          aria-label='Decrease quantity'
                        >
                          <FaMinus className='text-[12px]' />
                        </button>
                        <span className='w-[44px] text-center font-black'>{item.quantity}</span>
                        <button
                          type='button'
                          className='w-[42px] h-full flex items-center justify-center hover:bg-[#e6eeee]'
                          onClick={() => increaseQty(cartKey)}
                          aria-label='Increase quantity'
                        >
                          <FaPlus className='text-[12px]' />
                        </button>
                      </div>

                      <p className='min-w-[100px] text-right text-[18px] font-black'>Rs. {itemTotal}</p>

                      <button
                        type='button'
                        className='min-h-[38px] px-4 rounded-[8px] bg-[#ffe9e9] text-[#9b1c1c] font-bold flex items-center gap-2 hover:bg-[#ffd8d8] transition-colors'
                        onClick={() => removeCart(cartKey)}
                      >
                        <FaTrashAlt />
                        Remove
                      </button>
                    </div>
                  </article>
                )
              })}
            </div>

            <aside className='xl:sticky xl:top-[84px] flex flex-col gap-4'>
              <div className='rounded-[8px] bg-white border border-black/5 p-5 shadow-sm'>
                <h2 className='text-[22px] font-black'>Order Summary</h2>
                <div className='mt-4 flex flex-col gap-3 text-[#607174]'>
                  <div className='flex items-center justify-between'>
                    <span>Items</span>
                    <span className='font-bold text-[#101819]'>{totalItems}</span>
                  </div>
                  <div className='flex items-center justify-between'>
                    <span>Subtotal</span>
                    <span className='font-bold text-[#101819]'>Rs. {totalAmount}</span>
                  </div>
                  <div className='flex items-center justify-between'>
                    <span>Payment</span>
                    <span className='font-bold text-[#101819]'>
                      {paymentMethod === 'Razorpay' ? 'Razorpay' : 'Cash on Delivery'}
                    </span>
                  </div>
                </div>
                <div className='mt-4 pt-4 border-t border-black/10 flex items-center justify-between'>
                  <span className='text-[18px] font-black'>Total</span>
                  <span className='text-[24px] font-black text-[#2c737d]'>Rs. {totalAmount}</span>
                </div>
              </div>

              <form
                onSubmit={placeOrder}
                className='rounded-[8px] bg-white border border-black/5 p-5 shadow-sm flex flex-col gap-4'
              >
                <div className='flex items-center gap-3'>
                  <div className='w-[42px] h-[42px] rounded-[8px] bg-[#dff4f5] text-[#101819] flex items-center justify-center'>
                    <FaTruck />
                  </div>
                  <div>
                    <h2 className='text-[22px] font-black'>Delivery Details</h2>
                    <p className='text-[#607174] text-[14px]'>Enter where we should deliver.</p>
                  </div>
                </div>

                <input
                  name='fullName'
                  value={address.fullName}
                  onChange={handleAddressChange}
                  className='w-full h-[46px] rounded-[8px] border border-black/10 bg-[#f7fbfb] px-4 outline-none focus:ring-2 focus:ring-[#88d9ee]'
                  placeholder='Full name'
                  required
                />
                <input
                  name='phone'
                  value={address.phone}
                  onChange={handleAddressChange}
                  className='w-full h-[46px] rounded-[8px] border border-black/10 bg-[#f7fbfb] px-4 outline-none focus:ring-2 focus:ring-[#88d9ee]'
                  placeholder='Phone'
                  required
                />
                <input
                  name='street'
                  value={address.street}
                  onChange={handleAddressChange}
                  className='w-full h-[46px] rounded-[8px] border border-black/10 bg-[#f7fbfb] px-4 outline-none focus:ring-2 focus:ring-[#88d9ee]'
                  placeholder='Street address'
                  required
                />

                <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-3'>
                  <input
                    name='city'
                    value={address.city}
                    onChange={handleAddressChange}
                    className='w-full h-[46px] rounded-[8px] border border-black/10 bg-[#f7fbfb] px-4 outline-none focus:ring-2 focus:ring-[#88d9ee]'
                    placeholder='City'
                    required
                  />
                  <input
                    name='state'
                    value={address.state}
                    onChange={handleAddressChange}
                    className='w-full h-[46px] rounded-[8px] border border-black/10 bg-[#f7fbfb] px-4 outline-none focus:ring-2 focus:ring-[#88d9ee]'
                    placeholder='State'
                    required
                  />
                </div>

                <input
                  name='pincode'
                  value={address.pincode}
                  onChange={handleAddressChange}
                  className='w-full h-[46px] rounded-[8px] border border-black/10 bg-[#f7fbfb] px-4 outline-none focus:ring-2 focus:ring-[#88d9ee]'
                  placeholder='Pincode'
                  required
                />

                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className='w-full h-[46px] rounded-[8px] border border-black/10 bg-[#f7fbfb] px-4 outline-none focus:ring-2 focus:ring-[#88d9ee]'
                >
                  <option value='COD'>Cash on Delivery</option>
                  <option value='Razorpay'>Razorpay Online Payment</option>
                </select>

                <button
                  type='submit'
                  disabled={loading}
                  className='w-full min-h-[50px] rounded-[8px] bg-[#101819] text-white font-black hover:bg-[#28464a] transition-colors disabled:opacity-60'
                >
                  {loading
                    ? paymentMethod === 'Razorpay' ? 'Opening payment...' : 'Placing order...'
                    : paymentMethod === 'Razorpay' ? 'Pay with Razorpay' : 'Place Order'}
                </button>
              </form>
            </aside>
          </div>
        )}
      </section>
    </main>
  )
}

export default Cart
