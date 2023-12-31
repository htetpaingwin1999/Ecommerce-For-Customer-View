// import { useState } from 'react';

// const Login = () => {
//   const [phoneNumber, setPhoneNumber] = useState('');
//   const [otp, setOTP] = useState('');
//   const [message, setMessage] = useState('');

//   const handleSendOTP = async () => {
//     try {
//       const response = await fetch('/api/sendOTP', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ phoneNumber }),
//       });
//       const data = await response.json();
//       setMessage(data.message);
//     } catch (error) {
//       console.error('Error sending OTP:', error);
//       setMessage('Error sending OTP. Please try again.');
//     }
//   };

//   const handleVerifyOTP = async () => {
//     try {
//       const response = await fetch('/api/verifyOTP', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ otp }),
//       });
//       const data = await response.json();
//       setMessage(data.message);
//     } catch (error) {
//       console.error('Error verifying OTP:', error);
//       setMessage('Invalid OTP code. Please try again.');
//     }
//   };

//   return (
//     <div>
//       <h1>Login with OTP</h1>
//       {message && <p>{message}</p>}
//       {!message && (
//         <>
//           <input
//             type="text"
//             placeholder="Enter your phone number"
//             value={phoneNumber}
//             onChange={(e) => setPhoneNumber(e.target.value)}
//           />
//           <button onClick={handleSendOTP}>Send OTP</button>
//         </>
//       )}
//       {!message && phoneNumber && (
//         <>
//           <input
//             type="text"
//             placeholder="Enter the OTP code"
//             value={otp}
//             onChange={(e) => setOTP(e.target.value)}
//           />
//           <button onClick={handleVerifyOTP}>Verify OTP</button>
//         </>
//       )}
//     </div>
//   );
// };

// export default Login;
import React from 'react'
import LoginForm from '../components/Form/LoginForm.js'

const login = () => {
    return (
        <LoginForm />
    )
}

export default login