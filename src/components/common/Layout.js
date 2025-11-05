import React from 'react';
import styled from 'styled-components';
import Header from './Header';

const Layout = ({ children, showHeader = true }) => {
  return (
    <LayoutContainer>
      {showHeader && <Header />}
      <Main>{children}</Main>
    </LayoutContainer>
  );
};

const LayoutContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.colors.background};
`;

const Main = styled.main`
  flex: 1;
  width: 100%;
`;

export default Layout;
