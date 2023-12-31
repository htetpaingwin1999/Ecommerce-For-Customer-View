// Import necessary modules and models (adjust paths as needed)
import { mongooseConnect } from "../../lib/mongoose";
import { Orders } from "../../models/orders"; // Adjust the path to your Orders model

export default async function handle(req, res) {
  const { method, query, body } = req;
  await mongooseConnect();

  if (method === "GET") {
    if (req.query?.productID) { // Assuming you pass productID as a query parameter
      const productID = req.query.productID;

      try {
        // Aggregate the total order quantity by BookID for paid orders
        const aggregatedOrderQuantity = await Orders.aggregate([
          {
            $match: {
              "line_items.price_data.product_data.productID": productID,
              status: { $ne: -1 }, // Filter by paid orders with status not equal to -1
            },
          },
          {
            $unwind: "$line_items",
          },
          {
            $match: {
              "line_items.price_data.product_data.productID": productID,
            },
          },
          {
            $group: {
              _id: null,
              totalQuantity: {
                $sum: "$line_items.quantity",
              },
            },
          },
        ]);

        if (aggregatedOrderQuantity.length > 0) {
          res.json(aggregatedOrderQuantity[0]); // Return the total order quantity
        } else {
          res.json({ totalQuantity: 0 }); // Return 0 if no matching records found
        }
      } catch (error) {
        res.status(500).json({ error: "An error occurred while calculating the total order quantity." });
      }
    } else {
      res.status(400).json({ error: "Missing productID parameter in the query." });
    }
  }
}
