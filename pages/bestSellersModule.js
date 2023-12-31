import mongoose from "mongoose";
import { useEffect } from "react";
import { Orders } from "../models/Orders";

// async function fetchProductData(productId) {
//   try {
//     const productData = await Product.findById(productId);
    
//     if (!productData) {
//       throw new Error(`Product with ID ${productId} not found`);
//     }

//     return productData;
//   } catch (error) {
//     console.error(error);
//     return null; // Handle the error as needed
//   }
// }

const getCurrentWeekDates = () => {
    const currentDate = new Date();
    const currentDay = currentDate.getDay(); // 0 for Sunday, 1 for Monday, etc.
    const startDate = new Date(currentDate);
    startDate.setDate(currentDate.getDate() - currentDay); // Start of the current week
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6); // End of the current week
    return { startDate, endDate };
  };
  
  const getCurrentMonthDates = () => {
    const currentDate = new Date();
    const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1); // Start of the current month
    const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0); // End of the current month
    return { startDate, endDate };
  };
  
  export const getTop10BestSellers = async () => {
    const { startDate: weekStartDate, endDate: weekEndDate } = getCurrentWeekDates();
    const { startDate: monthStartDate, endDate: monthEndDate } = getCurrentMonthDates();
  
    const aggregationPipeline = [
      {
        $match: {
          createdAt: {
            $gte: weekStartDate,
            $lte: weekEndDate,
          },
          "paid": true, // Add this $match condition
        },
      },
      {
        $unwind: "$line_items",
      },
      {
        $group: {
          _id: "$line_items.price_data.product_data.productID",
          totalSales: { $sum: "$line_items.quantity" },
        },
      },
      {
        $sort: { totalSales: -1 },
      },
      {
        $limit: 10,
      },
    ];
  
    try {
      const bestSellersWeek = await Orders.aggregate(aggregationPipeline);
    
      aggregationPipeline[0].$match.createdAt = {
        $gte: monthStartDate,
        $lte: monthEndDate,
      };
    
      const bestSellersMonth = await Orders.aggregate(aggregationPipeline);
      return { bestSellersWeek };
      // return { bestSellersWeek, bestSellersMonth };
    } catch (error) {
      // console.error("Error fetching best sellers:", error);
      return { bestSellersWeek: [], bestSellersMonth: [] }; // Return empty arrays or a default value
    }
  };
  