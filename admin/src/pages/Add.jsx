import React, { useContext, useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import upload from '../assets/Upload.png'
import Nav from '../components/Nav'
import Sidebar from '../components/Sidebar'
import { authDataContext } from '../context/authDataContext'

const sizeOptions = ['S', 'M', 'L', 'XL', 'XXL']

function Add() {
  const [image1, setImage1] = useState(false)
  const [image2, setImage2] = useState(false)
  const [image3, setImage3] = useState(false)
  const [image4, setImage4] = useState(false)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [category, setCategory] = useState('Men')
  const [subcategory, setSubCategory] = useState('TopWear')
  const [bestSeller, setBestSeller] = useState(false)
  const [sizes, setSizes] = useState([])
  const [loading, setLoading] = useState(false)
  const { serverUrl } = useContext(authDataContext)

  const imageInputs = [
    { id: 'image1', label: 'Front image', file: image1, setFile: setImage1 },
    { id: 'image2', label: 'Back image', file: image2, setFile: setImage2 },
    { id: 'image3', label: 'Detail image', file: image3, setFile: setImage3 },
    { id: 'image4', label: 'Extra image', file: image4, setFile: setImage4 },
  ]

  const toggleSize = (size) => {
    setSizes((prev) => (prev.includes(size) ? prev.filter((item) => item !== size) : [...prev, size]))
  }

  const handleAddProduct = async (e) => {
    e.preventDefault()

    try {
      setLoading(true)
      const formData = new FormData()
      formData.append('name', name)
      formData.append('description', description)
      formData.append('price', price)
      formData.append('category', category)
      formData.append('subCategory', subcategory)
      formData.append('bestseller', bestSeller)
      formData.append('sizes', JSON.stringify(sizes))
      formData.append('image1', image1)
      formData.append('image2', image2)
      formData.append('image3', image3)
      formData.append('image4', image4)

      await axios.post(`${serverUrl}/api/product/addproduct`, formData, { withCredentials: true })
      toast.success('Product added')
      setName('')
      setDescription('')
      setImage1(false)
      setImage2(false)
      setImage3(false)
      setImage4(false)
      setPrice('')
      setBestSeller(false)
      setCategory('Men')
      setSubCategory('TopWear')
      setSizes([])
    } catch (error) {
      console.log(error)
      toast.error(error.response?.data?.message || 'Product could not be added')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='min-h-screen bg-[#f5f8f8] text-[#101819]'>
      <Nav />
      <Sidebar />

      <main className='pt-[64px] pl-[82px] lg:pl-[260px]'>
        <form onSubmit={handleAddProduct} className='px-4 sm:px-6 lg:px-8 py-6 lg:py-8 max-w-[1180px]'>
          <div className='mb-6'>
            <p className='text-[#2c737d] font-bold'>Inventory</p>
            <h1 className='mt-2 text-[30px] sm:text-[42px] font-black'>Add Product</h1>
            <p className='mt-2 text-[#607174]'>Create a complete product listing for the MyCart store.</p>
          </div>

          <section className='rounded-[8px] bg-white border border-black/5 p-5 sm:p-6 shadow-sm'>
            <h2 className='text-[20px] font-black'>Product images</h2>
            <div className='mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4'>
              {imageInputs.map((item) => (
                <label key={item.id} htmlFor={item.id} className='cursor-pointer'>
                  <div className='aspect-square rounded-[8px] border-2 border-dashed border-[#cbd8da] bg-[#f7fbfb] p-3 flex items-center justify-center hover:border-[#2c737d] transition-colors'>
                    <img
                      src={item.file ? URL.createObjectURL(item.file) : upload}
                      alt={item.label}
                      className='w-full h-full object-contain rounded-[8px]'
                    />
                  </div>
                  <p className='mt-2 text-[13px] font-bold text-[#607174]'>{item.label}</p>
                  <input
                    type='file'
                    id={item.id}
                    hidden
                    onChange={(e) => item.setFile(e.target.files[0])}
                    required
                  />
                </label>
              ))}
            </div>
          </section>

          <section className='mt-5 rounded-[8px] bg-white border border-black/5 p-5 sm:p-6 shadow-sm'>
            <h2 className='text-[20px] font-black'>Product details</h2>
            <div className='mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4'>
              <div className='lg:col-span-2'>
                <label htmlFor='name' className='block text-[14px] font-bold text-[#607174] mb-2'>Product name</label>
                <input
                  id='name'
                  type='text'
                  placeholder='Type product name'
                  className='w-full h-[48px] rounded-[8px] border border-black/10 bg-[#f7fbfb] px-4 outline-none focus:ring-2 focus:ring-[#88d9ee]'
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                  required
                />
              </div>

              <div className='lg:col-span-2'>
                <label htmlFor='description' className='block text-[14px] font-bold text-[#607174] mb-2'>Description</label>
                <textarea
                  id='description'
                  placeholder='Write a short product description'
                  className='w-full min-h-[130px] rounded-[8px] border border-black/10 bg-[#f7fbfb] px-4 py-3 outline-none resize-none focus:ring-2 focus:ring-[#88d9ee]'
                  onChange={(e) => setDescription(e.target.value)}
                  value={description}
                  required
                />
              </div>

              <div>
                <label htmlFor='category' className='block text-[14px] font-bold text-[#607174] mb-2'>Category</label>
                <select
                  id='category'
                  className='w-full h-[48px] rounded-[8px] border border-black/10 bg-[#f7fbfb] px-4 outline-none focus:ring-2 focus:ring-[#88d9ee]'
                  onChange={(e) => setCategory(e.target.value)}
                  value={category}
                  required
                >
                  <option value='Men'>Men</option>
                  <option value='Women'>Women</option>
                  <option value='Kids'>Kids</option>
                </select>
              </div>

              <div>
                <label htmlFor='subcategory' className='block text-[14px] font-bold text-[#607174] mb-2'>Sub category</label>
                <select
                  id='subcategory'
                  className='w-full h-[48px] rounded-[8px] border border-black/10 bg-[#f7fbfb] px-4 outline-none focus:ring-2 focus:ring-[#88d9ee]'
                  onChange={(e) => setSubCategory(e.target.value)}
                  value={subcategory}
                  required
                >
                  <option value='TopWear'>TopWear</option>
                  <option value='BottomWear'>BottomWear</option>
                  <option value='WinterWear'>WinterWear</option>
                </select>
              </div>

              <div>
                <label htmlFor='price' className='block text-[14px] font-bold text-[#607174] mb-2'>Price</label>
                <input
                  id='price'
                  type='number'
                  placeholder='2000'
                  className='w-full h-[48px] rounded-[8px] border border-black/10 bg-[#f7fbfb] px-4 outline-none focus:ring-2 focus:ring-[#88d9ee]'
                  onChange={(e) => setPrice(e.target.value)}
                  value={price}
                  required
                />
              </div>

              <div className='flex items-end'>
                <label htmlFor='bestseller' className='min-h-[48px] w-full rounded-[8px] border border-black/10 bg-[#f7fbfb] px-4 flex items-center gap-3 font-bold text-[#607174]'>
                  <input
                    type='checkbox'
                    id='bestseller'
                    className='w-[20px] h-[20px] accent-[#101819]'
                    checked={bestSeller}
                    onChange={() => setBestSeller((prev) => !prev)}
                  />
                  Add to bestseller
                </label>
              </div>
            </div>
          </section>

          <section className='mt-5 rounded-[8px] bg-white border border-black/5 p-5 sm:p-6 shadow-sm'>
            <h2 className='text-[20px] font-black'>Available sizes</h2>
            <div className='mt-4 flex flex-wrap gap-3'>
              {sizeOptions.map((size) => (
                <button
                  key={size}
                  type='button'
                  onClick={() => toggleSize(size)}
                  className={`min-w-[58px] h-[44px] rounded-[8px] border font-black transition-colors ${
                    sizes.includes(size)
                      ? 'bg-[#101819] text-white border-[#101819]'
                      : 'bg-[#f7fbfb] text-[#101819] border-black/10 hover:border-[#101819]'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </section>

          <button
            type='submit'
            disabled={loading}
            className='mt-6 min-h-[52px] px-7 rounded-[8px] bg-[#101819] text-white font-black hover:bg-[#28464a] transition-colors disabled:opacity-60'
          >
            {loading ? 'Adding...' : 'Add Product'}
          </button>
        </form>
      </main>
    </div>
  )
}

export default Add
