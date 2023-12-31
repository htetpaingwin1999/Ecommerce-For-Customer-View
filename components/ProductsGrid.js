import styled from "styled-components";
import ProductBox from "../components/ProductBox";

const StyledContainer = styled.div`
// background-image: url("/woodstand.png");
  color: #000;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 50px;
  padding: 20px;

  @media screen and (min-width: 768px) {
    grid-template-columns: 1fr 1fr 1fr 1fr;
  }
`;

const YourComponent = ({ products }) => {
  // console.log("Products in ProductsGrids Start")
  // console.log(products)
  // console.log("Products in ProductsGrids End")
  // console.log(products.length)
  return (
    <StyledContainer>
      {products?.length > 0 &&
        products.map((product) => (
          <ProductBox key={product._id} {...product} />
        ))}
    </StyledContainer>)

};

export default YourComponent;
