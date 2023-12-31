import React, { useState } from 'react';
import styled from "styled-components"

const OtpInputBox = styled.input`
  background: #fff;
  padding: 5px 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
  outline: none;
  text-align: center;

  /* Additional styles for the input (optional) */
  /* You can add more styles based on your preferences */
  width: 40px; /* Example: Set a fixed width for each input */
  margin: 5px; /* Example: Add margin between each input */
  box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.1); /* Example: Add a box shadow */

  &:focus {
    border-color: #23C687; /* Example: Change border color on focus */
  }
`;

const OTPInput = ({ numInputs = 6, onComplete }) => {
  const [otp, setOTP] = useState(new Array(numInputs).fill(''));

  const handleChange = (index, value) => {
    setOTP((prevOTP) => {
      const newOTP = [...prevOTP];
      newOTP[index] = value;
      return newOTP;
    });
  };

  const handleKeyUp = (index, event) => {
    // Handle the key events as before

    const enteredOTP = otp.join('');
    if (enteredOTP.length === numInputs) {
      onComplete(enteredOTP);
    }
  };

  return (
    <div className="otp-input-container">
      {otp.map((digit, index) => (
        <OtpInputBox
          key={index}
          type="tel"
          value={digit}
          maxLength={1}
          onChange={(event) => handleChange(index, event.target.value)}
          onKeyUp={(event) => handleKeyUp(index, event)}
        />
      ))}
    </div>
  );
};

export default OTPInput;
