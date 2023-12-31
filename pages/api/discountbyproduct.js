import { DiscountByProduct } from "../../models/DiscountByProduct"; // Make sure to import your DiscountByProduct model
import { mongooseConnect } from "../../lib/mongoose";

export default async function handle(req, res) {
  const { method } = req;
  await mongooseConnect();

  if (method === "GET") {
    if (req.query?._id) {
      // Retrieve a specific discount by ID
      const discount = await DiscountByProduct.findOne({ _id: req.query.id });
      // res.json(discount); // Return only discount_percentage
    } else {
      // Retrieve discounts where the current time is between start_date and end_date
      const currentTime = new Date();
      const discounts = await DiscountByProduct.find({
        start_date: { $lte: currentTime },
        end_date: { $gte: currentTime },
      });
      res.json(discounts); // Return the discount_percentage of the first discount
    }
  }

  // ... (rest of your code)
}
