import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import SimpleHeader from '../components/common/SimpleHeader';
import Button from '../components/common/Button';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // 로그인 로직
    navigate('/onboarding');
  };

  const handleSocialLogin = (provider) => {
    // 소셜 로그인 로직
    console.log(`${provider} 로그인`);
    navigate('/onboarding');
  };

  return (
    <Container>
      <SimpleHeader />

        <LoginBox>
          <LogoSection>
            <LogoIcon>😊</LogoIcon>
            <LogoText>똑터뷰</LogoText>
          </LogoSection>

          <Form onSubmit={handleSubmit}>
            <Input
              type="email"
              name="email"
              placeholder="이메일"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <Input
              type="password"
              name="password"
              placeholder="비밀번호"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <LoginButton type="submit">Login</LoginButton>
          </Form>

          <Divider />

          <SocialLoginSection>
            <SocialLoginText>소셜계정으로 로그인</SocialLoginText>
            <SocialButtonGroup>
              <SocialButton onClick={() => handleSocialLogin('kakao')}>
                <SocialIcon bgColor="#FEE500">K</SocialIcon>
              </SocialButton>
              <SocialButton onClick={() => handleSocialLogin('google')}>
                <SocialIcon bgColor="#FFFFFF">G</SocialIcon>
              </SocialButton>
              <SocialButton onClick={() => handleSocialLogin('apple')}>
                <SocialIcon bgColor="#000000">
                </SocialIcon>
              </SocialButton>
            </SocialButtonGroup>
          </SocialLoginSection>
        </LoginBox>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  background-color: ${({ theme }) => theme.colors.background};
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.xl};
`;

const LoginBox = styled.div`
  background-color: ${({ theme }) => theme.colors.background};
  padding: ${({ theme }) => theme.spacing['3xl']};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  width: 100%;
  max-width: 480px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const LogoSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing['2xl']};
`;

const LogoIcon = styled.div`
  width: 120px;
  height: 120px;
  background-color: ${({ theme }) => theme.colors.secondary};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${({ theme }) => theme.fonts.size['5xl']};
`;

const LogoText = styled.h1`
  font-size: ${({ theme }) => theme.fonts.size['4xl']};
  font-weight: ${({ theme }) => theme.fonts.weight.bold};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const Form = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const Input = styled.input`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  background-color: ${({ theme }) => theme.colors.cardBg};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.fonts.size.base};
  color: ${({ theme }) => theme.colors.text.dark};
  transition: border-color ${({ theme }) => theme.transitions.fast};

  &::placeholder {
    color: ${({ theme }) => theme.colors.gray[400]};
  }

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const LoginButton = styled(Button)`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.md};
  font-size: ${({ theme }) => theme.fonts.size.lg};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  margin-top: ${({ theme }) => theme.spacing.md};
`;

const Divider = styled.div`
  width: 80%;
  height: 1px;
  background-color: ${({ theme }) => theme.colors.gray[300]};
  margin: ${({ theme }) => theme.spacing.xl} 0;
`;

const SocialLoginSection = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const SocialLoginText = styled.p`
  font-size: ${({ theme }) => theme.fonts.size.base};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const SocialButtonGroup = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const SocialButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  transition: transform ${({ theme }) => theme.transitions.fast};

  &:hover {
    transform: scale(1.1);
  }
`;

const SocialIcon = styled.div`
  width: 56px;
  height: 56px;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  background-color: ${({ bgColor }) => bgColor};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${({ theme }) => theme.fonts.size['2xl']};
  font-weight: ${({ theme }) => theme.fonts.weight.bold};
  color: ${({ bgColor }) => (bgColor === '#FFFFFF' ? '#000' : bgColor === '#FEE500' ? '#000' : '#fff')};
  box-shadow: ${({ theme }) => theme.shadows.md};
`;

export default Login;
