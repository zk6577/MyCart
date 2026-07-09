import jwt from "jsonwebtoken"
import User from "../model/userModel.js"



export const getCurrentUser= async (req,res)=>{
    try {
        const userToken = req.cookies.userToken;

        if(!userToken){
            return res.status(200).json(null);
        }

        const verifyToken = jwt.verify(userToken, process.env.JWT_SECRET);

        if(!verifyToken.userId){
            return res.status(200).json(null);
        }

        let user= await User.findById(verifyToken.userId).select("-password");

        if(!user){
            return res.status(404).json({message:"User is not found"});

        }

     return res.status(200).json(user);
        
        
    } catch (error) {
        console.log("Get current user error",error.message);
        return res.status(500).json({message:"Error fetching user details"})
    }
}




 export const getAdmin = async(req,res)=>{
  try {
    let adminEmail=req.adminEmail;
    
    
    if(!adminEmail){
          return res.status(404).json({message:"Admin is not found"});

    }
    return res.status(201).json({
        email:adminEmail,
        role:"admin"
    });
        



  } catch (error) {
    console.log("Get Admin  error",error.message);
        return res.status(500).json({message:"Error fetching user details"})
  }
 }
