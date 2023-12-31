import React from 'react';
// Assuming the ButtonProps type is imported from '../../types/propTypes'
// If you don't need the type, you can remove this import
// import { ButtonProps } from '../../types/propTypes';
import { Container } from './ButtonElements';

const Button = ({ title, type }) => {
  return <Container type={type}>{title}</Container>;
};

export default Button;
