import React, { useState } from 'react';
import OTPInput from './OTPInput';
import Swal from 'sweetalert2';
import styled from "styled-components";
import { useRouter } from 'next/router';
import axios from 'axios';

const OtpVerifyButton = styled.button`
  padding: 10px 20px;
  background: #23C687;
  color: white;
  border-radius: 10px;
  margin-top: 10px;
  border: 0;
  outline: 0;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;

  &:hover {
    background-color: #888888;
  }

  &:active {
    transform: scale(0.95);
  }
`;

const OTPVerificationForm = ({ email, otpCode, otpExpiresAt }) => {
  const [otpInput, setOtpInput] = useState('');
    console.log("OtpCode"+otpCode + email + otpExpiresAt)
    const router = useRouter();

    
  const handleOTPComplete = async(enteredOTP) => {
    if (enteredOTP === otpCode) {
      // OTP verification successful, call handleLogin function to proceed with login
      
      const currentDateTime = new Date();
      const otpExpiresAtTime = new Date(otpExpiresAt);
      console.log("otpExpiresAtTime in OTPVerification Form.js:"+otpExpiresAtTime);

      if (currentDateTime <= otpExpiresAtTime) {
        // OTP verification successful, call the PUT method of /api/signup.js to update OTP verification status
        try {
          const response = await axios.put('/api/signup', { email }); // Make the PUT request
          if (response.data.success) {
            console.log('Logged In');      
            router.push('/login'); // Replace '/login' with the actual URL of your login page
          } else {
            console.error('PUT request failed:', response.data.error);
          }
        } catch (error) {
          console.error('Error during PUT request:', error);
        }
      }else {
        // OTP verification has expired, show an error alert
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'OTP verification has expired. Please request a new one by signuping again.'
        });
      }
      
    } else {
      // Incorrect OTP, show an error alert
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Incorrect OTP. Please try again.'+otpExpiresAt+"Hello",
      });
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // ... handle form submission or any other logic ...
  };

  return (
    <form onSubmit={handleSubmit}>
      <OTPInput numInputs={6} value={otpInput} onComplete={handleOTPComplete} />
      <OtpVerifyButton type="submit">Verify</OtpVerifyButton>
    </form>
  );
};

export default OTPVerificationForm;
