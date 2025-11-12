import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Header from '../components/common/Header';
import Button from '../components/common/Button';
import { ReactComponent as Logo } from '../assets/icons/logo.svg';
import ddockTerview from '../assets/icons/ddock-terview.png';
import { ReactComponent as KakaoIcon } from '../assets/icons/카카오.svg';
import { ReactComponent as GoogleIcon } from '../assets/icons/구글.svg';
import { ReactComponent as AppleIcon } from '../assets/icons/애플.svg';
import { useAuth } from '../contexts/AuthContext';
import { login as loginAPI } from '../api/authService';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError(''); // 입력 시 에러 메시지 초기화
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // API 호출
      const response = await loginAPI(formData.email, formData.password);

      // 응답: { grantType, accessToken, refreshToken }
      if (response.accessToken) {
        // 토큰을 먼저 저장 (사용자 정보 조회를 위해)
        const userData = {
          token: response.accessToken,
          refreshToken: response.refreshToken,
          userId: formData.email,
        };

        localStorage.setItem('user', JSON.stringify(userData));

        // 사용자 정보 조회
        try {
          const { getUserProfile } = await import('../api/authService');
          const userProfile = await getUserProfile();

          // 사용자 정보 업데이트
          const updatedUserData = {
            ...userData,
            name: userProfile.name || formData.email,
            department: userProfile.depart,
            status: userProfile.status,
          };

          localStorage.setItem('user', JSON.stringify(updatedUserData));
          login(updatedUserData);
        } catch (profileError) {
          console.error('Failed to get user profile:', profileError);
          // 프로필 조회 실패해도 로그인은 성공
          login(userData);
        }

        navigate('/'); // 로그인 성공 시 메인 페이지로
      }
    } catch (error) {
      console.error('Login failed:', error);
      if (error.response?.status === 404) {
        setError('사용자를 찾을 수 없습니다.');
      } else if (error.response?.status === 502) {
        setError('서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.');
      } else if (!error.response) {
        setError('네트워크 연결을 확인해주세요.');
      } else {
        setError('아이디 또는 비밀번호가 올바르지 않습니다.');
      }
    }
  };

  const handleSocialLogin = (provider) => {
    console.log(`${provider} 로그인`);

    if (provider === 'ddockterview') {
      // 똑터뷰 자체 서비스 - 회원가입 (온보딩으로 이동, 아직 로그인 안 함)
      navigate('/onboarding');
    } else {
      // 카카오, 구글, 애플 소셜 로그인 - 기존 사용자로 가정
      login({
        email: `${provider}@example.com`,
        name: '김똑쓰',
      });
      navigate('/'); // 메인 페이지로
    }
  };

  return (
    <Container>
      <Header />

        <LoginBox>
          <LogoSection>
            <LogoWrapper>
              <Logo />
            </LogoWrapper>
            <DdockTerviewIcon src={ddockTerview} alt="똑터뷰 아이콘" />
          </LogoSection>

          <Form onSubmit={handleSubmit}>
            <Input
              type="text"
              name="email"
              placeholder="아이디"
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

            {error && <ErrorMessage>{error}</ErrorMessage>}

            <LoginButton type="submit">Login</LoginButton>
          </Form>

          <Divider />

          <SocialLoginSection>
            <SocialLoginText>소셜계정으로 로그인</SocialLoginText>
            <SocialButtonGroup>
              <SocialButton onClick={() => handleSocialLogin('ddockterview')}>
                <DdockterviewIconWrapper>
                  <Logo />
                </DdockterviewIconWrapper>
              </SocialButton>
              <SocialButton onClick={() => handleSocialLogin('kakao')}>
                <KakaoIconWrapper>
                  <KakaoIcon />
                </KakaoIconWrapper>
              </SocialButton>
              <SocialButton onClick={() => handleSocialLogin('google')}>
                <GoogleIconWrapper>
                  <GoogleIcon />
                </GoogleIconWrapper>
              </SocialButton>
              <SocialButton onClick={() => handleSocialLogin('apple')}>
                <AppleIconWrapper>
                  <AppleIcon />
                </AppleIconWrapper>
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

const LogoWrapper = styled.div`
  width: 150px;
  height: auto;

  svg {
    width: 100%;
    height: auto;
  }
`;

const DdockTerviewIcon = styled.img`
  width: 120px;
  height: auto;
  object-fit: contain;
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
  background: linear-gradient(90deg, #8973FF 0%, #7BA3FF 100%);

  &:hover {
    background: linear-gradient(90deg, #7A64EE 0%, #6A92EE 100%);
  }
`;

const ErrorMessage = styled.div`
  color: #ff4444;
  font-size: ${({ theme }) => theme.fonts.size.sm};
  text-align: center;
  margin-top: ${({ theme }) => theme.spacing.sm};
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
  align-items: center;
`;

const SocialButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  transition: transform ${({ theme }) => theme.transitions.fast};
  padding: 0;
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  box-shadow: ${({ theme }) => theme.shadows.md};

  &:hover {
    transform: scale(1.1);
  }
`;

const DdockterviewIconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 56px !important;
    height: 56px !important;
  }
`;

const KakaoIconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 56px !important;
    height: 56px !important;
    opacity: 0.3;
  }
`;

const GoogleIconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 56px !important;
    height: 56px !important;
    transform: scale(1.5) translate(0.5px, 1.5px);
    opacity: 0.3;
  }
`;

const AppleIconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 56px !important;
    height: 56px !important;
    transform: scale(1.5) translate(0.5px, 1.5px);
    opacity: 0.3;
  }
`;

export default Login;
