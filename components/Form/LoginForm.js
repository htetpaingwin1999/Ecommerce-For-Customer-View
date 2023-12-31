import React, { useState } from 'react';
import { AiOutlineMail, AiOutlineUnlock } from 'react-icons/ai';
import AuthButton from '../AuthButton';
import axios from 'axios';
import { useAuth } from './AuthContext';
import {
  Container,
  Form,
  FormTitle,
  InfoText,
  InfoTextContainer,
  Link
} from './FormElements';
import InputFeild from './InputFeild.js';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(null); // State variable for login error

  const { login } = useAuth();

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleLogin = async (event) => {
    event.preventDefault();
  
    try {
      const response = await axios.post('/api/login', {
        email,
      password,
      });

  
      if (response.data.__v == -1) {
        // If __v is -1, the user is not allowed to buy products
        setLoginError('You are not allowed to buy products from this site.');
      } else if (response.status === 200 && response.data.token) {
        // Successful login
        const token = response.data.token;
        const userName = response.data.userName;
        const userID = response.data.userID;
        const UserEmail = response.data.email;
  
        localStorage.removeItem('jwtToken');
        localStorage.removeItem('UsernameForTainHlwar');
        localStorage.removeItem('UserIDforTainHlwar');
        localStorage.removeItem('UserEmail');
        login(token);
  
        localStorage.setItem('jwtToken', token);
        localStorage.setItem('UsernameForTainHlwar', userName);
        localStorage.setItem('UserIDforTainHlwar', userID);
        localStorage.setItem('UserEmail', email);
  
        window.location.href = '/'; // Redirect the user to the dashboard or any authenticated page
      } else {
        // Login failed, set the error message
        setLoginError('Login failed. Please check your email and password.');
      }
    } catch (error) {
      console.error('Error during login:', error);
      setLoginError('An error occurred during login.');
    }
  };

  return (
    <Container>
      <Form onSubmit={handleLogin}>
        <FormTitle> Login </FormTitle>

        <InputFeild
          placeholder="Email"
          type="text"
          icon={<AiOutlineMail />}
          value={email}
          onChange={handleEmailChange}
          required
        />

        <InputFeild
          placeholder="Password"
          type="password"
          icon={<AiOutlineUnlock />}
          value={password}
          onChange={handlePasswordChange}
          required
        />

        <Link href="/forgot-password">Forgot Password?</Link>

        <AuthButton type="submit" title="Login" />

        {loginError && <div className="error-message">{loginError}</div>} {/* Display error message */}
        
        <InfoTextContainer>
          <InfoText>New User?</InfoText>
          <Link href="/signup">Create an Account</Link>
        </InfoTextContainer>
      </Form>
    </Container>
  );
};

export default LoginForm;
