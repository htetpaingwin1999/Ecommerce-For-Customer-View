import mongoose, {model, Schema, models} from "mongoose";

const ReviewSchema = new Schema({
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Client", // Reference the "Client" model
    required: true,
  },  description: {type:String, required:true},
  rating: {type: Number, required: true},
  product: {type:mongoose.Types.ObjectId, ref:'Product', required: true },
}, {
  timestamps: true,
});

export const Review = models.Review || model('Review', ReviewSchema);