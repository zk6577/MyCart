import React, { useCallback, useEffect, useState } from 'react'
import { useContext } from 'react';
import { authDataContext } from './authDataContext';
import { adminContext as AdminDataContext } from './adminDataContext';
import axios from 'axios';

function AdminContext({children}) {
    
const [adminData, setAdminData]= useState(null);

 const {serverUrl}=useContext(authDataContext);



 const getAdmin = useCallback(async()=>{
    try {
        let result = await  axios.get(`${serverUrl}/api/user/getadmin`,{withCredentials:true})


        setAdminData(result.data)
        console.log(result.data)
    } catch (error) {
        setAdminData(null)
        console.log(error)
    }
 }, [serverUrl])


 useEffect(()=>{
    getAdmin();
 },[getAdmin])


 let value={
adminData,setAdminData,getAdmin
 }

 
  return (
   
 <div> 

  <AdminDataContext.Provider value={value}>
    {children}
  </AdminDataContext.Provider>

    </div>
  )
}

export default AdminContext



