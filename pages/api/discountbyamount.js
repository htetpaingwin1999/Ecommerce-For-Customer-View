import { DiscountByAmount } from "../../models/DiscountByAmount";
import { mongooseConnect } from "../../lib/mongoose";

export default async function handle(req, res) {
  const { method } = req;
  await mongooseConnect();

  if (method === "GET") {
    if (req.query?.id) {
      // Retrieve a specific discount by ID
      const discount = await DiscountByAmount.findOne({ _id: req.query.id });
      res.json(discount?.discount_percentage); // Return only discount_percentage
    } else {
      // Retrieve discounts where the current time is between start_date and end_date
      const currentTime = new Date();
      const discounts = await DiscountByAmount.find({
        start_date: { $lte: currentTime },
        end_date: { $gte: currentTime },
      });
      res.json(discounts[0]); // Return the discount_percentage of the first discount
    }
  }

  // ... (rest of your code)
}
