import {mongooseConnect} from "../../lib/mongoose";
import {Product} from "../../models/Product";
import { useRouter } from 'next/router';
import { OrderByClient } from "../../models/OrderByClient";


export default async function handler(req,res) {
  res.json(req.method);
  if (req.method !== 'POST') {
    res.json('should be a POST request');
    return;
  }
  const {
    clientID,
    phone,city,
    postalCode,streetAddress,country,
    note,
    cartProducts,
  } = req.body;

  res.json(req.body.phone +"PHONE");

  await mongooseConnect();
  const productsIds = cartProducts;
  const uniqueIds = [...new Set(productsIds)];
  const productsInfos = await Product.find({_id:uniqueIds});

  let line_items = [];
  for (const productId of uniqueIds) {
    const productInfo = productsInfos.find(p => p._id.toString() === productId);
    const quantity = productsIds.filter(id => id === productId)?.length || 0;
    if (quantity > 0 && productInfo) {
      line_items.push({
        quantity,
        price_data: {
          currency: 'Kyats',
          product_data: {name:productInfo.title},
          unit_amount: quantity * productInfo.price * 100,
        },
      });
    }
  }

  res.json(req.body);


  const orderDoc = await OrderByClient.create({
    clientID,
    line_items,phone,city,postalCode,
    streetAddress,country,note,paid:false,
  });

  const currentPort = process.env.PORT || 3000;
  const url = `http://localhost:3001/cart?success=1`;
  
  res.json({
  url: url
});
}