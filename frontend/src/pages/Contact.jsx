import React, { useContext, useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { FaClock, FaHeadset, FaPaperPlane, FaPhoneAlt, FaRegEnvelope } from 'react-icons/fa'
import logo from '../assets/logo.png'
import { authDataContex } from '../context/authDataContext'

const contactOptions = [
  {
    icon: FaRegEnvelope,
    title: 'Email',
    value: 'khanariz541@gmail.com',
    text: 'For order help, product questions, and account support.',
  },
  {
    icon: FaPhoneAlt,
    title: 'Phone',
    value: '+91 8447864304',
    text: 'Talk to support during regular business hours.',
  },

]

function Contact() {
  const { serverUrl } = useContext(authDataContex)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  })

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    try {
      setIsSubmitting(true)
      const result = await axios.post(`${serverUrl}/api/contact/send`, formData)

      toast.success(result.data.message || 'Thanks! We will contact you soon.')
      setFormData({ name: '', email: '', message: '' })
    } catch (error) {
      console.log('Contact form error', error)
      toast.error(error.response?.data?.message || 'Message could not be sent')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full min-h-screen pt-[90px] pb-[120px] md:pb-14 px-4 sm:px-8 lg:px-14 bg-gradient-to-l from-[#141414] to-[#0c2025] text-white overflow-x-hidden">
      <section className="grid grid-cols-1 lg:grid-cols-[0.95fr_1.05fr] gap-8 lg:gap-12 items-start">
        <div className="flex flex-col gap-7">
          <div className="flex items-center gap-3">
            <img src={logo} alt="MyCart logo" className="w-[42px] h-[42px] object-contain" />
            <span className="text-[#88d9ee] font-semibold tracking-wide">MyCart Support</span>
          </div>

          <div>
            <h1 className="text-[34px] sm:text-[46px] lg:text-[56px] leading-tight font-bold">
              Need help with your order?
            </h1>
            <p className="mt-5 max-w-[650px] text-white/75 text-[16px] sm:text-[18px] leading-8">
              Send your question and the MyCart team will help with products, checkout, cart issues, and order updates.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
            <div className="rounded-[8px] border border-white/10 bg-white/[0.06] p-5 flex gap-4">
              <div className="w-[44px] h-[44px] rounded-[8px] bg-[#88d9ee] text-black flex items-center justify-center text-[22px] shrink-0">
                <FaHeadset />
              </div>
              <div>
                <h2 className="text-[20px] font-semibold">Customer care</h2>
                <p className="mt-2 text-white/70 leading-7">Support is ready for shopping, payment, cart, and order questions.</p>
              </div>
            </div>
            <div className="rounded-[8px] border border-white/10 bg-white/[0.06] p-5 flex gap-4">
              <div className="w-[44px] h-[44px] rounded-[8px] bg-[#88d9ee] text-black flex items-center justify-center text-[22px] shrink-0">
                <FaClock />
              </div>
              <div>
                <h2 className="text-[20px] font-semibold">Response time</h2>
                <p className="mt-2 text-white/70 leading-7">Most messages are answered within one business day.</p>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="rounded-[8px] border border-white/10 bg-black/25 p-5 sm:p-7 shadow-xl shadow-black/25">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-[14px] text-white/70 mb-2">Name</label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="Your name"
                className="w-full h-[48px] rounded-[8px] border border-white/15 bg-white/[0.08] px-4 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[#88d9ee]"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-[14px] text-white/70 mb-2">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full h-[48px] rounded-[8px] border border-white/15 bg-white/[0.08] px-4 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[#88d9ee]"
              />
            </div>
          </div>

          <div className="mt-4">
            <label htmlFor="message" className="block text-[14px] text-white/70 mb-2">Message</label>
            <textarea
              id="message"
              name="message"
              required
              rows="7"
              value={formData.message}
              onChange={handleChange}
              placeholder="Tell us how we can help"
              className="w-full rounded-[8px] border border-white/15 bg-white/[0.08] px-4 py-3 text-white placeholder:text-white/40 resize-none focus:outline-none focus:ring-2 focus:ring-[#88d9ee]"
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-5 w-full sm:w-auto h-[48px] px-7 rounded-[8px] bg-[#88d9ee] text-black font-semibold flex items-center justify-center gap-2 hover:bg-white transition-colors disabled:cursor-not-allowed disabled:opacity-70"
          >
            <FaPaperPlane />
            {isSubmitting ? 'Sending...' : 'Send message'}
          </button>
        </form>
      </section>

      <section className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-5">
        {contactOptions.map((item) => (
          <div key={item.title} className="rounded-[8px] border border-white/10 bg-white/[0.06] p-5">
            <div className="w-[42px] h-[42px] rounded-[8px] bg-[#88d9ee] text-black flex items-center justify-center text-[21px]">
              {React.createElement(item.icon)}
            </div>
            <h2 className="mt-5 text-[20px] font-semibold">{item.title}</h2>
            <p className="mt-2 text-[#88d9ee] font-semibold break-words">{item.value}</p>
            <p className="mt-3 text-white/70 leading-7">{item.text}</p>
          </div>
        ))}
      </section>
    </div>
  )
}

export default Contact
