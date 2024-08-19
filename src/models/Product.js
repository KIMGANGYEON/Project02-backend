import mongoose, { Schema } from "mongoose";

const productSchema = mongoose.Schema({
  writer: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
  },
  description: String,
  price: {
    type: Number,
    default: 0,
  },
  images: {
    type: [String],
    default: [],
  },
  sold: {
    type: Number,
    default: 0,
  },
  like: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

const Product = mongoose.model("Product", productSchema);

export default Product;
