import React from "react";
import styled, { keyframes } from "styled-components";

const flameGlow = keyframes`
  0% {
    text-shadow: 0 0 5px #ff5722, 0 0 10px #ff5722, 0 0 15px #ff5722, 0 0 20px #ff5722, 0 0 25px #ff5722, 0 0 30px #ff5722, 0 0 35px #ff5722;
  }
  50% {
    text-shadow: 0 0 10px #ff5722, 0 0 20px #ff5722, 0 0 30px #ff5722, 0 0 40px #ff5722, 0 0 50px #ff5722, 0 0 60px #ff5722, 0 0 70px #ff5722;
  }
  100% {
    text-shadow: 0 0 5px #ff5722, 0 0 10px #ff5722, 0 0 15px #ff5722, 0 0 20px #ff5722, 0 0 25px #ff5722, 0 0 30px #ff5722, 0 0 35px #ff5722;
  }
`;

const MarqueeContainer = styled.div`
  background-color: red;
  overflow: hidden;
  white-space: nowrap;
  position: relative;
`;

const MarqueeText = styled.div`
  display: inline-block;
  font-size: 24px;
  color: #fff;
  animation: ${flameGlow} 1s ease-in-out infinite;
  padding: 10px;
  margin-left: 100%; /* Initial position outside the container */
  animation-duration: 20s; /* Adjust this value to control marquee speed */
`;

function Marquee({ text }) {
  return (
    <MarqueeContainer>
      <MarqueeText>
        {text}hello
      </MarqueeText>
    </MarqueeContainer>
  );
}

export default Marquee;
