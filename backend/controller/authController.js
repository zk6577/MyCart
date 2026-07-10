 
import validator from  "validator";
import User from "../model/userModel.js";
 
import bcrypt from  "bcryptjs";
import {genToken,genToken1} from "../config/token.js";

const isProduction = process.env.NODE_ENV === "production";
const baseCookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "None" : "Strict",
};

const userCookieOptions = {
  ...baseCookieOptions,
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

const adminCookieOptions = {
  ...baseCookieOptions,
  maxAge: 1 * 24 * 60 * 60 * 1000,
};

const clearCookieOptions = {
  ...baseCookieOptions,
};

const partitionedUserCookieOptions = {
  ...userCookieOptions,
  path: "/",
  partitioned: true,
};

const partitionedAdminCookieOptions = {
  ...adminCookieOptions,
  path: "/",
  partitioned: true,
};

const partitionedClearCookieOptions = {
  ...clearCookieOptions,
  path: "/",
  partitioned: true,
};

const setUserAuthCookies = (res, token) => {
  res.cookie("userToken", token, userCookieOptions);

  if (isProduction) {
    res.cookie("__Host-userTokenPartitioned", token, partitionedUserCookieOptions);
  }
};

const setAdminAuthCookies = (res, token) => {
  res.cookie("adminToken", token, adminCookieOptions);

  if (isProduction) {
    res.cookie("__Host-adminTokenPartitioned", token, partitionedAdminCookieOptions);
  }
};

const getUserData = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
});

 export const register= async( req,res) =>{


    try{
        const {name,email,password}=req.body;
        if (!name || !email || !password) {
          return res.status(400).json({ message: "All fields are required" });
        }

         const exitsUser= await User.findOne({email});

         if(exitsUser){
           return res.status(400).json({message:"User already exixts"});



         }
       if(!validator.isEmail(email)){
          return res.status(400).json({message:"Enter Valid email"});

       }
       if(password.length<6){
                 return res.status(400).json({message:"The password length should be greater than 6"});
 
       }
      
       const hashedPassword= await bcrypt.hash(password,10);

       const user= await User.create({
        name
        ,email
        ,password:hashedPassword
       });


       const userToken = await genToken(user._id);
   
        setUserAuthCookies(res, userToken)
   
    return res.status(201).json({ user: getUserData(user), token: userToken });
       





    }catch(error){
   console.log("register rrror");

return res.status(500).json({message:`Registor error ${error}`})



    }
 }

 export const login = async ( req,res)=>{
try {
     const {email,password}=req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (!validator.isEmail(email)) {
    return res.status(400).json({ message: "Enter Valid email" });
  }

  const user = await User.findOne({email});


  if(!user){
   return res.status(404).json({message:'User not found'})
 
  }
   let isMatch=  await bcrypt.compare(password,user.password);
if(!isMatch){
       return res.status(400).json({message:'Incorrect Password'});

}

       const userToken = await genToken(user._id);
   
        setUserAuthCookies(res, userToken)
 return res.status(200).json({ user: getUserData(user), token: userToken });


} catch (error) {
       console.log("login error");

return res.status(500).json({message:`Login error ${error}`})

}


 }

 export const logOut= async (req,res)=>{
  try {
    res.clearCookie("userToken", clearCookieOptions);
    if (isProduction) {
      res.clearCookie("__Host-userTokenPartitioned", partitionedClearCookieOptions);
    }
    return res.status(200).json({message:"Logout Suceessfully"})
  } catch (error) {
       console.log("logout error");

return res.status(500).json({message:`logout error ${error}`})
 }



 }

 export const adminLogOut= async (req,res)=>{
  try {
    res.clearCookie("adminToken", clearCookieOptions);
    if (isProduction) {
      res.clearCookie("__Host-adminTokenPartitioned", partitionedClearCookieOptions);
    }
    return res.status(200).json({message:"Admin Logout Suceessfully"})
  } catch (error) {
       console.log("admin logout error");

return res.status(500).json({message:`Admin logout error ${error}`})
  }



 }



 export const googleLogin = async (req,res)=>{
  try {
    const {name,email}=req.body;
 if (!name || !email) {
  return res.status(400).json({ message: "All fields are required" });
 }

 if (!validator.isEmail(email)) {
  return res.status(400).json({ message: "Enter Valid email" });
 }

 let user = await User.findOne({email});


  if(!user){
   user= await User.create({
    name,email
  })
  }
 

       const userToken = await genToken(user._id);
   
        setUserAuthCookies(res, userToken)
 return res.status(200).json({ user: getUserData(user), token: userToken });


} catch (error) {
       console.log("Adminlogin  error");

return res.status(500).json({message:`Admin Login error ${error}`})

}


 }



 export const adminLogin= async (req, res)=>{

    try {
        const {email,password}=req.body;
       if(email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
        const adminToken = await genToken1(email);
   
        setAdminAuthCookies(res, adminToken)
 return res.status(200).json(adminToken);

      
      
      
      } 
      return res.status(401).json({message:"Invalid credentials"}) 



    } catch (error) {
      console.log("AdminLogin error",error)
      return res.status(500).json({message:"AdminLogin Error"}) 
    }


 }




