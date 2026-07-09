import uploadOnCloudinary from "../config/cloudinary.js"
import Product from "../model/productModel.js";


export const addProduct = async (req,res)=>{

try{


  const {name,price, description,sizes,bestseller,category,subCategory}=req.body

    if (!req.files?.image1 || !req.files?.image2 || !req.files?.image3 || !req.files?.image4) {
      return res.status(400).json({ message: "All 4 images are required" });
    }
const image1=await uploadOnCloudinary(req.files.image1[0].path);
const image2=await uploadOnCloudinary(req.files.image2[0].path);
const image3=await uploadOnCloudinary(req.files.image3[0].path);
const image4=await uploadOnCloudinary(req.files.image4[0].path);

 if (!image1 || !image2 || !image3 || !image4) {
      return res.status(500).json({ message: "Image upload failed" });
    }

 let productData = 
   {name,
    price: Number(price),
     description,
     sizes:JSON.parse(sizes),
   bestseller:bestseller === "true" ? true :false,
 category,
 subCategory,
 date:Date.now(),
image1,
image2,
image3,
image4


   }


   const product = await Product.create(productData)

   return res.status(201).json(product);






}catch(error){


console.log("AddProduct error");

  return res.status(500).json({message:`AddProduct error ${error}`});



}



}

export const listProducts= async(req,res)=>{

try{
    const { sort,search,bestseller,category,subCategory}=req.query
const filter={}
const sortOption={}
if(category){
  filter.category=category
}
if(subCategory){
  filter.subCategory=subCategory
}

if(bestseller){
  filter.bestseller=bestseller==="true"
}
if(search){
filter.name={$regex: search, $options:"i"}
}
if(sort==="low-high"){
  sortOption.price=1
}
if(sort==="high-low"){
  sortOption.price=-1
}
if (sort === "newest") {
  sortOption.date = -1
}
const product = await Product.find(filter).sort(sortOption)

  return res.status(200).json(product);
  

}catch(err){

console.log("List Product Error")
 return res.status(500).json({message:`List Product error ${err}`});



}
}
export const removeProduct = async(req,res)=>{
  try{
let {id}= req.params;
const product = await Product.findByIdAndDelete(id);
  return res.status(200).json(product);
  }catch(err){
console.log("RemoveProduct Error")
 return res.status(500).json({message:`RemoveProduct error ${err}`});
  }
}

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params
    const { name, price, description, sizes, bestseller, category, subCategory } = req.body

    const parsedSizes = Array.isArray(sizes) ? sizes : JSON.parse(sizes || '[]')

    if (!name || !description || !category || !subCategory) {
      return res.status(400).json({ message: "All product fields are required" })
    }

    if (!Number(price) || Number(price) <= 0) {
      return res.status(400).json({ message: "Enter a valid product price" })
    }

    if (!Array.isArray(parsedSizes) || parsedSizes.length === 0) {
      return res.status(400).json({ message: "Select at least one size" })
    }

    const product = await Product.findByIdAndUpdate(
      id,
      {
        name,
        price: Number(price),
        description,
        sizes: parsedSizes,
        bestseller: bestseller === true || bestseller === "true",
        category,
        subCategory,
      },
      { new: true, runValidators: true }
    )

    if (!product) {
      return res.status(404).json({ message: "Product not found" })
    }

    return res.status(200).json({ message: "Product updated", product })
  } catch (error) {
    console.log("UpdateProduct Error")
    return res.status(500).json({ message: `UpdateProduct error ${error}` })
  }
}


export const singleProduct= async(req,res)=>{
  try {
    const {id}=req.params;

    const product=await Product.findById(id);
    if (!product) {
  return res.status(404).json({ message: "Product not found" })
}
    return res.status(200).json(product)
    
  } catch (error) {
    console.log("Singleproduct Error")
 return res.status(500).json({message:`SingleProduct error ${error}`});
  }
}
