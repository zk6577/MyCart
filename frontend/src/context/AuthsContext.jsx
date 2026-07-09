import React from 'react'
import { authDataContex as AuthDataContext } from './authDataContext'

function AuthsContex({children}) {
const serverUrl = import.meta.env.VITE_SERVER_URL || "http://localhost:8000"
    const value ={
        serverUrl
    }
  return (
    <div>
        <AuthDataContext.Provider value={value}>
    {children }
        </AuthDataContext.Provider>
    </div>
  )
}

export default AuthsContex;
