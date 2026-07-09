import React, { useCallback, useContext, useEffect, useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { FaCheck, FaEnvelopeOpenText, FaTrashAlt, FaUndo } from 'react-icons/fa'
import Nav from '../components/Nav'
import Sidebar from '../components/Sidebar'
import { authDataContext } from '../context/authDataContext'

const formatDate = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleString()
}

function ContactMsg() {
  const { serverUrl } = useContext(authDataContext)
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [busyId, setBusyId] = useState('')

  const showMessage = useCallback(async () => {
    try {
      setLoading(true)
      const result = await axios.get(`${serverUrl}/api/contact/allmsg`, {
        withCredentials: true,
      })
      setMessages(Array.isArray(result.data.messages) ? result.data.messages : [])
    } catch (error) {
      console.log('Error in the Msg', error)
      toast.error('Messages could not be loaded')
    } finally {
      setLoading(false)
    }
  }, [serverUrl])

  const changeMessageStatus = async (id, status) => {
    try {
      setBusyId(id)
      await axios.post(
        `${serverUrl}/api/contact/status/${id}`,
        { status },
        { withCredentials: true }
      )
      setMessages((prev) => prev.map((item) => (item._id === id ? { ...item, status } : item)))
      toast.success(status === 'read' ? 'Message marked as read' : 'Message marked as new')
    } catch (error) {
      console.log('Message status error', error)
      toast.error(error.response?.data?.message || 'Message status could not be updated')
    } finally {
      setBusyId('')
    }
  }

  const deleteMessage = async (id) => {
    try {
      setBusyId(id)
      await axios.post(`${serverUrl}/api/contact/delete/${id}`, {}, { withCredentials: true })
      setMessages((prev) => prev.filter((item) => item._id !== id))
      toast.success('Message deleted')
    } catch (error) {
      console.log('Delete message error', error)
      toast.error(error.response?.data?.message || 'Message could not be deleted')
    } finally {
      setBusyId('')
    }
  }

  const unreadCount = messages.filter((item) => item.status !== 'read').length

  useEffect(() => {
    showMessage()
  }, [showMessage])

  return (
    <div className='min-h-screen bg-[#f5f8f8] text-[#101819]'>
      <Nav />
      <Sidebar />

      <main className='pt-[64px] pl-[82px] lg:pl-[260px]'>
        <div className='px-4 sm:px-6 lg:px-8 py-6 lg:py-8'>
          <div className='flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4'>
            <div>
              <p className='text-[#2c737d] font-bold'>Support</p>
              <h1 className='mt-2 text-[30px] sm:text-[42px] font-black'>Contact Messages</h1>
              <p className='mt-2 text-[#607174]'>Customer messages submitted from the contact page.</p>
            </div>
            <div className='flex flex-wrap gap-2'>
              <p className='w-fit rounded-full bg-white border border-black/5 px-4 py-2 font-bold shadow-sm'>
                {messages.length} message{messages.length === 1 ? '' : 's'}
              </p>
              <p className='w-fit rounded-full bg-[#101819] text-white px-4 py-2 font-bold shadow-sm'>
                {unreadCount} unread
              </p>
            </div>
          </div>

          {loading ? (
            <div className='w-full min-h-[320px] flex items-center justify-center'>
              <div className='w-14 h-14 rounded-full border-4 border-[#d5e2e3] border-t-[#101819] animate-spin'></div>
            </div>
          ) : messages.length === 0 ? (
            <div className='mt-6 rounded-[8px] bg-white border border-black/5 p-8 text-[#607174] shadow-sm'>
              No contact messages available
            </div>
          ) : (
            <div className='mt-6 grid grid-cols-1 xl:grid-cols-2 gap-4'>
              {messages.map((item) => {
                const isRead = item.status === 'read'

                return (
                  <article key={item._id} className='rounded-[8px] bg-white border border-black/5 p-5 shadow-sm'>
                    <div className='flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4'>
                      <div className='flex gap-3 min-w-0'>
                        <div className={`w-[44px] h-[44px] rounded-[8px] flex items-center justify-center text-[20px] shrink-0 ${
                          isRead ? 'bg-[#f1f6f6] text-[#607174]' : 'bg-[#dff4f5] text-[#101819]'
                        }`}>
                          <FaEnvelopeOpenText />
                        </div>
                        <div className='min-w-0'>
                          <h2 className='text-[20px] font-black break-words'>{item.name}</h2>
                          <p className='text-[#607174] break-words'>{item.email}</p>
                        </div>
                      </div>
                      <span className='text-[13px] text-[#607174] shrink-0'>{formatDate(item.createdAt)}</span>
                    </div>

                    <p className='mt-5 text-[#263437] leading-7 whitespace-pre-wrap break-words'>
                      {item.message}
                    </p>

                    <div className='mt-5 flex flex-wrap items-center justify-between gap-3'>
                      <div className={`rounded-full px-3 py-1 text-[13px] font-bold w-fit ${
                        isRead ? 'bg-[#f1f6f6] text-[#607174]' : 'bg-[#dff4f5] text-[#2c737d]'
                      }`}>
                        Status: {item.status || 'new'}
                      </div>

                      <div className='flex flex-wrap gap-2'>
                        <button
                          type='button'
                          className='min-h-[38px] px-4 rounded-[8px] bg-[#101819] text-white font-bold flex items-center gap-2 disabled:opacity-60'
                          onClick={() => changeMessageStatus(item._id, isRead ? 'new' : 'read')}
                          disabled={busyId === item._id}
                        >
                          {isRead ? <FaUndo /> : <FaCheck />}
                          {isRead ? 'Mark new' : 'Mark read'}
                        </button>
                        <button
                          type='button'
                          className='min-h-[38px] px-4 rounded-[8px] bg-[#ffe9e9] text-[#9b1c1c] font-bold flex items-center gap-2 disabled:opacity-60'
                          onClick={() => deleteMessage(item._id)}
                          disabled={busyId === item._id}
                        >
                          <FaTrashAlt />
                          Delete
                        </button>
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default ContactMsg
