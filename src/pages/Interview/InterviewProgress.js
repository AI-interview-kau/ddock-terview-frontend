import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Layout from '../../components/common/Layout';
import Button from '../../components/common/Button';
import iconInterview from '../../assets/icons/icon_interview.png';
import calmInterviewer from '../../assets/icons/온화형 면접관.png';
import pressureInterviewer from '../../assets/icons/압박형 면접관.png';
import dryInterviewer from '../../assets/icons/건조형 면접관.png';

const MOCK_QUESTIONS = [
  '자신의 강점과 약점은 무엇인가요?',
  '왜 그렇게 생각하셨나요?',
  '가장 힘들었던 순간이 무엇이었나요?',
];

const InterviewProgress = () => {
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [phase, setPhase] = useState('reading'); // 'reading' 또는 'answering'
  const [timeLeft, setTimeLeft] = useState(10); // 질문 확인 시간 10초
  const [totalAnswerTime, setTotalAnswerTime] = useState(180); // 전체 답변 시간 3분
  const [interviewerType, setInterviewerType] = useState('');
  const videoRef = useRef(null);

  const READING_TIME = 10; // 질문 확인 시간

  const interviewerIcons = {
    calm: calmInterviewer,
    pressure: pressureInterviewer,
    dry: dryInterviewer,
  };

  // 랜덤 면접관 선택 및 카메라 초기화
  useEffect(() => {
    const types = ['calm', 'pressure', 'dry'];
    const randomType = types[Math.floor(Math.random() * types.length)];
    setInterviewerType(randomType);

    // 사용자 카메라 접근
    const initCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error('카메라 접근 오류:', err);
      }
    };

    initCamera();

    // 컴포넌트 언마운트 시 카메라 스트림 정지
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject;
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, []);

  // 타이머 관리
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
        // 답변 단계일 때는 전체 답변 시간도 차감
        if (phase === 'answering') {
          setTotalAnswerTime(totalAnswerTime - 1);
        }
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      // 시간 종료 시
      if (phase === 'reading') {
        // 질문 확인 시간 종료 -> 답변 시간 시작
        setPhase('answering');
        setTimeLeft(totalAnswerTime); // 남은 전체 시간으로 시작
      } else if (phase === 'answering') {
        // 전체 답변 시간 종료 -> 면접 종료
        navigate('/interview/feedback');
      }
    }
  }, [timeLeft, phase, totalAnswerTime]);

  const handleSubmit = () => {
    // 답변 제출 -> 다음 질문으로 (남은 시간 유지)
    if (currentQuestionIndex < MOCK_QUESTIONS.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setPhase('reading');
      setTimeLeft(READING_TIME);
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
              {interviewerType && (
                <InterviewerCharacter>
                  <img src={interviewerIcons[interviewerType]} alt="Interviewer" />
                </InterviewerCharacter>
              )}
            </InterviewerScreen>
            <QuestionBox>
              <QuestionText>{currentQuestion}</QuestionText>
              <QuestionHint>천천히 또박또박 답변해 주세요!</QuestionHint>
            </QuestionBox>
          </InterviewerSection>

          {/* 우측 - 사용자 화면 */}
          <UserSection>
            <UserScreen>
              <VideoArea ref={videoRef} autoPlay playsInline />
            </UserScreen>
            <ControlsBottom>
              <TimerSection>
                <TimerLabel>{phase === 'reading' ? '질문 확인 시간' : '남은 답변 시간'}</TimerLabel>
                <Timer>
                  {Math.floor(timeLeft / 60).toString().padStart(2, '0')}:{(timeLeft % 60).toString().padStart(2, '0')}
                </Timer>
                <TotalTimeInfo>
                  전체 남은 시간: {Math.floor(totalAnswerTime / 60)}:{(totalAnswerTime % 60).toString().padStart(2, '0')}
                </TotalTimeInfo>
              </TimerSection>
              {phase === 'answering' && (
                <SubmitButton onClick={handleSubmit}>
                  답변 제출
                </SubmitButton>
              )}
            </ControlsBottom>
          </UserSection>
        </InterviewGrid>

        <BottomButtonWrapper>
          <ExitButton onClick={() => navigate('/interview')}>종료하기</ExitButton>
        </BottomButtonWrapper>
      </Container>
    </Layout>
  );
};

const Container = styled.div`
  min-height: calc(100vh - 80px);
  background-color: #3E3655;
  padding: ${({ theme }) => theme.spacing['2xl']} ${({ theme }) => theme.spacing.xl};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.xl};
  position: relative;
`;

const InterviewGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing.xl};
  width: 100%;
  max-width: 1400px;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
  }
`;

const InterviewerSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
  background-color: #2C2440;
  padding: ${({ theme }) => theme.spacing.xl};
  border-radius: ${({ theme }) => theme.borderRadius['2xl']};
  box-shadow: ${({ theme }) => theme.shadows.xl};
`;

const InterviewerScreen = styled.div`
  background: #1A1A1A;
  border-radius: ${({ theme }) => theme.borderRadius['2xl']};
  width: 100%;
  aspect-ratio: 4/3;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

const InterviewerCharacter = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;

  img {
    width: 350px;
    height: 350px;
    object-fit: contain;
  }
`;

const QuestionBox = styled.div`
  width: 100%;
  text-align: center;
`;

const QuestionText = styled.h2`
  font-size: ${({ theme }) => theme.fonts.size['2xl']};
  font-weight: ${({ theme }) => theme.fonts.weight.bold};
  color: white;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  line-height: 1.4;
`;

const QuestionHint = styled.p`
  font-size: ${({ theme }) => theme.fonts.size.sm};
  color: ${({ theme }) => theme.colors.gray[400]};
`;

const UserSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
  background-color: #2C2440;
  padding: ${({ theme }) => theme.spacing.xl};
  border-radius: ${({ theme }) => theme.borderRadius['2xl']};
  box-shadow: ${({ theme }) => theme.shadows.xl};
`;

const UserScreen = styled.div`
  background: #1A1A1A;
  border-radius: ${({ theme }) => theme.borderRadius['2xl']};
  width: 100%;
  aspect-ratio: 4/3;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

const VideoArea = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
  background: #1A1A1A;
`;

const ControlsBottom = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};
  width: 100%;
`;

const TimerSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const TimerLabel = styled.div`
  font-size: ${({ theme }) => theme.fonts.size.sm};
  color: ${({ theme }) => theme.colors.gray[400]};
`;

const Timer = styled.div`
  font-size: ${({ theme }) => theme.fonts.size.xl};
  font-weight: ${({ theme }) => theme.fonts.weight.bold};
  color: white;
`;

const TotalTimeInfo = styled.div`
  font-size: ${({ theme }) => theme.fonts.size.xs};
  color: ${({ theme }) => theme.colors.gray[500]};
  margin-top: ${({ theme }) => theme.spacing.xs};
`;

const SubmitButton = styled.button`
  background-color: #8B7AB8;
  color: white;
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.xl};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: ${({ theme }) => theme.fonts.size.base};
  font-weight: ${({ theme }) => theme.fonts.weight.semibold};
  border: none;
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  min-width: 120px;

  &:hover {
    background-color: #7A69A7;
    transform: translateY(-2px);
  }
`;

const BottomButtonWrapper = styled.div`
  position: fixed;
  bottom: 40px;
  right: 40px;
  z-index: 100;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    position: relative;
    bottom: auto;
    right: auto;
    margin-top: ${({ theme }) => theme.spacing['2xl']};
    display: flex;
    justify-content: center;
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

export default InterviewProgress;
