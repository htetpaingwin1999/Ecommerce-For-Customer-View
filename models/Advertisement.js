import mongoose, { Schema, model, models } from "mongoose";

const advertisementSchema = new mongoose.Schema({
  image_paths: {
    type: [String], // Change the type to an array of strings
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

export const Advertisement = models?.Advertisement || model('Advertisement', advertisementSchema);
