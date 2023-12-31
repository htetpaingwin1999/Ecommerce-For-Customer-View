import mongoose, { Schema, model, models } from "mongoose";

const ProductStockSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product", // Reference the "Product" model
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

export const ProductStock = models?.ProductStock || model('ProductStock', ProductStockSchema);
