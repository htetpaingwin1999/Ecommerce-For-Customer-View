import mongoose, { Schema, model, models } from "mongoose";

// Define the schema for the OrderAndDiscountByAmount model
const OrderAndDiscountByAmountSchema = new mongoose.Schema({
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Orders", // Reference the "Orders" model
    required: true,
  },
  discount_percentage: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },
  buy_date: {
    type: Date,
    default: Date.now, // Inherit the createdAt timestamp of the "Orders" model
  },
});

// Create the OrderAndDiscountByAmount model if it doesn't exist, or use the existing one
export const OrderAndDiscountByAmount = models?.OrderAndDiscountByAmount || model("OrderAndDiscountByAmount", OrderAndDiscountByAmountSchema);
