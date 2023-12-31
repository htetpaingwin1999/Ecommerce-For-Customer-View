import mongoose, { Schema, model, models } from "mongoose";

const DiscountByProductSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product", // Reference the "Product" model
    required: true,
  },
  discount_percentage: {
    type: Number,
    required: true,
  },
  start_date: {
    type: Date,
    required: true,
  },
  end_date: {
    type: Date,
    required: true,
  },
});

export const DiscountByProduct =models?.DiscountByProduct || model("DiscountByProduct", DiscountByProductSchema);
