import React from 'react'
import { FaArrowRight } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import back1 from '../assets/back1.png'
import back2 from '../assets/back2.jpg'
import back3 from '../assets/back3.jpg'
import back4 from '../assets/back4.jpg'

const previewImages = [back2, back3, back4]

function Home() {
  const navigate = useNavigate()

  return (
    <main className='min-h-screen bg-[#f5f8f8] text-[#101819] pt-[64px] pb-[92px] md:pb-0 overflow-x-hidden'>
      <section className='relative min-h-[calc(100vh-64px)] grid grid-cols-1 lg:grid-cols-[1.02fr_0.98fr] items-center max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-8 lg:py-12 gap-8'>
        <div className='flex flex-col gap-7 max-w-[680px] z-10'>
          <div className='w-fit rounded-full border border-[#101819]/10 bg-white px-4 py-2 text-[13px] sm:text-[14px] font-semibold shadow-sm'>
            30% off on selected fashion picks
          </div>

          <div>
            <h1 className='text-[42px] sm:text-[58px] lg:text-[76px] leading-[1.02] font-black tracking-normal'>
              Style your cart with MyCart.
            </h1>
            <p className='mt-5 text-[16px] sm:text-[18px] leading-8 text-[#425154] max-w-[610px]'>
              Shop fashion products, manage your cart, and track orders from one clean responsive store built for quick browsing on every screen.
            </p>
          </div>

          <div className='flex flex-col sm:flex-row gap-3'>
            <button
              type='button'
              onClick={() => navigate('/collections')}
              className='min-h-[50px] px-6 rounded-[8px] bg-[#101819] text-white font-bold flex items-center justify-center gap-3 hover:bg-[#28464a] transition-colors'
            >
              Shop collections
              <FaArrowRight />
            </button>
            <button
              type='button'
              onClick={() => navigate('/about')}
              className='min-h-[50px] px-6 rounded-[8px] border border-[#101819]/15 bg-white text-[#101819] font-bold hover:border-[#101819] transition-colors'
            >
              About MyCart
            </button>
          </div>

        </div>

        <div className='relative w-full min-h-[430px] sm:min-h-[560px] lg:min-h-[640px]'>
          <div className='absolute inset-x-6 top-8 bottom-8 rounded-[8px] bg-[#dff4f5] rotate-2'></div>
          <div className='relative h-full min-h-[430px] sm:min-h-[560px] lg:min-h-[640px] rounded-[8px] overflow-hidden bg-[#d9f2f5] border border-white shadow-2xl shadow-[#101819]/15'>
            <img src={back1} alt='MyCart fashion model' className='absolute inset-0 w-full h-full object-cover object-center' />
            <div className='absolute inset-0 bg-gradient-to-t from-[#101819]/70 via-transparent to-transparent'></div>
            <div className='absolute left-4 right-4 bottom-4 rounded-[8px] bg-white/92 backdrop-blur-md p-4 sm:p-5 flex items-center justify-between gap-4'>
              <div>
                <p className='font-black text-[18px] sm:text-[22px]'>Summer Essentials</p>
                <p className='text-[#607174] text-[13px] sm:text-[14px]'>Top wear, winter wear, and daily fits.</p>
              </div>
              <button
                type='button'
                onClick={() => navigate('/collections')}
                className='w-[46px] h-[46px] rounded-full bg-[#101819] text-white flex items-center justify-center shrink-0'
                aria-label='Open collections'
              >
                <FaArrowRight />
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className='max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 pb-12'>
        <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
          {previewImages.map((image, index) => (
            <button
              key={image}
              type='button'
              onClick={() => navigate('/collections')}
              className='group relative h-[210px] sm:h-[250px] rounded-[8px] overflow-hidden bg-[#101819] text-left'
            >
              <img src={image} alt={`MyCart collection ${index + 1}`} className='absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500' />
              <div className='absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent'></div>
              <span className='absolute left-4 bottom-4 text-white font-bold'>View collection</span>
            </button>
          ))}
        </div>
      </section>
    </main>
  )
}

export default Home
