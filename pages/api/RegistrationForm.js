// components/RegistrationForm.js

import { useState } from 'react';
import axios from 'axios';
import OTPInput from 'react-otp-input';

const RegistrationForm = () => {
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOTP] = useState('');
  const [showOTPForm, setShowOTPForm] = useState(false);

  const handleRegistration = async (e) => {
    e.preventDefault();

    try {
      // Send a POST request to your backend API to handle user registration
      const response = await axios.post('/api/register', {
        name,
        phoneNumber,
      });

      console.log(response.data); // You can handle the response as per your requirements

      // Show OTP form for verification
      setShowOTPForm(true);
    } catch (error) {
      console.error(error);
      // Handle error scenario
    }
  };

  const handleOTPVerification = async (e) => {
    e.preventDefault();
    console.log("Enter otp " + otp);
    try {
      // Send a POST request to your backend API to verify OTP
      const response = await axios.post('/api/verify-otp', {
        phoneNumber,
        otpEntered: otp,
      });

      console.log(response.data); // You can handle the response as per your requirements

      // Assuming the OTP verification is successful, you can show a success message or redirect the user
    } catch (error) {
      console.error(error);
      // Handle error scenario
    }
  };

  return (
    <div>
      <h2>User Registration</h2>
      {!showOTPForm ? (
        <form onSubmit={handleRegistration}>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          /><br /><br />

          <label htmlFor="phoneNumber">Phone Number:</label>
          <input
            type="text"
            id="phoneNumber"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
          /><br /><br />

          <button type="submit">Register</button>
        </form>
      ) : (
        <form onSubmit={handleOTPVerification}>
          <label htmlFor="otp">Enter OTP:</label>
          <OTPInput
            value={otp}
            onChange={setOTP}
            numInputs={6} // You can adjust the number of OTP digits here
            isInputNum={true}
            shouldAutoFocus={true}
          /><br /><br />

          <button type="submit">Verify OTP</button>
        </form>
      )}
    </div>
  );
};

export default RegistrationForm;
