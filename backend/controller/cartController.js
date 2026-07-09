import User from "../model/userModel.js"

const getCartItemKey = (itemId, selectedSize) => selectedSize ? `${itemId}:${selectedSize}` : itemId

export const addCart= async(req,res)=>{
    try{
const {itemId, selectedSize}= req.body;
const userId= req.userId;

const user = await User.findById(userId);
const cartData= user.cartData || {}
const cartKey = getCartItemKey(itemId, selectedSize)

cartData[cartKey]=(cartData[cartKey] ||0) +1 
await User.findByIdAndUpdate(userId,{cartData})

    return res.status(200).json({ message: "Added to cart", cartData })

    }catch(error){
    return res.status(500).json({ message: `Add to cart error ${error}` })

    }
}

export const updateCart= async  (req,res)=>{
    try{
    const {itemId,selectedSize,quantity}=req.body

     const userId = req.userId

    const user = await User.findById(userId)
    const cartData = user.cartData || {}
    const cartKey = getCartItemKey(itemId, selectedSize)

    if (quantity <= 0) {
  delete cartData[cartKey]
} else {
  cartData[cartKey] = quantity
}
   await User.findByIdAndUpdate(userId, { cartData })

    return res.status(200).json({ message: "Cart updated", cartData })

    }catch(error){
    return res.status(500).json({ message: `Update cart error ${error}` })

    }
}

export const getCart = async (req, res) => {
  try {
    const userId = req.userId
    const user = await User.findById(userId)

    return res.status(200).json(user.cartData || {})
  } catch (error) {
    return res.status(500).json({ message: `Get cart error ${error}` })
  }
}
