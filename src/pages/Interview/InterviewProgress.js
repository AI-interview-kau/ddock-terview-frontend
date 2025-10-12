import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Layout from '../../components/common/Layout';
import Button from '../../components/common/Button';
import iconInterview from '../../assets/icons/icon_interview.png';

const MOCK_QUESTIONS = [
  '자신의 강점과 약점은 무엇인가요?',
  '왜 그렇게 생각하셨나요?',
  '가장 힘들었던 순간이 무엇이었나요?',
];

const InterviewProgress = () => {
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isAnswering, setIsAnswering] = useState(false);
  const [timeLeft, setTimeLeft] = useState(12);

  useEffect(() => {
    if (isAnswering && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (isAnswering && timeLeft === 0) {
      handleNextQuestion();
    }
  }, [isAnswering, timeLeft]);

  const handleStartAnswer = () => {
    setIsAnswering(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < MOCK_QUESTIONS.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setIsAnswering(false);
      setTimeLeft(12);
    } else {
      // 모든 질문 완료 - 피드백 페이지로
      navigate('/interview/feedback');
    }
  };

  const currentQuestion = MOCK_QUESTIONS[currentQuestionIndex];

  return (
    <Layout isLoggedIn={true} userName="김똑쓰">
      <Container>
        <InterviewGrid>
          {/* 좌측 - AI 면접관 */}
          <InterviewerSection>
            <InterviewerScreen>
              <InterviewerArea>
                <InterviewerCharacter>
                  <img src={iconInterview} alt="Interview Icon" />
                </InterviewerCharacter>
              </InterviewerArea>
              <QuestionBox>
                <QuestionText>{currentQuestion}</QuestionText>
                <QuestionHint>충분히 생각하고 진실한 반영하세요!</QuestionHint>
              </QuestionBox>
            </InterviewerScreen>
          </InterviewerSection>

          {/* 우측 - 사용자 화면 */}
          <UserSection>
            <UserScreen>
              <VideoArea>
                <UserPlaceholder>📹</UserPlaceholder>
                <UserHint>카메라 화면</UserHint>
              </VideoArea>
              <Controls>
                <Timer>
                  남은 시간: 00:{timeLeft.toString().padStart(2, '0')}
                </Timer>
                {!isAnswering ? (
                  <AnswerButton size="large" onClick={handleStartAnswer}>
                    답변하기
                  </AnswerButton>
                ) : (
                  <AnswerButton size="large" onClick={handleNextQuestion}>
                    답변 제출
                  </AnswerButton>
                )}
              </Controls>
            </UserScreen>
          </UserSection>
        </InterviewGrid>

        <ProgressIndicator>
          질문 {currentQuestionIndex + 1} / {MOCK_QUESTIONS.length}
        </ProgressIndicator>
      </Container>
    </Layout>
  );
};

const Container = styled.div`
  min-height: calc(100vh - 80px);
  background-color: #3E3655;
  padding: ${({ theme }) => theme.spacing.md};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

const InterviewGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing.md};
  width: 95%;
  max-width: 2400px;
  height: 85vh;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
  }
`;

const InterviewerSection = styled.div`
  display: flex;
  flex-direction: column;
`;

const InterviewerScreen = styled.div`
  background: #2C2539;
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  aspect-ratio: 4/3;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  box-shadow: ${({ theme }) => theme.shadows.xl};
  position: relative;
  padding: ${({ theme }) => theme.spacing.xl};
  gap: ${({ theme }) => theme.spacing.md};
`;

const InterviewerArea = styled.div`
  flex: 1;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #3A3A3A 0%, #1A1A1A 100%);
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  border: 2px solid #4A4A4A;
`;

const InterviewerCharacter = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 200px;
    height: 200px;
    object-fit: contain;
  }
`;

const QuestionBox = styled.div`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing.xl};
  text-align: center;
`;

const QuestionText = styled.h2`
  font-size: ${({ theme }) => theme.fonts.size.xl};
  font-weight: ${({ theme }) => theme.fonts.weight.bold};
  color: white;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const QuestionHint = styled.p`
  font-size: ${({ theme }) => theme.fonts.size.sm};
  color: ${({ theme }) => theme.colors.gray[300]};
`;

const UserSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const UserScreen = styled.div`
  background: #2C2539;
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  aspect-ratio: 4/3;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  box-shadow: ${({ theme }) => theme.shadows.xl};
  border: 3px solid #1A1A1A;
  padding: ${({ theme }) => theme.spacing.xl};
  position: relative;
  gap: ${({ theme }) => theme.spacing.md};
`;

const VideoArea = styled.div`
  flex: 1;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #1A1A1A;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  border: 2px solid #3A3A3A;
`;

const UserPlaceholder = styled.div`
  font-size: 120px;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const UserHint = styled.p`
  font-size: ${({ theme }) => theme.fonts.size.lg};
  color: ${({ theme }) => theme.colors.gray[400]};
`;

const Controls = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};
  width: 100%;
`;

const Timer = styled.div`
  font-size: ${({ theme }) => theme.fonts.size.base};
  font-weight: ${({ theme }) => theme.fonts.weight.medium};
  color: white;
`;

const AnswerButton = styled(Button)`
  width: auto;
  min-width: 120px;
  background-color: #9B8FF5;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.xl};

  &:hover {
    background-color: #8B7FE5;
  }
`;

const AnsweringStatus = styled.div`
  width: auto;
  min-width: 120px;
  background-color: #9B8FF5;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.xl};
  font-size: ${({ theme }) => theme.fonts.size.base};
  font-weight: ${({ theme }) => theme.fonts.weight.semibold};
  color: white;
  text-align: center;
  animation: pulse 1.5s infinite;

  @keyframes pulse {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.7;
    }
  }
`;

const ProgressIndicator = styled.div`
  text-align: center;
  font-size: ${({ theme }) => theme.fonts.size.lg};
  color: white;
  font-weight: ${({ theme }) => theme.fonts.weight.semibold};
`;

export default InterviewProgress;
