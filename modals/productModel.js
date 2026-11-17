import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: Array, required: true },
  category: { type: String, required: true },
  subCategory: { type: String, required: true },
  sizes: { type: Array, required: true },
  bestSeller: { type: Boolean },
  date: { type: Number, required: true },
  isDemo: { type: Boolean, default: false },
  expireAt: { type: Date, default: null },
});

// TTL index: MongoDB automatically purges expired demo documents when expireAt <= current time
// Only documents where expireAt is a valid Date will expire; null/missing values are ignored
productSchema.index({ expireAt: 1 }, { expireAfterSeconds: 0 });

const productModal =
  mongoose.models.product || mongoose.model("product", productSchema);

export default productModal;