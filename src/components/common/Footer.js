import React from 'react';
import styled from 'styled-components';
import mainIcon from '../../assets/icons/logo.png';
import ddockTerview from '../../assets/icons/ddock-terview.png';

const Footer = () => {
  return (
    <FooterContainer>
      <FooterLinks>
        <FooterLink href="#">서비스 이용약관</FooterLink>
        <FooterLink href="#">개인정보 처리방침</FooterLink>
        <FooterLink href="#">데이터 서비스 이용약관</FooterLink>
        <FooterLink href="#">이용자 관리 및 운영사생</FooterLink>
      </FooterLinks>

      <FooterContent>
        <FooterInfo>
          <LogoIcon src={mainIcon} alt="Logo" />
          <LogoText src={ddockTerview} alt="똑터뷰" />
        </FooterInfo>

        <FooterDetails>
          <FooterText>Team 똑쓰</FooterText>
          <FooterText>대표: 홍길수</FooterText>
          <FooterText>전화번호: 010-1234-5678</FooterText>
          <FooterText>이메일: plus@gmail.com</FooterText>
          <FooterCopyright>@Ddokterview ALL RIGHTS RESERVED</FooterCopyright>
        </FooterDetails>
      </FooterContent>
    </FooterContainer>
  );
};

const FooterContainer = styled.footer`
  background-color: #000;
  padding: ${({ theme }) => theme.spacing['3xl']} ${({ theme }) => theme.spacing.xl};
  color: white;
`;

const FooterLinks = styled.div`
  display: flex;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.xl};
  margin-bottom: ${({ theme }) => theme.spacing['2xl']};
  flex-wrap: wrap;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
`;

const FooterLink = styled.a`
  color: white;
  font-size: ${({ theme }) => theme.fonts.size.sm};
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const FooterContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.xl};
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
`;

const FooterInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

const LogoIcon = styled.img`
  width: 40px;
  height: 40px;
  object-fit: contain;
`;

const LogoText = styled.img`
  height: 24px;
  object-fit: contain;
`;

const FooterDetails = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const FooterText = styled.p`
  font-size: ${({ theme }) => theme.fonts.size.sm};
  color: ${({ theme }) => theme.colors.gray[400]};
`;

const FooterCopyright = styled.p`
  font-size: ${({ theme }) => theme.fonts.size.xs};
  color: ${({ theme }) => theme.colors.gray[500]};
  margin-top: ${({ theme }) => theme.spacing.md};
`;

export default Footer;
