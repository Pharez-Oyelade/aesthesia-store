import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  image: {
    type: [
      {
        url: { type: String, required: true },
        public_id: { type: String, required: true },
      },
    ],
    required: true,
  },
  section: {
    type: String,
    required: true,
  },
  sizes: {
    type: Array,
    required: false, // Now optional
    default: [],
  },
  colors: {
    type: Array,
    required: false, // Optional colors
    default: [],
  },
  bestseller: {
    type: Boolean,
    default: false,
  },

  // Testing Sale flow
  onSale: {
    type: Boolean,
    default: false,
  },
  salePrice: {
    type: Number,
    default: 0,
  },
  preorder: {
    type: Boolean,
    default: false,
  },
  soldOut: {
    type: Boolean,
    default: false,
  },
  // End flow additions

  date: {
    type: Number,
    required: true,
  },
});

const productModel =
  mongoose.models.product || mongoose.model("product", productSchema);

export default productModel;
