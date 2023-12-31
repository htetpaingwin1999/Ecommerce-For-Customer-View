import mongoose, { Schema, model, models } from "mongoose";

const DiscountByAmountSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true,
  },
  discount_percentage: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },
  description: {
    type: String,
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

export const DiscountByAmount =models?.DiscountByAmount || model("DiscountByAmount", DiscountByAmountSchema);
