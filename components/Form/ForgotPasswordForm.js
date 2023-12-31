import React, { useState } from 'react';
import { AiOutlineMail } from 'react-icons/ai';
import AuthButton from '../AuthButton';
import { Container, Form, FormTitle } from './ForgotPasswordElements';
import InputFeild from './InputFeild';

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState('');

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Your form submission logic here
  };

  return (
    <Container>
      {/* Assuming you have the AppLogoTitle component defined */}
      {/* Replace it with the appropriate component or remove if not needed */}

      <Form onSubmit={handleSubmit}>
        <FormTitle> Forgot Password </FormTitle>

        <InputFeild
          placeholder={'Email'}
          type="email"
          value={email}
          onChange={handleEmailChange}
          icon={<AiOutlineMail />}
          required
        />

        <AuthButton title={'Submit'} type="submit" />
      </Form>
    </Container>
  );
};

export default ForgotPasswordForm;
