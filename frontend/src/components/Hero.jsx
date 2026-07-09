// import React from 'react'
// import { FaCircle } from "react-icons/fa";

// function Hero({heroData,heroCount,setHeroCount}) {
//   return (
//     <div className='w-full h-full flex flex-col items-start justify-center md:pl-10  pl-5 lg:pl-12 gap-[10px] pr-3  '>

//   <div className=' text-[#88d9ee] text-[32px]  md:text-[40px] lg:text-[50px]  font-semibold ' >
//      <p> {heroData.text1}</p>
//          <p> {heroData.text2}</p>

//      </div>
//     <div className=' top-[600px] left-[10%] flex items-center justify-center gap-[10px]  '>
      
//       <FaCircle className={`w-[14px]  cursor-pointer ${heroCount === 0 ? " text-orange-400":"fill-white "}` } onClick={(()=> setHeroCount(0))}/>
      
//       <FaCircle className={`w-[14px] ${heroCount === 1 ? " text-orange-400":"fill-white "}` } onClick={(()=> setHeroCount(1))}/> 

//       <FaCircle className={`w-[14px] ${heroCount === 2 ? " text-orange-400":"fill-white "}` } onClick={(()=> setHeroCount(2))}/> 

//       <FaCircle className={`w-[14px] ${heroCount === 3 ? " text-orange-400":"fill-white "}` } onClick={(()=> setHeroCount(3))}/>
//       </div> 
 
//     </div>
//   )
// }

// export default Hero;


import React from 'react'
import { FaCircle } from "react-icons/fa";

function Hero({heroData,heroCount,setHeroCount}) {
  return (
    <div className='w-full h-full relative   '>

  <div className='absolute text-[#88d9ee] text-[20px] md:text-[40px] lg:text-[55px] md:left-[10%] left-[10%] md:top-[100px] lg:top-[130px] top-[10px]  ' >
     <p> {heroData.text1}</p>
         <p> {heroData.text2}</p>

     </div>
    <div className='absolute md:top-[400px] lg:top-[500px] top-[160px] left-[10%] flex items-center justify-center gap-[10px]  '>
      
      <FaCircle className={`w-[14px] cursor-pointer ${heroCount === 0 ? " text-orange-400":"fill-white "}` } onClick={(()=> setHeroCount(0))}/>
     
      <FaCircle className={`w-[14px] cursor-pointer ${heroCount === 1 ? " text-orange-400":"fill-white "}` } onClick={(()=> setHeroCount(1))}/> 

      <FaCircle className={`w-[14px] cursor-pointer ${heroCount === 2 ? " text-orange-400":"fill-white "}` } onClick={(()=> setHeroCount(2))}/> 

      <FaCircle className={`w-[14px]  cursor-pointer ${heroCount === 3 ? " text-orange-400":"fill-white "}` } onClick={(()=> setHeroCount(3))}/>
      </div> 
 
    </div>
  )
}

export default Hero; 