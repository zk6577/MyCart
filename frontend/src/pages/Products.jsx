import React, { useCallback, useContext, useEffect, useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { FaArrowLeft, FaBolt, FaShoppingCart } from 'react-icons/fa'
import { useNavigate, useParams } from 'react-router-dom'
import { authDataContex } from '../context/authDataContext'
import { cartDataContext } from '../context/cartDataContext'

function Products() {
  const { id } = useParams()
  const { serverUrl } = useContext(authDataContex)
  const { addCart } = useContext(cartDataContext)
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(false)
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedImage, setSelectedImage] = useState('')

  const getProduct = useCallback(async () => {
    try {
      setLoading(true)
      const result = await axios.get(`${serverUrl}/api/product/${id}`)
      setProduct(result.data)
      setSelectedImage(result.data?.image1 || '')
    } catch (error) {
      console.log('get product error ', error)
    } finally {
      setLoading(false)
    }
  }, [id, serverUrl])

  useEffect(() => {
    getProduct()
  }, [getProduct])

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error('Please select size')
      return
    }

    addCart({ ...product, selectedSize })
    toast.success('Added to cart')
    navigate('/cart')
  }

  if (loading) {
    return (
      <div className='w-full min-h-screen pt-[64px] bg-[#f5f8f8] flex items-center justify-center'>
        <div className='w-14 h-14 rounded-full border-4 border-[#d5e2e3] border-t-[#101819] animate-spin'></div>
      </div>
    )
  }

  if (!product) {
    return (
      <main className='w-full min-h-screen pt-[64px] bg-[#f5f8f8] text-[#101819] px-4 sm:px-6 lg:px-10 flex items-center justify-center'>
        <div className='rounded-[8px] bg-white border border-black/5 p-8 text-center shadow-sm'>
          <h1 className='text-[28px] font-black'>Product not found</h1>
          <button
            type='button'
            onClick={() => navigate('/collections')}
            className='mt-5 min-h-[46px] px-6 rounded-[8px] bg-[#101819] text-white font-bold'
          >
            Back to collections
          </button>
        </div>
      </main>
    )
  }

  const images = [product.image1, product.image2, product.image3, product.image4].filter(Boolean)

  return (
    <main className='bg-[#f5f8f8] w-full min-h-screen pt-[64px] pb-[100px] md:pb-12 text-[#101819] overflow-x-hidden'>
      <section className='max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-6 lg:py-9'>
        <button
          type='button'
          onClick={() => navigate('/collections')}
          className='mb-5 min-h-[42px] px-4 rounded-[8px] bg-white border border-black/5 font-bold flex items-center gap-2 shadow-sm hover:border-[#101819] transition-colors'
        >
          <FaArrowLeft />
          Collections
        </button>

        <div className='grid grid-cols-1 lg:grid-cols-[1.04fr_0.96fr] gap-6 lg:gap-10 items-start'>
          <div className='rounded-[8px] bg-white border border-black/5 p-3 sm:p-4 shadow-sm'>
            <div className='grid grid-cols-1 sm:grid-cols-[92px_1fr] gap-3 sm:gap-4'>
              <div className='order-2 sm:order-1 grid grid-cols-4 sm:grid-cols-1 gap-3'>
                {images.map((image, index) => (
                  <button
                    key={image}
                    type='button'
                    onClick={() => setSelectedImage(image)}
                    className={`aspect-square rounded-[8px] border-2 bg-[#f1f6f6] p-2 overflow-hidden transition-colors ${
                      selectedImage === image ? 'border-[#101819]' : 'border-transparent hover:border-[#88d9ee]'
                    }`}
                    aria-label={`Product image ${index + 1}`}
                  >
                    <img src={image} alt={`${product.name} ${index + 1}`} className='w-full h-full object-contain' />
                  </button>
                ))}
              </div>

              <div className='order-1 sm:order-2 min-h-[380px] sm:min-h-[520px] rounded-[8px] bg-[#f1f6f6] flex items-center justify-center p-4 overflow-hidden'>
                <img
                  src={selectedImage || product.image1}
                  alt={product.name}
                  className='w-full h-full max-h-[620px] object-contain'
                />
              </div>
            </div>
          </div>

          <div className='lg:sticky lg:top-[88px]'>
            <div className='rounded-[8px] bg-white border border-black/5 p-5 sm:p-7 shadow-sm'>
              <div className='flex flex-wrap gap-2'>
                <span className='rounded-full bg-[#dff4f5] px-3 py-1 text-[13px] font-bold text-[#101819]'>
                  {product.category}
                </span>
                {product.subCategory && (
                  <span className='rounded-full bg-[#f1f6f6] px-3 py-1 text-[13px] font-bold text-[#607174]'>
                    {product.subCategory}
                  </span>
                )}
                {product.bestseller && (
                  <span className='rounded-full bg-[#101819] px-3 py-1 text-[13px] font-bold text-white'>
                    Bestseller
                  </span>
                )}
              </div>

              <h1 className='mt-5 text-[32px] sm:text-[44px] lg:text-[52px] leading-tight font-black'>
                {product.name}
              </h1>

              <p className='mt-4 text-[32px] sm:text-[38px] font-black text-[#2c737d]'>
                Rs. {product.price}
              </p>

              <p className='mt-5 text-[#607174] text-[15px] sm:text-[17px] leading-8'>
                {product.description}
              </p>

              <div className='mt-7'>
                <div className='flex items-center justify-between gap-3'>
                  <p className='font-black'>Select size</p>
                  {!selectedSize && <p className='text-[13px] font-bold text-[#9b1c1c]'>Required</p>}
                </div>
                <div className='mt-3 flex gap-3 flex-wrap'>
                  {product.sizes?.map((size) => (
                    <button
                      key={size}
                      type='button'
                      onClick={() => setSelectedSize(size)}
                      className={`min-w-[58px] h-[44px] rounded-[8px] border font-black transition-colors ${
                        selectedSize === size
                          ? 'bg-[#101819] text-white border-[#101819]'
                          : 'bg-[#f7fbfb] text-[#101819] border-black/10 hover:border-[#101819]'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div className='mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3'>
                <button
                  className='min-h-[52px] px-6 rounded-[8px] bg-[#101819] text-white font-black hover:bg-[#28464a] transition-colors flex items-center justify-center gap-2'
                  onClick={handleAddToCart}
                  type='button'
                >
                  <FaShoppingCart />
                  Add to Cart
                </button>

                <button
                  className='min-h-[52px] px-6 rounded-[8px] bg-[#88d9ee] text-[#101819] font-black hover:bg-white border border-transparent hover:border-[#101819] transition-colors flex items-center justify-center gap-2'
                  onClick={handleAddToCart}
                  type='button'
                >
                  <FaBolt />
                  Order Now
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>
    </main>
  )
}

export default Products
