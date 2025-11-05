import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FiUser, FiChevronDown } from 'react-icons/fi';
import logo from '../../assets/icons/logo.png';
import ddockTerview from '../../assets/icons/ddock-terview.png';
import { useAuth } from '../../contexts/AuthContext';

const Header = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const { isLoggedIn, user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <HeaderContainer>
      <HeaderContent>
        {/* 로고 */}
        <Logo to="/">
          <LogoIcon src={logo} alt="로고" />
          <LogoText src={ddockTerview} alt="똑터뷰" />
        </Logo>

        {/* 네비게이션 */}
        <Nav>
          <NavLink to="/interview">면접 연습</NavLink>
          <NavLink to="/question-bank">질문 저장소</NavLink>
          <NavLink to="/my-log">나의 로그</NavLink>
        </Nav>

        {/* 사용자 프로필 */}
        <UserSection>
          {isLoggedIn ? (
            <ProfileWrapper>
              <ProfileButton onClick={() => setShowDropdown(!showDropdown)}>
                <ProfileIcon>
                  <FiUser />
                </ProfileIcon>
                <UserName>{user?.name || '김똑쓰'} 님 반갑습니다.</UserName>
                <FiChevronDown />
              </ProfileButton>

              {showDropdown && (
                <Dropdown>
                  <DropdownItem onClick={() => navigate('/profile')}>
                    내 정보
                  </DropdownItem>
                  <DropdownItem onClick={() => navigate('/my-log/documents')}>
                    자소서 보관함
                  </DropdownItem>
                  <DropdownItem onClick={() => navigate('/subscription')}>
                    이용권 관리
                  </DropdownItem>
                  <DropdownDivider />
                  <DropdownItem onClick={handleLogout}>
                    로그아웃
                  </DropdownItem>
                </Dropdown>
              )}
            </ProfileWrapper>
          ) : (
            <LoginButton to="/login">
              <FiUser />
              로그인해주세요.
            </LoginButton>
          )}
        </UserSection>
      </HeaderContent>
    </HeaderContainer>
  );
};

const HeaderContainer = styled.header`
  width: 100%;
  background-color: ${({ theme }) => theme.colors.background};
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding: ${({ theme }) => theme.spacing.md} 0;
  position: sticky;
  top: 0;
  z-index: ${({ theme }) => theme.zIndex.sticky};
`;

const HeaderContent = styled.div`
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.spacing.xl};
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  text-decoration: none;
  transition: opacity ${({ theme }) => theme.transitions.fast};

  &:hover {
    opacity: 0.8;
  }
`;

const LogoIcon = styled.img`
  width: 48px;
  height: 48px;
  object-fit: contain;
`;

const LogoText = styled.img`
  height: 32px;
  object-fit: contain;
`;

const Nav = styled.nav`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xl};
  align-items: center;
`;

const NavLink = styled(Link)`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.fonts.size.lg};
  font-weight: ${({ theme }) => theme.fonts.weight.medium};
  text-decoration: none;
  transition: color ${({ theme }) => theme.transitions.fast};
  position: relative;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }

  &.active {
    color: ${({ theme }) => theme.colors.primary};

    &::after {
      content: '';
      position: absolute;
      bottom: -8px;
      left: 0;
      right: 0;
      height: 2px;
      background-color: ${({ theme }) => theme.colors.primary};
    }
  }
`;

const UserSection = styled.div`
  position: relative;
`;

const LoginButton = styled(Link)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  background-color: transparent;
  color: ${({ theme }) => theme.colors.text.primary};
  border: 1px solid ${({ theme }) => theme.colors.text.primary};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: ${({ theme }) => theme.fonts.size.base};
  transition: all ${({ theme }) => theme.transitions.fast};

  svg {
    font-size: ${({ theme }) => theme.fonts.size.lg};
  }

  &:hover {
    background-color: ${({ theme }) => theme.colors.primary};
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const ProfileWrapper = styled.div`
  position: relative;
`;

const ProfileButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  background-color: transparent;
  color: ${({ theme }) => theme.colors.text.primary};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  transition: background-color ${({ theme }) => theme.transitions.fast};

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }

  svg {
    font-size: ${({ theme }) => theme.fonts.size.lg};
  }
`;

const ProfileIcon = styled.div`
  width: 32px;
  height: 32px;
  background-color: ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
`;

const UserName = styled.span`
  font-size: ${({ theme }) => theme.fonts.size.base};
  font-weight: ${({ theme }) => theme.fonts.weight.medium};
`;

const Dropdown = styled.div`
  position: absolute;
  top: calc(100% + ${({ theme }) => theme.spacing.sm});
  right: 0;
  background-color: white;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  min-width: 200px;
  padding: ${({ theme }) => theme.spacing.sm} 0;
  z-index: ${({ theme }) => theme.zIndex.dropdown};
`;

const DropdownItem = styled.button`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  text-align: left;
  color: ${({ theme }) => theme.colors.text.dark};
  font-size: ${({ theme }) => theme.fonts.size.base};
  transition: background-color ${({ theme }) => theme.transitions.fast};

  &:hover {
    background-color: ${({ theme }) => theme.colors.gray[100]};
  }
`;

const DropdownDivider = styled.div`
  height: 1px;
  background-color: ${({ theme }) => theme.colors.gray[200]};
  margin: ${({ theme }) => theme.spacing.sm} 0;
`;

export default Header;
