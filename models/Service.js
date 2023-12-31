import mongoose, {model, models, Schema} from "mongoose";

const ServiceSchema = new Schema({
  title: {type: String, required: true},
  image: {type: String, required: true},
  description: {type: String, required: true}
});

export const Service = models?.Service || model('Service', ServiceSchema);