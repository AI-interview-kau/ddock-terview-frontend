import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import Layout from '../../components/common/Layout';
import Button from '../../components/common/Button';
import iconInterview from '../../assets/icons/icon_interview.png';
import calmInterviewer from '../../assets/icons/온화형 면접관.png';
import pressureInterviewer from '../../assets/icons/압박형 면접관.png';
import dryInterviewer from '../../assets/icons/건조형 면접관.png';
import { ReactComponent as Logo } from '../../assets/icons/logo.svg';
import confettiGif from '../../images/폭죽.gif';
import ddocksTail from '../../assets/icons/ddocks_tail.png';

const FOLLOW_UP_QUESTIONS = {
  0: '그 강점을 실제로 활용했던 경험이 있나요?',
  1: '그 생각이 결과에 어떤 영향을 주었나요?',
  2: '그 상황을 어떻게 극복하셨나요?',
};

const InterviewProgress = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // 선택한 질문들을 받아오기 (없으면 빈 배열)
  const selectedQuestions = location.state?.selectedQuestions || [];

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [phase, setPhase] = useState('reading'); // 'reading', 'answering', 'loading'
  const [timeLeft, setTimeLeft] = useState(10); // 질문 확인 시간 10초
  const [totalAnswerTime, setTotalAnswerTime] = useState(180); // 전체 답변 시간 3분
  const [interviewerType, setInterviewerType] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showFollowUpAlert, setShowFollowUpAlert] = useState(false);
  const [isFollowUpQuestion, setIsFollowUpQuestion] = useState(false);
  const [askedQuestions, setAskedQuestions] = useState([]); // 실제로 나온 질문들을 저장 (형식: { question: string, isFollowUp: boolean })
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
        navigate('/interview/feedback', { state: { questions: askedQuestions } });
      }
    }
  }, [timeLeft, phase, totalAnswerTime, askedQuestions]);

  const handleSubmit = () => {
    // 질문 저장소로 면접하는 경우 꼬리질문 없음
    if (currentQuestionIndex < selectedQuestions.length - 1) {
      // 로딩 후 다음 질문으로 이동
      setIsLoading(true);

      setTimeout(() => {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setPhase('reading');
        setTimeLeft(READING_TIME);
        setIsLoading(false);
      }, 2500);
    } else {
      // 모든 질문 완료 - 피드백 페이지로
      navigate('/interview/feedback', { state: { questions: askedQuestions } });
    }
  };

  // 현재 질문 (선택한 질문들 사용)
  const currentQuestion = selectedQuestions[currentQuestionIndex] || '질문이 없습니다.';

  // 질문이 바뀔 때마다 askedQuestions에 추가 (중복 방지)
  useEffect(() => {
    if (currentQuestion && currentQuestion !== '질문이 없습니다.') {
      setAskedQuestions(prev => {
        // 이미 존재하는 질문인지 확인
        const alreadyExists = prev.some(item => item.question === currentQuestion);
        if (alreadyExists) {
          return prev;
        }
        return [...prev, { question: currentQuestion, isFollowUp: false }];
      });
    }
  }, [currentQuestion]);

  return (
    <Layout isLoggedIn={true} userName="김똑쓰">
      <Container>
        {isLoading && (
          <LoadingOverlay>
            <LoadingContent>
              <LoadingSpinner />
              <LoadingText>다음 질문을 생성 중이에요...</LoadingText>
              <LoadingSubText>잠시만 기다려 주세요</LoadingSubText>
            </LoadingContent>
          </LoadingOverlay>
        )}

        {showFollowUpAlert && (
          <FollowUpOverlay>
            <FollowUpModal>
              <ConfettiImageCenter src={confettiGif} alt="confetti" />
              <FollowUpContent>
                <FollowUpTitle>꼬리 질문!!</FollowUpTitle>
                <FollowUpCharacter>
                  <img src={ddocksTail} alt="똑스" />
                </FollowUpCharacter>
              </FollowUpContent>
            </FollowUpModal>
          </FollowUpOverlay>
        )}

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

const LoadingOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const LoadingContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xl};
`;

const LoadingSpinner = styled.div`
  width: 60px;
  height: 60px;
  border: 4px solid rgba(139, 122, 184, 0.3);
  border-top-color: #8B7AB8;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const LoadingText = styled.div`
  font-size: ${({ theme }) => theme.fonts.size['2xl']};
  font-weight: ${({ theme }) => theme.fonts.weight.bold};
  color: white;
`;

const LoadingSubText = styled.div`
  font-size: ${({ theme }) => theme.fonts.size.base};
  color: ${({ theme }) => theme.colors.gray[400]};
`;

const FollowUpOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const FollowUpModal = styled.div`
  background-color: rgba(44, 36, 64, 0.95);
  border-radius: ${({ theme }) => theme.borderRadius['3xl']};
  padding: ${({ theme }) => theme.spacing['3xl']};
  width: 500px;
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: ${({ theme }) => theme.shadows['2xl']};
  border: 2px solid rgba(255, 255, 255, 0.1);
  position: relative;
`;

const ConfettiImageCenter = styled.img`
  position: absolute;
  width: 200px;
  height: 200px;
  object-fit: contain;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 1;
`;

const FollowUpContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.xl};
  position: relative;
  z-index: 2;
`;

const FollowUpTitle = styled.h2`
  font-size: 40px;
  font-weight: ${({ theme }) => theme.fonts.weight.bold};
  color: white;
  white-space: nowrap;
`;

const FollowUpCharacter = styled.div`
  width: 120px;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    animation: bounce 1s ease-in-out infinite;
  }

  @keyframes bounce {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-10px);
    }
  }
`;

export default InterviewProgress;
