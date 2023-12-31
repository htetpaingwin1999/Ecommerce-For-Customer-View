import {mongooseConnect} from "../../lib/mongoose";
import { Category } from "../../models/Category";

export default async function handle(req, res) {
  const {method} = req;
  await mongooseConnect();

  if (method === 'GET') {
    if (req.query?.id) {
      res.json(await Category.findOne({_id:req.query.id}));
    } else {
      res.json(await Category.find());
    }
  }
  
}