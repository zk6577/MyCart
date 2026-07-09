import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import AuthsContex from './context/AuthsContext.jsx'
import UserContext from './context/UserContext.jsx'
import CartContext from './context/CartContext.jsx'
createRoot(document.getElementById('root')).render(
  <BrowserRouter>
  <AuthsContex>
<UserContext>
   <CartContext>
  <App />
  </CartContext>
</UserContext>
 
    
       </AuthsContex>
  </BrowserRouter>


)
