// modules/fetchProductStockQuantity.js

import axios from 'axios';
import { mongooseConnect } from '../../lib/mongoose';
import { Product } from '../../models/Product';
import { ProductStock } from '../../models/ProductStock';
// Function to fetch product stock quantity by product ID
async function fetchProductStockQuantity(productId) {
  try {
    const productStockResponse = await axios.get(`http://localhost:3001/api/productstockquantites?productID=${productId}`);
    return productStockResponse.data;
  } catch (error) {
    console.error('Error fetching product stock quantity:', error);
      return productId;
  }
}

export { fetchProductStockQuantity };
