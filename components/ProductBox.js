import styled, { keyframes } from "styled-components";
import Button from "../components/Button";
import CartIcon from "../components/icons/CartIcon";
import Link from "next/link";
import {useContext} from "react";
import {CartContext} from "../components/CartContext";
import { BsCart4 } from "react-icons/bs";

const ProductWrapper = styled.div`
position: relative; 
`;

const WhiteBox = styled(Link)`
// background-image: url("/woodstand.png");
  background: #fff;
  padding: 10px;
  height: 300px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  margin-bottom: 20px;
  div {
    width: inherit;
  }
  img {
    width: calc(95% - 10px); /* 5% less than parent minus 10px for border-radius */
    height: auto;
    max-width: 100%;
    border-radius: 10px;
  }
`;

const Title = styled(Link)`
  background: #b3c215;
  padding: 10px 10px;
  border-radius: 10px;
  color: #fff;
  font-weight: bold;
  font-size:.9rem;
  text-decoration:none;
  display: flex;
  margin-bottom: 30px;
`;

const ProductInfoBox = styled.div`
  margin-top: 5px;
`;

const PriceRow = styled.div`
  display: block;
  @media screen and (min-width: 768px) {
    display: flex;
    gap: 5px;
  }
  align-items: center;
  justify-content:space-between;
  margin-top:2px;
`;

const Price = styled.div`
  font-size: 1rem;
  font-weight:400;
  text-align: right;
  @media screen and (min-width: 768px) {
    font-size: 1.2rem;
    font-weight:600;
    text-align: left;
  }
`;

const AddToCartButton = styled(Button)`
  width: fit-content;
  display: flex;
  align-items: center;
  justify-content: center;
  background-image: linear-gradient(to bottom right, #119afa,#51cff5);
  font-size: 15px;
  color: #fff;
  border: 0;
  border-radius: 10px;
  padding: 8px 10px;
`;

const Cap = styled.div`
  position: absolute;
  top: 0;
  left: 0;
`;

const SpecificCap = styled.img`
  width: 100px;
  height: 100px;
  top: -310px;
  position: absolute;
  bottom: 0;
  right: 0;
`;


export default function ProductBox({_id,title,description,price,images}) {
  const {addProduct} = useContext(CartContext);
  const url = '/product/'+_id;
  return (
    <ProductWrapper>
      <WhiteBox href={url}>
        <div>
          <img src={images?.[0]} alt=""/>
        </div>
      </WhiteBox>
      
      <ProductInfoBox>
        <Title href={url}>{title}</Title>
        <PriceRow>
          <Price>
            {price}ကျပ်
          </Price>
          <AddToCartButton block onClick={() => addProduct(_id)} primary outline>
            <BsCart4 style={{ color: "#fff", borderRadius: "100%", padding: "2px"}}/>
            Add to Cart
          </AddToCartButton>
        </PriceRow>
        {/* <SpecificCap src="http://localhost:3000/event-images/1693560415264.gif" alt="wrong"/> */}
      </ProductInfoBox>
    </ProductWrapper>
  );
}