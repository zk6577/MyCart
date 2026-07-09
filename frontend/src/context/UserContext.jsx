import React, { useCallback, useContext, useEffect, useState } from 'react'
import { authDataContex } from './authDataContext';
import { userDataContex as UserDataContext } from './userDataContext';
import axios from  "axios";

function UserContext({children}) {
const [userData,setUserData]= useState("");
  const {serverUrl}= useContext(authDataContex)
const [loading,setLoading]=useState(true)

  const getCurrentUser= useCallback(async( ) =>{
      try {
           const result=await axios.get(`${serverUrl}/api/user/getcurrentuser`,{withCredentials:true});
           
          setUserData(result.data);
           
      } catch (error) {
        setUserData(null);
        if (error.response?.status !== 401) {
          console.log("Error in getcurrentuser",error);
        }
        
      }
      finally{
        setLoading(false)
      }
              

    }, [serverUrl])

    useEffect(()=>{

 getCurrentUser();
    },[getCurrentUser])

    let value={
  userData,getCurrentUser,setUserData,loading
    }


  
  return (
    <div>
        <UserDataContext.Provider value={value}>
            {children}
        </UserDataContext.Provider>
    </div>
  )
}

export default UserContext
