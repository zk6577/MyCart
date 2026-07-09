import React, { useCallback, useContext, useEffect, useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { FaEdit, FaSave, FaTimes, FaTrashAlt } from 'react-icons/fa'
import Nav from '../components/Nav'
import Sidebar from '../components/Sidebar'
import { authDataContext } from '../context/authDataContext'

const sizeOptions = ['S', 'M', 'L', 'XL', 'XXL']

const getProductForm = (product) => ({
  name: product.name || '',
  description: product.description || '',
  price: product.price || '',
  category: product.category || 'Men',
  subCategory: product.subCategory || 'TopWear',
  bestseller: Boolean(product.bestseller),
  sizes: Array.isArray(product.sizes) ? product.sizes : [],
})

function Lists() {
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(false)
  const [busyId, setBusyId] = useState('')
  const [editingProduct, setEditingProduct] = useState(null)
  const [editForm, setEditForm] = useState(getProductForm({}))
  const { serverUrl } = useContext(authDataContext)

  const fetchList = useCallback(async () => {
    try {
      setLoading(true)
      const result = await axios.get(`${serverUrl}/api/product/list`)
      setList(Array.isArray(result.data) ? result.data : [])
    } catch (error) {
      console.log(error)
      toast.error('Products could not be loaded')
    } finally {
      setLoading(false)
    }
  }, [serverUrl])

  const openEdit = (product) => {
    setEditingProduct(product)
    setEditForm(getProductForm(product))
  }

  const closeEdit = () => {
    setEditingProduct(null)
    setEditForm(getProductForm({}))
  }

  const handleEditChange = (event) => {
    const { name, value, type, checked } = event.target
    setEditForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const toggleSize = (size) => {
    setEditForm((prev) => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter((item) => item !== size)
        : [...prev.sizes, size],
    }))
  }

  const saveProduct = async (event) => {
    event.preventDefault()

    if (!editingProduct) return

    if (editForm.sizes.length === 0) {
      toast.error('Select at least one size')
      return
    }

    try {
      setBusyId(editingProduct._id)
      await axios.post(
        `${serverUrl}/api/product/update/${editingProduct._id}`,
        editForm,
        { withCredentials: true }
      )
      toast.success('Product updated')
      closeEdit()
      fetchList()
    } catch (error) {
      console.log(error)
      toast.error(error.response?.data?.message || 'Product could not be updated')
    } finally {
      setBusyId('')
    }
  }

  const removeList = async (id) => {
    try {
      setBusyId(id)
      await axios.post(`${serverUrl}/api/product/remove/${id}`, {}, { withCredentials: true })
      toast.success('Product removed')
      fetchList()
    } catch (error) {
      console.log(error)
      toast.error(error.response?.data?.message || 'Product could not be removed')
    } finally {
      setBusyId('')
    }
  }

  useEffect(() => {
    fetchList()
  }, [fetchList])

  return (
    <div className='min-h-screen bg-[#f5f8f8] text-[#101819]'>
      <Nav />
      <Sidebar />

      <main className='pt-[64px] pl-[82px] lg:pl-[260px]'>
        <div className='px-4 sm:px-6 lg:px-8 py-6 lg:py-8'>
          <div className='flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4'>
            <div>
              <p className='text-[#2c737d] font-bold'>Inventory</p>
              <h1 className='mt-2 text-[30px] sm:text-[42px] font-black'>All Products</h1>
            </div>
            <p className='w-fit rounded-full bg-white border border-black/5 px-4 py-2 font-bold shadow-sm'>
              {list.length} item{list.length === 1 ? '' : 's'}
            </p>
          </div>

          {loading ? (
            <div className='w-full min-h-[320px] flex items-center justify-center'>
              <div className='w-14 h-14 rounded-full border-4 border-[#d5e2e3] border-t-[#101819] animate-spin'></div>
            </div>
          ) : list.length === 0 ? (
            <div className='mt-6 rounded-[8px] bg-white border border-black/5 p-8 text-[#607174] shadow-sm'>
              No product available
            </div>
          ) : (
            <div className='mt-6 grid grid-cols-1 xl:grid-cols-2 gap-4'>
              {list.map((item) => (
                <article key={item._id} className='rounded-[8px] bg-white border border-black/5 p-4 shadow-sm flex flex-col sm:flex-row gap-4'>
                  <div className='w-full sm:w-[128px] h-[150px] sm:h-[128px] rounded-[8px] bg-[#f1f6f6] flex items-center justify-center p-3 shrink-0'>
                    <img
                      src={item.image1 || item.image2 || item.image3}
                      alt={item.name}
                      className='w-full h-full object-contain'
                    />
                  </div>

                  <div className='min-w-0 flex-1 flex flex-col justify-between gap-4'>
                    <div>
                      <h2 className='text-[18px] font-black leading-snug'>{item.name}</h2>
                      <p className='mt-1 text-[#607174]'>{item.category} / {item.subCategory}</p>
                      <p className='mt-2 text-[20px] font-black'>Rs. {item.price}</p>
                      <p className='mt-2 text-[13px] font-semibold text-[#607174]'>
                        Sizes: {Array.isArray(item.sizes) && item.sizes.length > 0 ? item.sizes.join(', ') : 'Not set'}
                      </p>
                    </div>
                    <div className='flex flex-wrap items-center justify-between gap-3'>
                      {item.bestseller && (
                        <span className='rounded-full bg-[#dff4f5] px-3 py-1 text-[13px] font-bold text-[#101819]'>
                          Bestseller
                        </span>
                      )}
                      <div className='flex flex-wrap gap-2'>
                        <button
                          type='button'
                          className='min-h-[40px] px-4 rounded-[8px] bg-[#101819] text-white font-bold flex items-center gap-2 hover:bg-[#28464a] transition-colors'
                          onClick={() => openEdit(item)}
                        >
                          <FaEdit />
                          Edit
                        </button>
                        <button
                          type='button'
                          className='min-h-[40px] px-4 rounded-[8px] bg-[#ffe9e9] text-[#9b1c1c] font-bold flex items-center gap-2 hover:bg-[#ffd8d8] transition-colors disabled:opacity-60'
                          onClick={() => removeList(item._id)}
                          disabled={busyId === item._id}
                        >
                          <FaTrashAlt />
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </main>

      {editingProduct && (
        <div className='fixed inset-0 z-50 bg-black/50 px-4 py-6 overflow-y-auto'>
          <form onSubmit={saveProduct} className='w-full max-w-[760px] mx-auto rounded-[8px] bg-white border border-black/5 p-5 sm:p-6 shadow-2xl'>
            <div className='flex items-start justify-between gap-4'>
              <div>
                <p className='text-[#2c737d] font-bold'>Edit product</p>
                <h2 className='mt-1 text-[28px] sm:text-[34px] font-black'>Update Details</h2>
              </div>
              <button
                type='button'
                className='w-[42px] h-[42px] rounded-[8px] bg-[#f1f6f6] flex items-center justify-center text-[#101819]'
                onClick={closeEdit}
                aria-label='Close edit product form'
              >
                <FaTimes />
              </button>
            </div>

            <div className='mt-5 grid grid-cols-1 lg:grid-cols-[150px_1fr] gap-5'>
              <div className='w-full h-[150px] rounded-[8px] bg-[#f1f6f6] p-3 flex items-center justify-center'>
                <img
                  src={editingProduct.image1 || editingProduct.image2 || editingProduct.image3}
                  alt={editingProduct.name}
                  className='w-full h-full object-contain'
                />
              </div>

              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                <div className='sm:col-span-2'>
                  <label htmlFor='name' className='block text-[14px] font-bold text-[#607174] mb-2'>Product name</label>
                  <input
                    id='name'
                    name='name'
                    value={editForm.name}
                    onChange={handleEditChange}
                    className='w-full h-[48px] rounded-[8px] border border-black/10 bg-[#f7fbfb] px-4 outline-none focus:ring-2 focus:ring-[#88d9ee]'
                    required
                  />
                </div>

                <div className='sm:col-span-2'>
                  <label htmlFor='description' className='block text-[14px] font-bold text-[#607174] mb-2'>Description</label>
                  <textarea
                    id='description'
                    name='description'
                    value={editForm.description}
                    onChange={handleEditChange}
                    className='w-full min-h-[110px] rounded-[8px] border border-black/10 bg-[#f7fbfb] px-4 py-3 outline-none resize-none focus:ring-2 focus:ring-[#88d9ee]'
                    required
                  />
                </div>

                <div>
                  <label htmlFor='price' className='block text-[14px] font-bold text-[#607174] mb-2'>Price</label>
                  <input
                    id='price'
                    name='price'
                    type='number'
                    value={editForm.price}
                    onChange={handleEditChange}
                    className='w-full h-[48px] rounded-[8px] border border-black/10 bg-[#f7fbfb] px-4 outline-none focus:ring-2 focus:ring-[#88d9ee]'
                    required
                  />
                </div>

                <div>
                  <label htmlFor='category' className='block text-[14px] font-bold text-[#607174] mb-2'>Category</label>
                  <select
                    id='category'
                    name='category'
                    value={editForm.category}
                    onChange={handleEditChange}
                    className='w-full h-[48px] rounded-[8px] border border-black/10 bg-[#f7fbfb] px-4 outline-none focus:ring-2 focus:ring-[#88d9ee]'
                  >
                    <option value='Men'>Men</option>
                    <option value='Women'>Women</option>
                    <option value='Kids'>Kids</option>
                  </select>
                </div>

                <div>
                  <label htmlFor='subCategory' className='block text-[14px] font-bold text-[#607174] mb-2'>Sub category</label>
                  <select
                    id='subCategory'
                    name='subCategory'
                    value={editForm.subCategory}
                    onChange={handleEditChange}
                    className='w-full h-[48px] rounded-[8px] border border-black/10 bg-[#f7fbfb] px-4 outline-none focus:ring-2 focus:ring-[#88d9ee]'
                  >
                    <option value='TopWear'>TopWear</option>
                    <option value='BottomWear'>BottomWear</option>
                    <option value='WinterWear'>WinterWear</option>
                  </select>
                </div>

                <label htmlFor='bestseller' className='min-h-[48px] rounded-[8px] border border-black/10 bg-[#f7fbfb] px-4 flex items-center gap-3 font-bold text-[#607174]'>
                  <input
                    id='bestseller'
                    name='bestseller'
                    type='checkbox'
                    checked={editForm.bestseller}
                    onChange={handleEditChange}
                    className='w-[20px] h-[20px] accent-[#101819]'
                  />
                  Bestseller
                </label>
              </div>
            </div>

            <div className='mt-5'>
              <p className='text-[14px] font-bold text-[#607174] mb-2'>Available sizes</p>
              <div className='flex flex-wrap gap-3'>
                {sizeOptions.map((size) => (
                  <button
                    key={size}
                    type='button'
                    onClick={() => toggleSize(size)}
                    className={`min-w-[58px] h-[44px] rounded-[8px] border font-black transition-colors ${
                      editForm.sizes.includes(size)
                        ? 'bg-[#101819] text-white border-[#101819]'
                        : 'bg-[#f7fbfb] text-[#101819] border-black/10 hover:border-[#101819]'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className='mt-6 flex flex-col sm:flex-row sm:justify-end gap-3'>
              <button
                type='button'
                className='min-h-[48px] px-5 rounded-[8px] border border-black/10 bg-white font-bold text-[#101819]'
                onClick={closeEdit}
              >
                Cancel
              </button>
              <button
                type='submit'
                disabled={busyId === editingProduct._id}
                className='min-h-[48px] px-5 rounded-[8px] bg-[#101819] text-white font-black flex items-center justify-center gap-2 disabled:opacity-60'
              >
                <FaSave />
                {busyId === editingProduct._id ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}

export default Lists
