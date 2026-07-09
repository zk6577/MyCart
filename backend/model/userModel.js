import mongoose  from "mongoose";



const userSchema= new mongoose.Schema({
  name:{
    type:String,
    required:true,
    trim:true
  },

    email:{
    type:String,
    required:true,
    unique:true,
    trim:true
  },
      password:{
    type:String,
  
   
  },
cartData:{
    type:Object,
    default:{

    }
}



},{timestamps:true,minimize:false});



const User = mongoose.model("User",userSchema);


export default User;