import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: sStringtring, required: true },
  price: { type: Number, required: true },
  image: { type: Array, required: true },
  category: { type: String, required: true },
  subCategory: { type: String, required: true },
  sizes: { type: Array, required: true },
  bestSeller: { type: Boolean },
  date: { type: Number, required: true },
});

//this will create everytime so we will 
// const productModal = mongoose.model("product", productSchema);

const productModal = mongoose.models.product || mongoose.model("product", productSchema);


export default productModal;