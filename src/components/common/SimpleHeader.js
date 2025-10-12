import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const SimpleHeader = () => {
  return (
    <HeaderContainer>
      <HeaderContent>
        <NavLinks>
          <NavLink to="/interview">면접 연습</NavLink>
          <NavLink to="/question-bank">질문 저장소</NavLink>
          <NavLink to="/my-log">나의 로그</NavLink>
        </NavLinks>
        <LoginPrompt>로그인해주세요.</LoginPrompt>
      </HeaderContent>
    </HeaderContainer>
  );
};

const HeaderContainer = styled.header`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.lg} 0;
  margin-bottom: ${({ theme }) => theme.spacing['2xl']};
`;

const HeaderContent = styled.div`
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.spacing.xl};
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const NavLinks = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xl};
`;

const NavLink = styled(Link)`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.fonts.size.lg};
  font-weight: ${({ theme }) => theme.fonts.weight.medium};
  text-decoration: none;
  transition: color ${({ theme }) => theme.transitions.fast};

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const LoginPrompt = styled.span`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.fonts.size.base};
`;

export default SimpleHeader;
