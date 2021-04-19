import React, { Fragment } from 'react';
import { WrapperType } from './Wrapper';
import { Wrapper } from './Wrapper';
import { Nav } from './Nav';

interface LayoutProps {
  variant?: WrapperType;
}

export const Layout: React.FC<LayoutProps> = ({ variant = 'regular', children }) => {
  return (
    <Fragment>
      <Nav />
      <Wrapper variant={variant}>{children}</Wrapper>
    </Fragment>
  );
};
