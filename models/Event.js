import mongoose, { Schema, model, models } from "mongoose";

const eventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  image_path: {
    type: String,
    required: true,
  },
  background_image_path: {
    type: String,
    required: true,
  },
  onStatus: {
    type: Number,
    required: true,
    enum: [0, 1], // Only allow values 0 or 1
  },
  besideOrUp: {
    type: Number,
    enum: [0, 1], // beside = 0 or up = 1
    default: 0,   // Set the default value to 
  }
});

export const Event = models?.Event || model('Event', eventSchema);
