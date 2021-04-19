import { Box } from '@chakra-ui/layout';
import React from 'react';

export type WrapperType = 'small' | 'regular';
interface WrapperProps {
  variant?: WrapperType;
}

export const Wrapper: React.FC<WrapperProps> = ({ children, variant = 'regular' }) => {
  return (
    <Box maxWidth={variant === 'regular' ? '800px' : '400px'} width='100%' mx='auto'>
      {children}
    </Box>
  );
};
