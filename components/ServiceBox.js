import styled from "styled-components";
import Button from "./Button";
import Link from "next/link";
import {useContext} from "react";
import {CartContext} from "./CartContext";

const ServiceWrapper = styled.div`
    width: 80%;
    margin: 0 10%;
    margin-bottom: 20px;
    background: #fff;
    display: grid;
    grid-template-columns: 0.2fr 1fr;
    border-radius:30px;
`;

const WhiteBox = styled(Link)`
  padding: 0px;
  height: 300px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
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
  font-weight: bold;
  font-size:1.5rem;
  color:#119afa;
  text-decoration:none;
  display: flex;
  justify-content: left;
  margin:3px 20px;
`;

const ServiceInfoBox = styled.div`
  margin-top: 5px;
  display: flex;
  flex-direction: column;
  
`;

const Description = styled.div`
  /* Your styling goes here */
  display: flex;
  justify-content: center;
  align-items: center;
`;

const DescriptionContent = ({ description }) => (
    <div dangerouslySetInnerHTML={{ __html: description }} />
  );
  
export default function ServiceBox({_id,title,description,image}) {
    const url = '/service/'+_id;
  return (
    <ServiceWrapper>
      <WhiteBox href={url}>
        <div>
          <img src={image} alt=""/>
        </div>
      </WhiteBox>
      <ServiceInfoBox>
        <Title href={url}>{title}</Title>
        <Description>
            <DescriptionContent description={description} />
        </Description>
      </ServiceInfoBox>
    </ServiceWrapper>
  );
}