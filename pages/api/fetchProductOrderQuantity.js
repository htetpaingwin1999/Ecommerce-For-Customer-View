// modules/fetchProductOrderQuantity.js

import axios from 'axios';

// Function to fetch product order quantity by product ID
async function fetchProductOrderQuantity(productId) {
  try {
    const productOrderResponse = await axios.get(`http://localhost:3001/api/productorderquantities?productID=${productId}`);
    return productOrderResponse.data;
  } catch (error) {
    console.error('Error fetching product order quantity:', error);
    return 0; // Return 0 as a default value or handle the error as needed
  }
}

export { fetchProductOrderQuantity };
