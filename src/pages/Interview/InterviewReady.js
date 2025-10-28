import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Layout from '../../components/common/Layout';
import interviewIcon from '../../assets/icons/interview.png';

const InterviewReady = () => {
  const navigate = useNavigate();

  const handleStart = () => {
    // 면접 진행 화면으로 이동
    navigate('/interview/progress');
  };

  const handleExit = () => {
    // 면접 준비 페이지로 이동
    navigate('/interview');
  };

  return (
    <Layout isLoggedIn={true} userName="김똑쓰">
      <Container>
        <ReadyCard>
          <Title>이제 면접이 시작돼요!</Title>
          <Subtitle>긴장하지 말고 질문에 잘 답변해보세요!</Subtitle>

          <IllustrationWrapper>
            <img src={interviewIcon} alt="Interview Ready" />
          </IllustrationWrapper>
        </ReadyCard>

        <BottomButtonWrapper>
          <ContinueButton onClick={handleStart}>진행하기</ContinueButton>
          <ExitButton onClick={handleExit}>종료하기</ExitButton>
        </BottomButtonWrapper>
      </Container>
    </Layout>
  );
};

const Container = styled.div`
  min-height: calc(100vh - 80px);
  background-color: #3E3655;
  padding: ${({ theme }) => theme.spacing['4xl']} ${({ theme }) => theme.spacing.xl};
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
`;

const ReadyCard = styled.div`
  background: linear-gradient(to bottom, #FFFFFF 0%, #EBF5FF 50%, #D1E8FF 100%);
  border-radius: ${({ theme }) => theme.borderRadius['3xl']};
  padding: ${({ theme }) => theme.spacing['4xl']} ${({ theme }) => theme.spacing['3xl']};
  max-width: 1000px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing['2xl']};
  box-shadow: ${({ theme }) => theme.shadows.xl};
  margin: 0 auto;
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.fonts.size['3xl']};
  font-weight: ${({ theme }) => theme.fonts.weight.bold};
  color: ${({ theme }) => theme.colors.text.dark};
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const Subtitle = styled.p`
  font-size: ${({ theme }) => theme.fonts.size.lg};
  color: ${({ theme }) => theme.colors.gray[600]};
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing['2xl']};
`;

const IllustrationWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: ${({ theme }) => theme.spacing['2xl']} 0;

  img {
    width: 400px;
    height: 400px;
    object-fit: contain;
    filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1));
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    img {
      width: 300px;
      height: 300px;
    }
  }
`;

const BottomButtonWrapper = styled.div`
  position: fixed;
  bottom: 40px;
  right: 40px;
  z-index: 100;
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    position: relative;
    bottom: auto;
    right: auto;
    margin-top: ${({ theme }) => theme.spacing['2xl']};
    justify-content: center;
  }
`;

const ContinueButton = styled.button`
  background-color: #8B7AB8;
  color: white;
  padding: ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing['2xl']};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: ${({ theme }) => theme.fonts.size.lg};
  font-weight: ${({ theme }) => theme.fonts.weight.semibold};
  border: none;
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  min-width: 180px;

  &:hover {
    background-color: #7A69A7;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }
`;

const ExitButton = styled.button`
  background-color: #6B7280;
  color: white;
  padding: ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing['2xl']};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: ${({ theme }) => theme.fonts.size.lg};
  font-weight: ${({ theme }) => theme.fonts.weight.semibold};
  border: none;
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  min-width: 180px;

  &:hover {
    background-color: #4B5563;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }
`;

export default InterviewReady;
