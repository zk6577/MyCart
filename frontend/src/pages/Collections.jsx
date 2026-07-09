import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import { FaArrowRight, FaFilter, FaSearch, FaSlidersH, FaStar } from 'react-icons/fa'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { authDataContex } from '../context/authDataContext'

const categories = ['', 'Men', 'Women', 'Kids']
const subCategories = ['', 'TopWear', 'BottomWear', 'WinterWear']
const sortOptions = [
  { label: 'Default', value: '' },
  { label: 'Price: low to high', value: 'low-high' },
  { label: 'Price: high to low', value: 'high-low' },
  { label: 'Newest', value: 'newest' },
]

function Collections() {
  const { serverUrl } = useContext(authDataContex)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [searchParams] = useSearchParams()
  const search = searchParams.get('search') || ''
  const [category, setCategory] = useState('')
  const [subCategory, setSubCategory] = useState('')
  const [bestseller, setBestSeller] = useState(false)
  const [sort, setSort] = useState('')
  const navigate = useNavigate()

  const activeFiltersCount = useMemo(
    () => [search, category, subCategory, bestseller, sort].filter(Boolean).length,
    [search, category, subCategory, bestseller, sort]
  )

  const getProducts = useCallback(async () => {
    try {
      setLoading(true)
      const params = {
        ...(search && { search }),
        ...(sort && { sort }),
        ...(bestseller && { bestseller: 'true' }),
        ...(category && { category }),
        ...(subCategory && { subCategory }),
      }
      const result = await axios.get(`${serverUrl}/api/product/list`, { params })
      setProducts(Array.isArray(result.data) ? result.data : [])
    } catch (error) {
      console.log('Get products Error ', error)
    } finally {
      setLoading(false)
    }
  }, [serverUrl, search, sort, bestseller, category, subCategory])

  const handleProducts = (productId) => {
    navigate(`/product/${productId}`)
  }

  const clearFilters = () => {
    setCategory('')
    setSubCategory('')
    setBestSeller(false)
    setSort('')
    setShowFilters(false)
    navigate('/collections')
  }

  useEffect(() => {
    getProducts()
  }, [getProducts])

  return (
    <main className='w-full min-h-screen pt-[64px] pb-[100px] md:pb-12 bg-[#f5f8f8] text-[#101819] overflow-x-hidden'>
      <section className='bg-[#101819] text-white'>
        <div className='max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-8 sm:py-10 lg:py-12'>
          <div>
            <div className='w-fit rounded-full bg-white/10 border border-white/10 px-4 py-2 text-[13px] font-bold text-[#88d9ee]'>
              MyCart fashion store
            </div>
            <h1 className='mt-5 text-[36px] sm:text-[48px] lg:text-[60px] leading-tight font-black'>
              Shop Collections
            </h1>
            <p className='mt-4 max-w-[680px] text-white/70 text-[16px] sm:text-[18px] leading-8'>
              Browse fresh styles by category, price, and bestseller picks.
            </p>

            <div className='mt-5 flex flex-wrap gap-2'>
              {search && (
                <span className='rounded-full bg-white text-[#101819] px-4 py-2 text-[13px] font-bold flex items-center gap-2'>
                  <FaSearch />
                  {search}
                </span>
              )}
              {activeFiltersCount > 0 && (
                <span className='rounded-full bg-[#88d9ee] text-[#101819] px-4 py-2 text-[13px] font-bold'>
                  {activeFiltersCount} active filter{activeFiltersCount === 1 ? '' : 's'}
                </span>
              )}
            </div>
          </div>

        </div>
      </section>

      <section className='max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-6 lg:py-8'>
        <div className='flex flex-col lg:flex-row gap-5 lg:items-start'>
          <aside className='lg:sticky lg:top-[84px] lg:w-[292px] shrink-0'>
            <button
              type='button'
              className='lg:hidden w-full min-h-[48px] rounded-[8px] bg-[#101819] text-white font-bold flex items-center justify-center gap-3'
              onClick={() => setShowFilters((prev) => !prev)}
            >
              <FaSlidersH />
              Filters
              {activeFiltersCount > 0 && (
                <span className='min-w-[22px] h-[22px] rounded-full bg-[#88d9ee] text-[#101819] text-[12px] flex items-center justify-center'>
                  {activeFiltersCount}
                </span>
              )}
            </button>

            <div className={`${showFilters ? 'block' : 'hidden'} lg:block mt-3 lg:mt-0 rounded-[8px] bg-white border border-black/5 shadow-sm p-4`}>
              <div className='flex items-center justify-between gap-3'>
                <h2 className='text-[20px] font-black flex items-center gap-2'>
                  <FaFilter className='text-[#2c737d]' />
                  Filters
                </h2>
                <button
                  type='button'
                  onClick={clearFilters}
                  className='text-[14px] font-bold text-[#2c737d] hover:text-[#101819]'
                >
                  Clear
                </button>
              </div>

              <div className='mt-5 flex flex-col gap-5'>
                <div>
                  <label htmlFor='category' className='block text-[14px] font-bold text-[#607174] mb-2'>Category</label>
                  <div className='grid grid-cols-2 gap-2'>
                    {categories.map((item) => (
                      <button
                        key={item || 'All'}
                        type='button'
                        onClick={() => setCategory(item)}
                        className={`min-h-[42px] rounded-[8px] border px-3 font-bold transition-colors ${
                          category === item
                            ? 'bg-[#101819] text-white border-[#101819]'
                            : 'bg-[#f7fbfb] text-[#101819] border-black/10 hover:border-[#101819]'
                        }`}
                      >
                        {item || 'All'}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label htmlFor='subCategory' className='block text-[14px] font-bold text-[#607174] mb-2'>Sub category</label>
                  <select
                    id='subCategory'
                    value={subCategory}
                    onChange={(e) => setSubCategory(e.target.value)}
                    className='w-full h-[46px] rounded-[8px] border border-black/10 bg-[#f7fbfb] px-3 text-[#101819] outline-none focus:ring-2 focus:ring-[#88d9ee]'
                  >
                    {subCategories.map((item) => (
                      <option key={item || 'all-sub'} value={item}>
                        {item || 'All sub categories'}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor='sort' className='block text-[14px] font-bold text-[#607174] mb-2'>Sort</label>
                  <select
                    id='sort'
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    className='w-full h-[46px] rounded-[8px] border border-black/10 bg-[#f7fbfb] px-3 text-[#101819] outline-none focus:ring-2 focus:ring-[#88d9ee]'
                  >
                    {sortOptions.map((item) => (
                      <option key={item.label} value={item.value}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </div>

                <label htmlFor='bestseller' className='min-h-[48px] rounded-[8px] border border-black/10 bg-[#f7fbfb] px-4 flex items-center gap-3 font-bold text-[#101819]'>
                  <input
                    id='bestseller'
                    type='checkbox'
                    checked={bestseller}
                    onChange={() => setBestSeller((prev) => !prev)}
                    className='w-[20px] h-[20px] accent-[#101819]'
                  />
                  Bestseller only
                </label>
              </div>
            </div>
          </aside>

          <div className='flex-1 min-w-0'>
            <div className='mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3'>
              <div>
                <h2 className='text-[24px] sm:text-[28px] font-black'>Latest Products</h2>
                <p className='text-[#607174]'>
                  {loading ? 'Loading products...' : `${products.length} product${products.length === 1 ? '' : 's'} available`}
                </p>
              </div>
              <button
                type='button'
                onClick={() => navigate('/contact')}
                className='w-full sm:w-auto min-h-[44px] px-5 rounded-[8px] border border-black/10 bg-white font-bold text-[#101819] hover:border-[#101819] transition-colors'
              >
                Need help?
              </button>
            </div>

            {loading && (
              <div className='w-full min-h-[360px] rounded-[8px] bg-white border border-black/5 flex items-center justify-center'>
                <div className='w-14 h-14 rounded-full border-4 border-[#d5e2e3] border-t-[#101819] animate-spin'></div>
              </div>
            )}

            {!loading && products.length === 0 && (
              <div className='rounded-[8px] bg-white border border-black/5 shadow-sm p-8 sm:p-10 text-center'>
                <div className='w-[58px] h-[58px] rounded-full bg-[#dff4f5] text-[#101819] flex items-center justify-center mx-auto'>
                  <FaSearch className='text-[22px]' />
                </div>
                <h3 className='mt-5 text-[24px] font-black'>No product found</h3>
                <p className='mt-2 text-[#607174]'>Try clearing filters or searching another product name.</p>
                <button
                  type='button'
                  onClick={clearFilters}
                  className='mt-5 min-h-[46px] px-6 rounded-[8px] bg-[#101819] text-white font-bold'
                >
                  Clear filters
                </button>
              </div>
            )}

            {!loading && products.length > 0 && (
              <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-5'>
                {products.map((item) => {
                  const image = item.image1 || item.image2 || item.image3 || item.image4

                  return (
                    <article
                      key={item._id}
                      className='group bg-white border border-black/5 shadow-sm rounded-[8px] overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl'
                      onClick={() => handleProducts(item._id)}
                    >
                      <div className='relative aspect-[4/4.6] bg-[#f1f6f6] flex items-center justify-center p-4 overflow-hidden'>
                        {item.bestseller && (
                          <span className='absolute top-3 left-3 z-10 rounded-full bg-[#101819] text-white px-3 py-1 text-[12px] font-bold flex items-center gap-1'>
                            <FaStar className='text-[#88d9ee]' />
                            Bestseller
                          </span>
                        )}
                        <img
                          src={image}
                          alt={item.name}
                          className='w-full h-full object-contain group-hover:scale-105 transition-transform duration-500'
                        />
                      </div>

                      <div className='p-4'>
                        <div className='flex items-start justify-between gap-3'>
                          <div className='min-w-0'>
                            <h3 className='text-[17px] sm:text-[18px] font-black leading-snug min-h-[46px]'>
                              {item.name}
                            </h3>
                            <p className='text-[14px] text-[#607174] mt-1'>
                              {item.category} / {item.subCategory}
                            </p>
                          </div>
                        </div>

                        <div className='mt-4 flex items-center justify-between gap-3'>
                          <p className='text-[20px] font-black'>Rs. {item.price}</p>
                          <span className='w-[38px] h-[38px] rounded-full bg-[#dff4f5] text-[#101819] flex items-center justify-center group-hover:bg-[#101819] group-hover:text-white transition-colors'>
                            <FaArrowRight />
                          </span>
                        </div>
                      </div>
                    </article>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  )
}

export default Collections
