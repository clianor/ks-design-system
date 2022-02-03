import React, { ButtonHTMLAttributes } from 'react';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';

const StyledButton = styled(motion.button)`
  padding: 8px 16px;
  color: white;
  background-color: green;
  border: none;
  border-radius: 5px;
  cursor: pointer;
`;

export interface ButtonProps
  extends Pick<ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
  text: string;
}

const variants = {
  hover: {
    scale: 1.2,
  },
};

function Button({ text, ...rest }: ButtonProps) {
  return (
    <StyledButton {...rest} variants={variants} whileHover='hover'>
      {text}
    </StyledButton>
  );
}

export default Button;
