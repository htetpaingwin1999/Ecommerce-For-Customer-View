import React from 'react';
import styled from 'styled-components';

const PriceTag = ({ price }) => {
  return (
    <CardPrice>
      <Triangle />
      <Price>{price}ကျပ်</Price>
      <Circle />
    </CardPrice>
  );
};

const CardPrice = styled.div`
  display: inline-block;
  height: 38px;
  background-color: #119afa;
  border-radius: 3px 4px 4px 3px;
  border-left: 1px solid #119afa;
  margin-left: 19px;
  position: relative;
  color: white;
  font-weight: 300;
  font-size: 22px;
  line-height: 38px;
  padding: 0 10px;
`;

const Triangle = styled.div`
  position: absolute;
  display: block;
  left: -19px;
  width: 0;
  height: 0;
  border-top: 19px solid transparent;
  border-bottom: 19px solid transparent;
  border-right: 19px solid #119afa;
`;

const Circle = styled.div`
  content: "";
  background-color: white;
  border-radius: 50%;
  width: 4px;
  height: 4px;
  display: block;
  position: absolute;
  left: -9px;
  top: 17px;
`;

const Price = styled.span``;

export default PriceTag;
