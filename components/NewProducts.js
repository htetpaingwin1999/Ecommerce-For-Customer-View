import styled from "styled-components";
import Center from "../components/Center";
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

export default function NewProducts({products, text}) {
  return (
    <Center>
      <Title>{text}</Title>
      <ProductsGrid products={products} />
    </Center>
  );
}