import React from 'react'
import { useNavigate } from 'react-router-dom'
import { FaShoppingBag } from 'react-icons/fa'
import logo from '../assets/logo.png'
import back4 from '../assets/back4.jpg'

function About() {
  const navigate = useNavigate()

  return (
    <div className="w-full min-h-screen pt-[90px] pb-[120px] md:pb-14 px-4 sm:px-8 lg:px-14 bg-gradient-to-l from-[#141414] to-[#0c2025] text-white overflow-x-hidden">
      <section className="w-full grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <img src={logo} alt="MyCart logo" className="w-[42px] h-[42px] object-contain" />
            <span className="text-[#88d9ee] font-semibold tracking-wide">MyCart Fashion Store</span>
          </div>

          <div>
            <h1 className="text-[34px] sm:text-[46px] lg:text-[58px] leading-tight font-bold">
              Built for simple, stylish shopping.
            </h1>
            <p className="mt-5 max-w-[680px] text-white/75 text-[16px] sm:text-[18px] leading-8">
              MyCart brings fashion products, cart management, checkout, and order tracking into one clean shopping experience. The goal is to make browsing feel fast and buying feel easy.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => navigate('/collections')}
              className="h-[46px] px-6 rounded-[8px] bg-[#88d9ee] text-black font-semibold flex items-center gap-2 hover:bg-white transition-colors"
            >
              <FaShoppingBag />
              Shop collections
            </button>
            <button
              type="button"
              onClick={() => navigate('/contact')}
              className="h-[46px] px-6 rounded-[8px] border border-white/25 text-white font-semibold hover:bg-white/10 transition-colors"
            >
              Contact us
            </button>
          </div>
        </div>

        <div className="relative min-h-[340px] sm:min-h-[430px] overflow-hidden rounded-[8px] border border-white/10 bg-black/20">
          <img src={back4} alt="Fashion shopping display" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent"></div>
        </div>
      </section>
    </div>
  )
}

export default About
