
import jwt from "jsonwebtoken"
 const isAuth= async(req,res,next)=>{

 try {
const userToken = req.cookies.userToken;

    if(!userToken){
        return res.status(401).json({message:"User does not have token"});



    }
     const verifyToken= jwt.verify(userToken,process.env.JWT_SECRET)
  if(!verifyToken.userId ){
    return res.status(400).json({message:"Invalid Token"});

  }
    req.userId=verifyToken.userId;


    next();

 } catch (error) {
    console.log("Is Auth Error ",error);
    return res.status(500).json({message:"Error in IsAuth Controller"});


 }


 }


 export default  isAuth;
