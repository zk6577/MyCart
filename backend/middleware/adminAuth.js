import jwt from "jsonwebtoken";


  const adminAuth= async (req,res,next)=>{

try {
    
const adminToken = req.cookies["__Host-adminTokenPartitioned"] || req.cookies.adminToken;

 if(!adminToken){
    return res.status(401).json({message:"Unauthorized: No token provided"})
 }


 const verifyToken=jwt.verify(adminToken,process.env.JWT_SECRET);


 if(!verifyToken || verifyToken.email !== process.env.ADMIN_EMAIL){
    return res.status(401).json({message:"Invalid Admin Token"});
 }

req.adminEmail=verifyToken.email;

 next();
} catch (error) {
      console.log("Is Auth Error ",error);
 return res.status(500).json({message:"Error in IsAuth Controller"});

}



}


export default adminAuth
