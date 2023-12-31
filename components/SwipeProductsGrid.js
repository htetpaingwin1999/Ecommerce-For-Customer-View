import React, { useEffect } from "react";
import styled from "styled-components";
import PriceTag from './PriceTag';
import {MdKeyboardDoubleArrowRight, MdKeyboardDoubleArrowLeft} from "react-icons/md"

const SliderContainer = styled.div`
  width: 100%;
  min-height: 500px;
  position: relative;
  margin: auto;
  overflow-x: hidden;
  overflow-y: visible;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const Slide = styled.div`
  display: flex;
  position: absolute;
  left: 0;
  transition: 0.3s left ease-in-out;
`;

const ItemContainer = styled.div`
  background: #fff;
  height: fit-content;
  margin-right: 10px;
  padding: 10px; 
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const ItemImage = styled.img`
  width: 300px;
  height: auto;
  margin-right: 10px;
`

const Title = styled.p`
  color: navy;
  font-weight: bold;

`

const ControlButton = styled.button`
  background: #fff;
  border-radius: 50%;
  min-width: 50px;
  border: none;
  text-align: center;
  cursor: pointer;
  outline: none;

  position: absolute;

  top: 30%;
  
  &.pro-prev {
    left: 0;
  }

  &.pro-next {
    right: 0;
  }
`;

const YourComponent = ({ products }) => {
  useEffect(() => {
    productScroll(products.length);
  }, []);

  // console.log(products.length)

  function productScroll(productLength) {
    let slider = document.getElementById("slider");
    let next = document.getElementsByClassName("pro-next");
    let prev = document.getElementsByClassName("pro-prev");
    // let slide = document.getElementById("slide");
    let item = document.getElementById("slide");

    for (let i = 0; i < next.length; i++) {
      let position = 0;

      prev[i].addEventListener("click", function () {
        if (position > 0) {
          position -= 1;
          translateX(position);
        }
      });

      next[i].addEventListener("click", function () {
        if (position >= 0 && position < hiddenItems()) {
          position += 1;
          translateX(position);
        }
      });
    }

    function hiddenItems() {
      console.log(productLength)
      let items = getCount(item, false);
      let visibleItems = slider.offsetWidth / 1400;
      return items - Math.ceil(visibleItems);
    }
  }

  function translateX(position) {
    slide.style.left = position * -210 + "px";
  }

  function getCount(parent, getChildrensChildren) {
    let relevantChildren = 0;
    let children = parent.childNodes.length;
    for (let i = 0; i < children; i++) {
      if (parent.childNodes[i].nodeType !== 3) {
        if (getChildrensChildren)
          relevantChildren += getCount(parent.childNodes[i], true);
        relevantChildren++;
      }
    }
    return relevantChildren;
  }

  return (
    <>
    {products?.length > 0 && 
      <SliderContainer id="slider">
      <Slide id="slide">
        {products?.length > 0 &&
          products.map((product, index) => (
            <ItemContainer key={index}>
              <ItemImage
              key={index}
              className="item"
              src={product.images?.[0]}
              alt={`Product ${index + 1}`}
              />
              <Title>{product.title}
              </Title>
              <PriceTag price={product.price} />

            </ItemContainer>
            
          ))}
      </Slide>
      <ControlButton className="ctrl-btn pro-prev">
        <MdKeyboardDoubleArrowLeft size={80}></MdKeyboardDoubleArrowLeft>
      </ControlButton>
      <ControlButton className="ctrl-btn pro-next">
        <MdKeyboardDoubleArrowRight size={80}></MdKeyboardDoubleArrowRight>
      </ControlButton>
      
      </SliderContainer> 
    }
    {
      products?.length  < 1 && (
      <label style={{ marginLeft: "43%", marginRight: "50%", textAlign: "center" }}>
        အားနာပါတယ်၊ စာအုပ်တစ်အုပ်ပဲရှိပါတယ်။ ...
      </label>
      )
    }
    </>  
  );
};
export default YourComponent;
