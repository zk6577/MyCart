import User from "../model/userModel.js"



export const getCurrentUser= async (req,res)=>{
    try {
        let user= await User.findById(req.userId).select("-password");

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