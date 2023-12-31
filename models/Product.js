import mongoose, { Schema, model, models } from "mongoose";

const ProductSchema = new Schema({
  title: { type: String, required: true },
  description: String,
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'Author' },
  price: { type: Number, required: true },
  images: [{ type: String }],
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  pages: { type: Number, required: true },
  width: { type: Number, required: false },
  height: { type: Number, required: false },
  thickness: { type: Number, required: false },
  unit: { type: String, required: false },
  published_place: { type: String, required: true },
  edition: { type: String, required: true },
}, {
  timestamps: true,
});

export const Product =  models?.Product || model('Product', ProductSchema);