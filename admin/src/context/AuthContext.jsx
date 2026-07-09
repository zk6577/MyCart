import React from 'react'
import { authDataContext as AuthDataContext } from './authDataContext'
const serverUrl = import.meta.env.VITE_SERVER_URL || "http://localhost:8000"

let value= {
serverUrl
}

function AuthContext({children}) {
  return (
    <div>
        <AuthDataContext.Provider value={value}>
    
             {children}

        </AuthDataContext.Provider>
    </div>
  )
}

export default AuthContext
