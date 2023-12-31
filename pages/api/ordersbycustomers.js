// pages/api/ordersbycustomer.js

import { mongooseConnect } from "../../lib/mongoose";
import { Orders } from "../../models/Orders";
export default async function handler(req, res) {
  await mongooseConnect();
  const { method, query, body } = req;

  if (method === "GET") {
    if (!query.clientID) {
      return res.status(400).json({ error: 'clientID query parameter is required' });
    }

    const clientID = query.clientID;
    
    try {
      const orders = await Orders.find({ clientID }).sort({ createdAt: -1 });
      res.json(orders);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while fetching orders' });
    }
  }

  // Handle other HTTP methods if needed (PUT, POST, DELETE, etc.)
}
