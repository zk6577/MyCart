import React from 'react'
import { FaListAlt } from 'react-icons/fa'
import { IoIosAddCircleOutline } from 'react-icons/io'
import { MdContactMail, MdDashboard } from 'react-icons/md'
import { SiTicktick } from 'react-icons/si'
import { NavLink } from 'react-router-dom'

const links = [
  { label: 'Dashboard', path: '/', icon: MdDashboard },
  { label: 'Add Product', path: '/add', icon: IoIosAddCircleOutline },
  { label: 'Products', path: '/lists', icon: FaListAlt },
  { label: 'Orders', path: '/orders', icon: SiTicktick },
  { label: 'Messages', path: '/contact-messages', icon: MdContactMail },
]

function Sidebar() {
  return (
    <aside className='fixed left-0 top-[64px] bottom-0 z-20 w-[82px] lg:w-[260px] border-r border-white/10 bg-[#101819] text-white'>
      <nav className='h-full px-3 lg:px-4 py-5 flex flex-col gap-2'>
        {links.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            className={({ isActive }) =>
              `min-h-[50px] rounded-[8px] flex items-center justify-center lg:justify-start gap-3 px-3 font-semibold transition-colors ${
                isActive
                  ? 'bg-[#88d9ee] text-[#101819]'
                  : 'text-white/75 hover:bg-white/10 hover:text-white'
              }`
            }
            title={item.label}
          >
            {React.createElement(item.icon, { className: 'w-[22px] h-[22px] shrink-0' })}
            <span className='hidden lg:inline'>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}

export default Sidebar
