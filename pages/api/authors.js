import {mongooseConnect} from "../../lib/mongoose";
import { Author } from "../../models/Author";

export default async function handle(req, res) {
  const {method} = req;
  await mongooseConnect();

  if (method === 'GET') {
    if (req.query?.id) {
      res.json(await Author.findOne({_id:req.query.id}));
    } else {
      res.json(await Author.find());
    }
  }
  
}