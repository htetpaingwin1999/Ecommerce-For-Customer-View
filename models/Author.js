import mongoose, {model, models, Schema} from "mongoose";

const AuthorSchema = new Schema({
  name: {type:String,required:true},
});

export const Author = models?.Author || model('Author', AuthorSchema);