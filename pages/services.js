import Header from "../components/Header";
import styled, { keyframes } from "styled-components";
import Center from "../components/Center";
import { mongooseConnect } from "../lib/mongoose";
import { Service } from "../models/Service";
import ServicesGrid from "../components/ServicesGrid";

const Title = styled.h1`
  font-size: 1.5em;
  text-align: center;
  margin-top: 30px;
  position: relative;
`;

const butterflyFlight = keyframes`
  0% {
    transform: translateX(-100%) translateY(0%);
  }
  20% {
    transform: translateX(20%) translateY(20%);
  }
  40% {
    transform: translateX(30%) translateY(40%);
  }
  80% {
    transform: translateX(40%) translateY(50%);
  }
  100% {
    transform: translateX(50%) translateY(40%);
  }
`;

const FlyingButterfly = styled.span`
  position: absolute;
  display: inline-block;
  animation: ${butterflyFlight} 10s linear infinite;
`;

export default function ServicesPage({ services }) {
  return (
    <>
      <Header />
      <Center>
        <Title>
          {/* <FlyingButterfly> */}
            {/* <img src="/butterfly.gif" alt="Butterfly" /> */}
          {/* </FlyingButterfly> */}
          ရရှိနိုင်သော ဝန်ဆောင်မှုများ
          {/* <FlyingButterfly>
            <img src="./butterfly.gif" alt="Butterfly" />
          </FlyingButterfly> */}
        </Title>
        <ServicesGrid services={services} />
      </Center>
    </>
  );
}

export async function getServerSideProps() {
  await mongooseConnect();
  const services = await Service.find({}, null, { sort: { _id: -1 } });
  return {
    props: {
      services: JSON.parse(JSON.stringify(services)),
    },
  };
}
