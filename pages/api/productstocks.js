import { Product } from "@/models/Product";
import { ProductStock } from "@/models/ProductStock";
import { mongooseConnect } from "@/lib/mongoose";
import { isAdminRequest } from "@/pages/api/auth/[...nextauth]";

export default async function handle(req, res) {
  const { method, query, body } = req;
  await mongooseConnect();
  await isAdminRequest(req, res);

  if (method === "GET") {
    if (req.query?.id) {
      // Populate the "product" field with data from the "Product" model
      const productStock = await ProductStock.findOne({ _id: req.query?.id })
        .populate("product") // Use "product" instead of "products"
        .exec();
      res.json(productStock);
    } else {
      // Populate the "product" field with data from the "Product" model
      const productStocks = await ProductStock.find({}, null, {sort: {'_id':-1}, limit:20})
        .populate("product") // Use "product" instead of "products"
        .exec();
      res.json(productStocks);
    }
  }


  if (method === "POST") {
    const { product, quantity, price } = req.body;
    const productStockDoc = await ProductStock.create({
      product,
      quantity,
      price,
    });
    res.json(productStockDoc);
  }

  if (method === "PUT") {
    const { product, quantity, price, _id } = req.body;
    await ProductStock.updateOne(
      { _id },
      { product, quantity, price }
    );
    res.json(true);
  }

  if (method === "DELETE") {
    res.json(req.query?._id);
    if (req.query?.id) {
      await ProductStock.deleteOne({ _id: req.query?._id });
      res.json(true);
    }
  }
}
