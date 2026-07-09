import React, { useCallback, useContext, useEffect, useState } from 'react'
import { authDataContex } from './authDataContext'
import { cartDataContext as CartDataContext } from './cartDataContext'
import { userDataContex } from './userDataContext'
import axios from "axios";


const CART_STORAGE_KEY = 'onecartCartItems'
const getCartItemKey = (item) => item.selectedSize ? `${item._id}:${item.selectedSize}` : item._id
const parseCartItemKey = (key) => {
  const [productId, selectedSize = ''] = key.split(':')
  return { productId, selectedSize }
}

const getSavedCartItems = () => {
  try {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY)
    if (!savedCart) return []

    const parsedCart = JSON.parse(savedCart)
    return Array.isArray(parsedCart) ? parsedCart : []
  } catch (error) {
    console.log('Cart storage error', error)
    return []
  }
}
 
function CartContext({ children }) {
  const [cartItems, setCartItems] = useState(getSavedCartItems)
  const {serverUrl}=useContext(authDataContex)
  const {userData, loading:userLoading}=useContext(userDataContex)


  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems))
  }, [cartItems])

  const loadCartFromBackend = useCallback(async () => {
    try {
      const cartResult = await axios.get(`${serverUrl}/api/cart/get`, {
        withCredentials: true,
      })
      const cartData = cartResult.data || {}
      const cartEntries = Object.entries(cartData).filter(([, quantity]) => quantity > 0)

      if (cartEntries.length === 0) {
        setCartItems([])
        return
      }

      const productResult = await axios.get(`${serverUrl}/api/product/list`)
      const products = Array.isArray(productResult.data) ? productResult.data : []
      const backendCartItems = cartEntries
        .map(([cartKey, quantity]) => {
          const { productId, selectedSize } = parseCartItemKey(cartKey)
          const product = products.find((item) => item._id === productId)
          return product ? { ...product, selectedSize, cartKey, quantity } : null
        })
        .filter(Boolean)

      setCartItems(backendCartItems)
    } catch (error) {
      console.log("Load cart error", error)
    }
  }, [serverUrl])

  useEffect(() => {
    if (userLoading || !userData) return
    loadCartFromBackend()
  }, [loadCartFromBackend, userData, userLoading])

 const updateCartOnBackend= async(item,quantity)=>{
try {
      const result = await axios.post(`${serverUrl}/api/cart/update`,{
        itemId:item._id,
        selectedSize:item.selectedSize,
        quantity
      },{withCredentials:true});
      console.log(result.data)
} catch (error) {
  console.log("updateCartbackend error",error);
}      
  }

  const addCart = async(product)=>{
    if (!product?._id) return
    const cartKey = getCartItemKey(product)

    setCartItems((prev) => {
      const existingItem = prev.find((item) => (item.cartKey || getCartItemKey(item)) === cartKey)

      if (existingItem) {
        return prev.map((item) =>
          (item.cartKey || getCartItemKey(item)) === cartKey
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }

      return [...prev, { ...product, cartKey, quantity: 1 }]
    })

    try {
      const result = await axios.post(`${serverUrl}/api/cart/add`,{
        itemId:product._id,
        selectedSize:product.selectedSize
      },{withCredentials:true});
console.log(result.data)

    } catch (error) {
console.log("Add cart error",error)  }
  }
const increaseQty = (cartKey) => {
  const currentItem = cartItems.find((item) => (item.cartKey || getCartItemKey(item)) === cartKey)
  if (!currentItem) return

  const newQuantity = currentItem.quantity + 1

  setCartItems((prev) =>
    prev.map((item) =>
      (item.cartKey || getCartItemKey(item)) === cartKey ? { ...item, quantity: newQuantity } : item
    )
  )

  updateCartOnBackend(currentItem, newQuantity)
}
  const decreaseQty = (cartKey) => {
      const currentItem = cartItems.find((item) => (item.cartKey || getCartItemKey(item)) === cartKey)
      if (!currentItem) return

    const newQuantity = currentItem.quantity - 1
    setCartItems((prev) =>
      prev
        .map((item) =>
          (item.cartKey || getCartItemKey(item)) === cartKey ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0)
    )
    updateCartOnBackend(currentItem,newQuantity)
  }

  const removeCart = (cartKey) => {
    const currentItem = cartItems.find((item) => (item.cartKey || getCartItemKey(item)) === cartKey)
    if (!currentItem) return
    setCartItems((prev) => prev.filter((item) => (item.cartKey || getCartItemKey(item)) !== cartKey))
    updateCartOnBackend(currentItem,0)

  }
 

  const value = {
    cartItems,
    setCartItems,
    addCart,
    removeCart,
    increaseQty,
    decreaseQty,
  }

  return (
    <CartDataContext.Provider value={value}>
      {children}
    </CartDataContext.Provider>
  )
}

export default CartContext;
