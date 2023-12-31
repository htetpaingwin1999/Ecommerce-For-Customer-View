import {mongooseConnect} from "../../lib/mongoose";
import { Review } from "../../models/Review";

export default async function handle(req, res) {
  const {method} = req;
  await mongooseConnect();

  if (method === 'GET') {
    try {
      if (req.query?.productId && req.query?.reviewId) {

        const review = await Review.findOne({ product: req.query.productId, _id: req.query.reviewId });
        res.json(review);
      } else if (req.query?.productId) {

        const reviews = await Review.find({ product: req.query.productId }).populate('product');
        res.json(reviews);
      } else if (req.query?.reviewId) {
        
        const review = await Review.findOne({ _id: req.query.reviewId });
        res.json(review);
      } else {
        
        const reviews = await Review.find();
        res.json(reviews);
      }
    } catch (error) {
      console.error('An error occurred:', error);
      res.status(500).json({ error: 'An error occurred while fetching data' });
    }
  } 
 
  if (method === 'POST') {
    const {client, rating, description, product} = req.body;
    const reviewDoc = await Review.create({
      client,rating, description, product
    })
    res.json(reviewDoc);
  }
}

