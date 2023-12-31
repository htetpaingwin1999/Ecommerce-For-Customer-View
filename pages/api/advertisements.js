import { Advertisement } from "../../models/Advertisement";
import { mongooseConnect } from "../../lib/mongoose";

export default async function handle(req, res) {
  const { method } = req;
  await mongooseConnect();

  if (method === "GET") {
    if (req.query?.id) {
      res.json(await Advertisement.findOne({ _id: req.query.id }));
    } else {
      res.json(await Advertisement.find());
    }
  } 
}
