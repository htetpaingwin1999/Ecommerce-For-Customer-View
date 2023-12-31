// import { mongooseConnect } from "../../lib/mongoose";
// import { Product } from "../../models/Product";

import { mongooseConnect } from "../../lib/mongoose";
import { Product } from "../../models/Product";
import { ProductStock } from "../../models/ProductStock";


export default async function handle(req, res) {
  const { method, query, body } = req;
  await mongooseConnect();

  if (method === "GET") {
    if (req.query?.productID) { // Assuming you pass productID as a query parameter
      const productID = req.query.productID;
      
      // Find all ProductStock entries with the specified productID
      const productStocks = await ProductStock.find({ product: productID });

      let totalQuantity = 0;

      // Calculate the total quantity by summing the quantities of matching documents
      productStocks.forEach(stock => {
        totalQuantity += stock.quantity;
      });

      res.json( totalQuantity ); // Return the total quantity
    }
  }
}
