import styled from "styled-components";
import ServiceBox from "./ServiceBox";

const StyledContainer = styled.div`
// background-image: url("/woodstand.png");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
  padding: 20px;

  @media screen and (min-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const YourComponent = ({ services }) => {
  return (
    <StyledContainer>
      {services?.length > 0 &&
        services.map((service) => (
          <ServiceBox key={service._id} {...service} />
        ))}
    </StyledContainer>
  );
};

export default YourComponent;
