// import { useState } from "react";
// import {mongooseConnect} from "../../lib/mongoose";
// import { DiscountByProduct } from "../../models/DiscountByProduct";
// import { Orders } from "../../models/Orders";
// import {Product} from "../../models/Product";
// import axios from "axios";
// import { fetchProductStockQuantity } from "./fetchProductStockQuantity";
// import { fetchProductOrderQuantity } from "./fetchProductOrderQuantity";
// import sendEmail from "./sendEmail";

// export default async function handler(req,res) {
 
//   const {
//     clientID,phone,city,
//     streetAddress,note,
//     cartProducts,
//     line_discountbyamount
//   } = req.body;
//   await mongooseConnect();
//   // res.json("Line Discount By Amount"+line_discountbyamount.amount);
//   const productsIds = cartProducts;
//   const uniqueIds = [...new Set(productsIds)];
//   const productsInfos = await Product.find({_id:uniqueIds});
//   let line_items = [];
//   let line_productsdiscount = [];

//   let totalPayAmount = 0;

//   for (const productId of uniqueIds) {
//     // res.json("Product ID"+productId);
//     const discounByProductData = await DiscountByProduct.findOne({ productId: productId });
//     // res.json(discounByProductData);
    
//     const productInfo = productsInfos.find(p => p._id.toString() === productId);
//     const quantity = productsIds.filter(id => id === productId)?.length || 0;
//     if (quantity > 0 && productInfo && discounByProductData === null) {
    
//       let productStockQuantity =parseInt(await fetchProductStockQuantity(productId));
      
//       // res.json(productStockQuantity);
     
//       let productOrderQuantity = parseInt((await fetchProductOrderQuantity(productId)).totalQuantity);
//       // res.json(productOrderQuantity);

//       // res.json(quantity);

//       // Calculate the difference between product stock quantity and product order quantity
//       let quantityDifference = productStockQuantity - (productOrderQuantity+quantity);
//       // res.json(quantityDifference);
//       // // If the difference is less than or equal to 5, send an email
//       if (quantityDifference <= 5) {
//         const emailData = {
//           to: 'htetpaignwin1999@gmail.com',
//           subject: 'Low Stock Alert',
//           text: `Product stock quantity is low for product: ${productInfo.title}`,
//         };
//       // res.json(emailData);
//         // Send an email using the sendEmail API
//       const emailResponse =   await axios.post('http://localhost:3001/api/sendEmail', emailData);
//       res.json(emailResponse);
//       } 
      
//       line_items.push({
//         quantity,
//         price_data: {
//           currency: 'ကျပ်',
//           product_data: {productID:productInfo._id, productTitle: productInfo.title},
//           unit_amount: quantity * productInfo.price,
//           total_amount: (quantity * productInfo.price) ,
//           pay_amount: (quantity * productInfo.price) ,
//         },
//       });
//     }

//     if (quantity > 0 && productInfo && discounByProductData !== null) {

//       totalPayAmount = totalPayAmount + quantity*(productInfo.price - ((productInfo.price * discounByProductData.discount_percentage)/100));
//       line_items.push({
//         quantity,
//         price_data: {
//           currency: 'ကျပ်',
//           product_data: {clientID:productInfo.title},
//           unit_amount: productInfo.price,
//           total_amount: (quantity * productInfo.price) ,
//           pay_amount: quantity*(productInfo.price - ((productInfo.price * discounByProductData.discount_percentage)/100))
//         },
//         discount_data: {
//           discountByProductId: discounByProductData._id,
//           start_date: discounByProductData.start_date,
//           end_date: discounByProductData.end_date,
//           discount_percentage: discounByProductData.discount_percentage
//         }
//       });
//     }
//   }

//   if(line_discountbyamount){
//     if(totalPayAmount > line_discountbyamount.amount){
//       const orderDoc = await Orders.create({
//         line_items,line_discountbyamount,
//         clientID,phone,city,
//         streetAddress,note,paid:false,
//         status: 0
//       });
//     }
//     else{
//       const orderDoc = await Orders.create({
//         line_items,
//         clientID,phone,city,
//         streetAddress,note,paid:false,
//         status: 0,
//       });
//     }
//   }
//   else{
//     const orderDoc = await Orders.create({
//       line_items,
//       clientID,phone,city,
//       streetAddress,note,paid:false,
//       status: 0,
//     });
//   }
  
//   const currentPort = process.env.PORT || 3000;
//   // const url = `http://localhost:3001/cart?success=1`
//   // res.json({
//   //   url: url
//   // });

// }

import { useState } from "react";
import { mongooseConnect } from "../../lib/mongoose";
import { DiscountByProduct } from "../../models/DiscountByProduct";
import { Orders } from "../../models/Orders";
import { Product } from "../../models/Product";
import nodemailer from "nodemailer"; // Import nodemailer
import { fetchProductStockQuantity } from "./fetchProductStockQuantity";
import { fetchProductOrderQuantity } from "./fetchProductOrderQuantity";

export default async function handler(req, res) {
  const {
    clientID,
    clientEmail,
    phone,
    city,
    streetAddress,
    note,
    cartProducts,
    line_discountbyamount,
  } = req.body;
  await mongooseConnect();

  const productsIds = cartProducts;
  const uniqueIds = [...new Set(productsIds)];
  const productsInfos = await Product.find({ _id: uniqueIds });
  let line_items = [];
  let line_productsdiscount = [];

  let totalPayAmount = 0;

  for (const productId of uniqueIds) {
    const discounByProductData = await DiscountByProduct.findOne({
      productId: productId,
    });

    const productInfo = productsInfos.find(
      (p) => p._id.toString() === productId
    );
    const quantity =
      productsIds.filter((id) => id === productId)?.length || 0;
    if (quantity > 0 && productInfo && discounByProductData === null) {
      let productStockQuantity = parseInt(
        await fetchProductStockQuantity(productId)
      );

      let productOrderQuantity = parseInt(
        (await fetchProductOrderQuantity(productId)).totalQuantity
      );

      // Calculate the difference between product stock quantity and product order quantity
      let quantityDifference = productStockQuantity - (productOrderQuantity + quantity);

      const transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
          user: "htetpaingwin1999@gmail.com", // Replace with your email address
          pass: "rzkjgyajgtejcbwd", // Replace with your email password
        },
      });

      // If the difference is less than or equal to 5, send an email
      if (quantityDifference <= 5) {
        // Create a nodemailer transporter with your SMTP settings
        
        // Define the email message
        const mailOptions = {
          from: "htetpaingwin1999@gmail.com", // Replace with your email address
          to: "htetpaingwin1999@gmail.com", // Replace with the recipient's email address
          subject: "Low Stock Alert",
          text: `Product stock quantity is low for product: ${productInfo.title}`,
        };

        // Send the email
        const info1 = await transporter.sendMail(mailOptions);

        
      }

      const mailOptions2 = {
        from: "htetpaingwin1999@gmail.com", // Replace with your email address
        to: clientEmail, // Replace with the recipient's email address
        subject: "Order တင်ပြီးကြောင်း ",
        text: `ခုလို order တင်ပေးတဲ့အတွက် ကျေးဇူးတင်ပါတယ်ရှင်၊ တိမ်လွှာမှ လူကြီးမင်း၏ order ကို confirm ပြီးမှ Epayment လုပ်ဆောင်လို့ရမှာဖြစ်ပါတယ်ရှင်။
        ငွေလွှဲရန် ဖုန်းနံပါတ်များ 
        09 *** *** *** (KPay)
        09 *** *** *** (WavePay)
        09 *** *** *** (AyaPay)
        09 *** *** *** (CBPay)
        `,
      };


      // Send the email
      const info2 = await transporter.sendMail(mailOptions2);

      line_items.push({
        quantity,
        price_data: {
          currency: "ကျပ်",
          product_data: {
            productID: productInfo._id,
            productTitle: productInfo.title,
          },
          unit_amount: quantity * productInfo.price,
          total_amount: quantity * productInfo.price,
          pay_amount: quantity * productInfo.price,
        },
      });
    }

    if (quantity > 0 && productInfo && discounByProductData !== null) {
      totalPayAmount = totalPayAmount +
        quantity *(productInfo.price -(productInfo.price * discounByProductData.discount_percentage) /100);
      line_items.push({
        quantity,
        price_data: {
          currency: "ကျပ်",
          product_data: {  productID: productInfo._id,
            productTitle: productInfo.title, },
          unit_amount: productInfo.price,
          total_amount: quantity * productInfo.price,
          pay_amount:
            quantity *
            (productInfo.price -
              (productInfo.price * discounByProductData.discount_percentage) /
                100),
        },
        discount_data: {
          discountByProductId: discounByProductData._id,
          start_date: discounByProductData.start_date,
          end_date: discounByProductData.end_date,
          discount_percentage: discounByProductData.discount_percentage,
        },
      });
    }
  }

  if (line_discountbyamount) {
    if (totalPayAmount > line_discountbyamount.amount) {
      const orderDoc = await Orders.create({
        line_items,
        line_discountbyamount,
        clientID,
        phone,
        city,
        streetAddress,
        note,
        paid: false,
        status: 0,
      });
    } else {
      const orderDoc = await Orders.create({
        line_items,
        clientID,
        phone,
        city,
        streetAddress,
        note,
        paid: false,
        status: 0,
      });
    }
  } else {
    const orderDoc = await Orders.create({
      line_items,
      clientID,
      phone,
      city,
      streetAddress,
      note,
      paid: false,
      status: 0,
    });
  }

  const currentPort = process.env.PORT || 3000;
  const url = `http://localhost:3001/cart?success=1`
  res.json({
    url: url
   });
}
