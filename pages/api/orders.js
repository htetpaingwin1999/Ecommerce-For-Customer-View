import {mongooseConnect} from "../../lib/mongoose";
import { Orders } from "../../models/Orders";


export default async function handler(req,res) {
  await mongooseConnect();
  const { method, query, body } = req;
  if(method == "GET"){
      res.json(await Orders.find().sort({createdAt:-1}));
      
  }
  if (method === 'PUT') {
    const { _id } = body;
      const orderDoc = await Orders.updateOne(
        {_id},
        {
          paid: true,
        }
      );
      res.json("ok"+_id);
  }

}