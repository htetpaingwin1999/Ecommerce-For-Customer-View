import React, { useState } from 'react';
import { BsPerson } from 'react-icons/bs';
import { AiOutlineMail, AiOutlineUnlock } from 'react-icons/ai';
import { RiLockPasswordLine } from 'react-icons/ri';
import Swal from 'sweetalert2';
import axios from 'axios';
import OTPVerificationForm from "./OTPVerificationForm"
import { useAuth } from './AuthContext';

import {
  Container,
  Form,
  FormTitle,
  InfoText,
  InfoTextContainer,
  Link,
} from './FormElements';
import InputFeild from './InputFeild.js';
import AuthButton from '../AuthButton';
import emailjs from 'emailjs-com'

const  SignupForm = () => {
  const { login } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [responseEmail, setResponseEmail] = useState('');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [otpCode, setOtpCode] = useState('');
  
  const [signupSuccess, setSignupSuccess] = useState(false);
  const [showResendButton, setShowResendButton] = useState(false); // Step 1: State for resending OTP button
  const [otpExpiresAt, setOtpExpiresAt] = useState('')

//   const transporter = nodemailer.createTransport({
//     service: 'zoho',
//     host: 'smtpro.zoho.in',
//     port: 465,
//     secure: true,
//     auth: {
//         user: 'htetpaingwin1999@gmail.com',
//         pass: process.env.NEXT_PUBLIC_PASSWORD
//     }
// })



  const handleResendOTP = async () => {
    try {
      // Send a request to your API endpoint to resend OTP
      const response = await axios.get('/api/resend-otp', { email });

      if (response.data?.success) {
        // OTP resent successfully
        // You can update the state or show a success message if needed
        Swal.fire({
          icon: 'success',
          title: 'OTP Resent!',
          text: 'A new OTP has been sent to your email address.',
        });
      } else {
        // OTP resend failed, show an error message
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Failed to resend OTP. Please try again later.',
        });
      }
    } catch (error) {
      // Handle any errors that occur during OTP resending
      console.error('Error resending OTP:', error);
    }
  };
  
  const sendTestEmail = async (email, otpCode) => {
    // emailjs.init('TZik3nfBTm1n151_j');
  
    // try {
    //   const response = await emailjs.send("service_lipgrau","template_g07dxna",{
    //     from_name: "htetpaingwin1999@gmail.com",
    //     to_name: email,
    //     otp: otpCode,
    //     message: "wertg",
    //     reply_to: "+959...",
    //     });
  
    //   console.log('Email sent:', response);
    // } catch (error) {
    //   console.error('Error sending email:', error);
    // }

    const emailData = {
      to: email,
      subject: 'OTP Code From တိမ်လွှာစာပေ',
      text: 'မင်္ဂလာပါ၊ လူကြီးမင်းရဲ့ OTP Code နံပါတ်၆လုံးမှာ('+otpCode+")ဖြစ်ပါတယ်ရှင်။ OPT Codeကို ၃မိနစ်အတွင်း ရိုက်ထည့်ပေးပါရှင်။ ၃မိနစ်ကျော်သွားပါက နောက်တစ်ခေါက် signup လုပ်ပေးပါရှင်။",
    };

    console.log("Email Data" + emailData);
    
    fetch('/api/sendEmail', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailData),
    })
      .then((response) => response.json())
      .then((data) => console.log(data))
      .catch((error) => console.error(error));
  };
  
  const handleSignup = async (event) => {
    event.preventDefault();
  
    if (password !== confirmPassword) {
      // Passwords don't match, show an error alert
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Passwords do not match!',
      });
      return;
    }
  
    try {
      // Send the form data to the server to create the client account
      const response = await axios.post('/api/signup', {
        fullName,
        email,
        password,
      });
  
      if (response.data?.success) {
        // Account creation succeeded
        const { otpExpiresAt, otpCode } = response.data;
  
        // Set state variables with the received data
        sendTestEmail(email,otpCode);

        setOtpExpiresAt(otpExpiresAt);
        setOtpCode(otpCode);
        setResponseEmail(email);
  
        // Log the data (optional)
        console.log("Response Data");
        console.log("otpCode:", otpCode);
        console.log("responseEmail:", email);
        console.log("otpExpiresAt:", otpExpiresAt);
  
        // Check if all required data is set before setting signup success
        if (email && otpExpiresAt && otpCode) {
          setSignupSuccess(true);
          console.log("Get Complete data");
          console.log(response.data);
        }
  
        // Clear form fields
        setFullName('');
        setPassword('');
        setConfirmPassword('');
  
        // Show a success alert using SweetAlert2
        Swal.fire({
          icon: 'success',
          title: 'Account Created!',
          text: 'Your account has been successfully created.',
        });
      } else {
        // Account creation failed, show an error alert
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Something went wrong. Please try again later.',
        });
      }
    } catch (error) {
      // Handle any errors that occur during form submission or account creation
      console.error('Error during signup:', error);
  
      // Show an error alert using SweetAlert2
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Something went wrong. Please try again later.',
      });
    }
  };
  

  return (
    <Container>
      <Form onSubmit={handleSignup}>
        <FormTitle> Sign Up </FormTitle>

        <InputFeild
          type="text"
          placeholder={'Full Name'}
          value={fullName}
          onChange={(event) => setFullName(event.target.value)}
          icon={<BsPerson />}
          required
        />
        <InputFeild
          type="email"
          placeholder={'Email'}
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          icon={<AiOutlineMail />}
          required
        />
        <InputFeild
          type="password"
          placeholder={'Password'}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          icon={<AiOutlineUnlock />}
          required
        />
        <InputFeild
          type="password"
          placeholder={'Confirm Password'}
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          icon={<RiLockPasswordLine />}
          required
        />

        <AuthButton title={'Sign up'} type="submit" />

        <InfoTextContainer>
          <InfoText>Already have an account?</InfoText>
          <Link href={'/login'}>Login</Link>
        </InfoTextContainer>
      </Form>

      {signupSuccess && (
        <>
        <OTPVerificationForm
          email={responseEmail}
          otpCode={otpCode}
          otpExpiresAt = {otpExpiresAt}
        />
        {/* <button onClick={handleResendOTP} className="resend-otp-button">
          Resend OTP
        </button> */}
        </>
        
      )}
      
    </Container>
  );
};

export default SignupForm;
