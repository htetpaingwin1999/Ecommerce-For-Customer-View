import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Center from "../components/Center";
import { getTop10BestSellers } from "../pages/bestSellersModule";
import ProductsGrid from "../components/ProductsGrid";

const Title = styled.h2`

  font-family: 'Rocher';
  text-align: center;
  font-size: 30px;
  margin: 30px 0 20px;
  font-weight: normal;
  color: #119afa;
  text-shadow: 1px 1px 1px #000;
`;

const Bg = styled.div`
  color: #eee;
  padding: 50px 0;
`;

const CenteredImageWrapper = styled.div`
  background: #eee;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 250px;
  overflow: hidden;
`;

const CenteredImage = styled.img`
  max-width: 35%;
  max-height: auto;
  object-fit: contain;
  margin-top: -20px;
`;

export default function  BestSeller({products}) {
  // console.log("Best Sellers Page Start")
  // console.log(products)
  // console.log("Best Sellers Page End")
  // Get the current date
  const currentDate = new Date();

  // Determine the current month
  const currentMonth = currentDate.getMonth(); // Month is zero-based

  // Determine the current week of the month
  const currentDayOfMonth = currentDate.getDate();
  let weekNumber;
  if (currentDayOfMonth >= 1 && currentDayOfMonth <= 7) {
    weekNumber = "1";
  } else if (currentDayOfMonth >= 8 && currentDayOfMonth <= 14) {
    weekNumber = "2";
  } else if (currentDayOfMonth >= 15 && currentDayOfMonth <= 21) {
    weekNumber = "3";
  } else if(currentDayOfMonth >=22 && currentDayOfMonth <=29){
    weekNumber = "4";
  }else{
    weekNumber = "5";
  }

  // Define an array of month names
  const monthNames = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];
  
  // Generate the image URL based on the current month and week
  const imageUrl = `/${monthNames[currentMonth]}${weekNumber}.png`;
  
  return (
    <Bg>
      <CenteredImageWrapper>
        <CenteredImage src={imageUrl} alt="Bestseller" />
      </CenteredImageWrapper>
      <Center>
      <ProductsGrid products={products} />
    </Center>
    </Bg>
  );
}