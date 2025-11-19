import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import Layout from '../../components/common/Layout';
import Button from '../../components/common/Button';
import iconInterview from '../../assets/icons/icon_interview.png';
import calmInterviewer from '../../assets/icons/온화형 면접관.png';
import { ReactComponent as Logo } from '../../assets/icons/logo.svg';
import loadingVideo from '../../mp4/KakaoTalk_20251119_143807610.mp4';
import confettiGif from '../../images/폭죽.gif';
import ddocksTail from '../../assets/icons/ddocks_tail.png';
import { startInterview, uploadAnswer, getInterviewStatus, playAudioFromBase64 } from '../../api/aiInterviewService';
import { saveAnswer } from '../../api/interviewService';

const FOLLOW_UP_QUESTIONS = {
  0: '그 강점을 실제로 활용했던 경험이 있나요?',
  1: '그 생각이 결과에 어떤 영향을 주었나요?',
  2: '그 상황을 어떻게 극복하셨나요?',
};

const LOADING_MESSAGES = [
  "지금까지 준비한 만큼만 보여주면 충분합니다.",
  "떨리는 건 자연스러운 현상이에요. 그 에너지를 열정으로 바꾸세요.",
  "심호흡을 크게 한번 해보세요. 뇌에 산소가 공급됩니다.",
  "질문이 이해되지 않았다면, 정중하게 다시 물어봐도 괜찮습니다.",
  "답변이 생각나지 않을 땐, 잠시 시간을 달라고 요청해도 좋습니다.",
  "면접관도 그냥 사람입니다.",
  "단점을 말하랬다고 진짜 치명적인 단점을 말하면... 솔직함 점수만 100점 받습니다.",
  "나를 뽑지 않는 회사는 회사의 손해지, 내 손해가 아닙니다."
];

const InterviewProgress = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // AI 면접 모드 체크 (기본값: false - 질문 저장소 모드)
  const isAIMode = location.state?.isAIMode || false;
  const selectedQuestions = location.state?.selectedQuestions || [];
  const questionItems = location.state?.questionItems || [];  // inq_id 포함된 데이터

  // AI 면접 상태
  const [sessionId, setSessionId] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [questionId, setQuestionId] = useState(null);
  const [isTailQuestion, setIsTailQuestion] = useState(false);
  const [remainingSlots, setRemainingSlots] = useState(null); // 서버에서 받은 값으로 설정됨
  const [interviewStatus, setInterviewStatus] = useState('continue'); // 'continue' | 'completed'
  const [isLastQuestion, setIsLastQuestion] = useState(false); // 마지막 질문 여부

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [phase, setPhase] = useState('reading'); // 'reading', 'answering', 'loading'
  const [timeLeft, setTimeLeft] = useState(10); // 질문 확인 시간 10초
  const [totalAnswerTime, setTotalAnswerTime] = useState(1800); // 전체 답변 시간 30분 (1800초)
  const [interviewerType, setInterviewerType] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showFollowUpAlert, setShowFollowUpAlert] = useState(false);
  const [isFollowUpQuestion, setIsFollowUpQuestion] = useState(false);
  const [askedQuestions, setAskedQuestions] = useState([]); // 실제로 나온 질문들을 저장 (형식: { question: string, isFollowUp: boolean })
  const [isPlayingAudio, setIsPlayingAudio] = useState(false); // 음성 재생 중 여부
  const currentAudioRef = useRef(null); // 현재 재생 중인 Audio 객체
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0); // 로딩 메시지 인덱스

  // 비디오 녹화 관련
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const recordedChunksRef = useRef([]);
  const isInterviewStartedRef = useRef(false); // 중복 호출 방지

  const READING_TIME = 10; // 질문 확인 시간

  const interviewerIcons = {
    calm: calmInterviewer,
  };

  // 음성 재생 함수
  const playQuestionAudio = async (audioData) => {
    if (!audioData) {
      console.log('⚠️ 음성 데이터 없음 (텍스트만 표시)');
      return Promise.resolve();
    }

    return new Promise(async (resolve, reject) => {
      try {
        setIsPlayingAudio(true);
        console.log('🔊 질문 음성 재생 시작...');

        const audio = await playAudioFromBase64(audioData);
        currentAudioRef.current = audio;

        // 음성 재생 완료 시
        audio.onended = () => {
          console.log('✅ 음성 재생 완료 - 카운트다운 시작');
          setIsPlayingAudio(false);
          currentAudioRef.current = null;
          resolve();
        };

        // 음성 재생 에러 시
        audio.onerror = () => {
          console.warn('⚠️ 음성 재생 실패 - 텍스트만 표시하고 카운트다운 시작');
          setIsPlayingAudio(false);
          currentAudioRef.current = null;
          resolve(); // 에러가 나도 계속 진행
        };
      } catch (error) {
        console.error('❌ 음성 재생 에러:', error);
        setIsPlayingAudio(false);
        currentAudioRef.current = null;
        resolve(); // 에러가 나도 계속 진행
      }
    });
  };

  // AI 면접 시작 (AI 모드일 경우)
  useEffect(() => {
    if (isAIMode && !isInterviewStartedRef.current) {
      isInterviewStartedRef.current = true; // 즉시 플래그 설정하여 중복 호출 방지

      const initAIInterview = async () => {
        try {
          setIsLoading(true);
          console.log('🎬 면접 시작 요청 중...');

          // sessionId를 localStorage에서 가져오기
          const storedSessionData = localStorage.getItem('currentSession');
          let sessionIdToUse = null;

          if (storedSessionData) {
            try {
              const sessionData = JSON.parse(storedSessionData);
              sessionIdToUse = sessionData.sessionId;
              console.log('📦 localStorage에서 sessionId 가져옴:', sessionIdToUse);
            } catch (e) {
              console.error('❌ sessionId 파싱 실패:', e);
            }
          }

          // sessionId 검증 - null이거나 undefined면 에러 발생
          if (!sessionIdToUse) {
            console.error('❌ sessionId가 없습니다. localStorage:', storedSessionData);
            throw new Error('세션 정보를 찾을 수 없습니다. 자기소개서를 다시 업로드해주세요.');
          }

          console.log('✅ sessionId 확인 완료:', sessionIdToUse);
          const result = await startInterview(sessionIdToUse);

          // 면접 세션 정보 저장
          setSessionId(result.sessionId);
          setCurrentQuestion(result.question);
          setQuestionId(result.questionId);
          setIsTailQuestion(result.isTailQuestion);
          setRemainingSlots(result.remainingSlots);
          setInterviewStatus(result.status);
          setIsLastQuestion(result.isLastQuestion || false);

          setIsLoading(false);

          // 꼬리질문이면 알림 표시
          if (result.isTailQuestion) {
            setShowFollowUpAlert(true);
            setTimeout(() => {
              setShowFollowUpAlert(false);
              // 알림 후 음성 재생
              playQuestionAudio(result.audioData).then(() => {
                // 음성 재생 완료 후 읽기 단계 시작
                setPhase('reading');
                setTimeLeft(READING_TIME);
              });
            }, 2000);
          } else {
            // 일반 질문이면 바로 음성 재생
            playQuestionAudio(result.audioData).then(() => {
              // 음성 재생 완료 후 읽기 단계 시작
              setPhase('reading');
              setTimeLeft(READING_TIME);
            });
          }
        } catch (error) {
          console.error('❌ 면접 시작 실패:', error);
          setIsLoading(false);

          // 에러 메시지를 더 명확하게 표시
          if (error.message.includes('세션 정보를 찾을 수 없습니다')) {
            alert('세션 정보를 찾을 수 없습니다.\n\n자기소개서 업로드 페이지로 돌아가서 다시 업로드해주세요.');
          } else if (error.message.includes('500')) {
            alert('서버에서 오류가 발생했습니다.\n\n가능한 원인:\n1. 자기소개서가 제대로 업로드되지 않았을 수 있습니다.\n2. AI 서버가 일시적으로 응답하지 않을 수 있습니다.\n\n자기소개서를 다시 업로드해주세요.');
          } else {
            alert(`면접을 시작할 수 없습니다.\n\n에러: ${error.message}\n\n다시 시도해주세요.`);
          }

          isInterviewStartedRef.current = false; // 실패 시 플래그 리셋
          navigate('/interview');
        }
      };

      initAIInterview();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAIMode]);

  // 면접관 선택 및 카메라 초기화
  useEffect(() => {
    setInterviewerType('calm');

    // 사용자 카메라 및 오디오 접근 (WebM 녹화용)
    const initCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true // 오디오 포함
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }

        // MediaRecorder 초기화 (WebM 형식)
        const options = { mimeType: 'video/webm;codecs=vp8,opus' };

        // WebM 지원 여부 확인
        if (!MediaRecorder.isTypeSupported(options.mimeType)) {
          console.warn('WebM not supported, using default format');
          mediaRecorderRef.current = new MediaRecorder(stream);
        } else {
          mediaRecorderRef.current = new MediaRecorder(stream, options);
        }

        // 녹화 데이터 수집
        mediaRecorderRef.current.ondataavailable = (event) => {
          if (event.data && event.data.size > 0) {
            recordedChunksRef.current.push(event.data);
          }
        };

      } catch (err) {
        console.error('❌ 카메라/오디오 접근 오류:', err);
        alert('카메라와 마이크 접근 권한이 필요합니다.');
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
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);

  // 로딩 메시지 순환
  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setCurrentMessageIndex((prevIndex) => (prevIndex + 1) % LOADING_MESSAGES.length);
      }, 8000); // 8초마다 메시지 변경

      return () => clearInterval(interval);
    } else {
      // 로딩이 끝나면 인덱스 리셋
      setCurrentMessageIndex(0);
    }
  }, [isLoading]);

  // 비디오 녹화 시작 (답변 단계 진입 시 - 질문 확인 10초 후)
  useEffect(() => {
    if (phase === 'answering' && mediaRecorderRef.current && mediaRecorderRef.current.state === 'inactive') {
      // 이전 녹화 데이터 초기화
      recordedChunksRef.current = [];

      // 녹화 시작
      try {
        mediaRecorderRef.current.start();
        console.log('🎥 답변 녹화 시작');
      } catch (error) {
        console.error('❌ 녹화 시작 실패:', error);
      }
    }
  }, [phase]);

  // 타이머 관리
  useEffect(() => {
    // 로딩 중이거나 꼬리질문 알림이 표시 중이거나 음성 재생 중일 때는 타이머 중지
    if (isLoading || showFollowUpAlert || isPlayingAudio) {
      return;
    }

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
        // 전체 답변 시간 종료 -> 자동 제출
        handleSubmit();
      }
    }
  }, [timeLeft, phase, totalAnswerTime, askedQuestions, isLoading, showFollowUpAlert, isPlayingAudio]);

  const handleSubmit = async () => {
    // 녹화 중지 (답변 제출 버튼 클릭 시)
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      console.log('🎥 답변 녹화 종료');

      // 녹화 완료 후 처리
      mediaRecorderRef.current.onstop = async () => {
        // WebM Blob 생성
        const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });

        if (isAIMode) {
          // AI 모드: 비디오 업로드 후 다음 질문 받기
          try {
            setIsLoading(true);

            const result = await uploadAnswer(sessionId, questionId, blob);

            if (result.status === 'completed') {
              // 면접 종료
              navigate('/interview/feedback', {
                state: {
                  sessionId: sessionId,
                  questions: askedQuestions,
                  isAIMode: true
                }
              });
            } else if (result.status === 'continue') {
              // 다음 질문으로 이동
              setCurrentQuestion(result.question);
              setQuestionId(result.questionId);
              setIsTailQuestion(result.isTailQuestion);
              setRemainingSlots(result.remainingSlots);
              setInterviewStatus(result.status);
              setIsLastQuestion(result.isLastQuestion || false);

              // 질문 기록 추가
              setAskedQuestions(prev => [...prev, {
                question: result.question,
                isFollowUp: result.isTailQuestion
              }]);

              // 꼬리질문이면 알림 표시
              if (result.isTailQuestion) {
                setShowFollowUpAlert(true);
                setTimeout(() => {
                  setShowFollowUpAlert(false);
                  setIsLoading(false);
                  // 알림 후 음성 재생
                  playQuestionAudio(result.audioData).then(() => {
                    // 음성 재생 완료 후 읽기 단계 시작
                    setPhase('reading');
                    setTimeLeft(READING_TIME);
                  });
                }, 2000);
              } else {
                setIsLoading(false);
                // 일반 질문이면 바로 음성 재생
                playQuestionAudio(result.audioData).then(() => {
                  // 음성 재생 완료 후 읽기 단계 시작
                  setPhase('reading');
                  setTimeLeft(READING_TIME);
                });
              }
            }
          } catch (error) {
            console.error('❌ 답변 업로드 실패:', error);
            alert('답변 업로드에 실패했습니다. 다시 시도해주세요.');
            setIsLoading(false);
          }
        } else {
          // 일반 모드 (질문 저장소): 답변 저장 후 다음 질문으로 이동
          try {
            setIsLoading(true);

            // 현재 질문의 inq_id 가져오기
            const currentQuestionItem = questionItems[currentQuestionIndex];
            if (currentQuestionItem && currentQuestionItem.inq_id) {
              // STT로 변환된 답변이 있다면 저장 (현재는 녹화만 하므로 빈 문자열로 저장)
              // TODO: STT 기능 구현 시 실제 텍스트 답변으로 변경
              await saveAnswer(currentQuestionItem.inq_id, "");
              console.log(`답변 저장 완료 - inq_id: ${currentQuestionItem.inq_id}`);
            }

            if (currentQuestionIndex < selectedQuestions.length - 1) {
              setTimeout(() => {
                setCurrentQuestionIndex(currentQuestionIndex + 1);
                setPhase('reading');
                setTimeLeft(READING_TIME);
                setIsLoading(false);
              }, 2500);
            } else {
              // 모든 질문 완료
              setIsLoading(false);
              navigate('/interview/feedback', { state: { questions: askedQuestions } });
            }
          } catch (error) {
            console.error('❌ 답변 저장 실패:', error);
            setIsLoading(false);
            // 에러가 발생해도 다음 질문으로 진행
            if (currentQuestionIndex < selectedQuestions.length - 1) {
              setTimeout(() => {
                setCurrentQuestionIndex(currentQuestionIndex + 1);
                setPhase('reading');
                setTimeLeft(READING_TIME);
              }, 2500);
            } else {
              navigate('/interview/feedback', { state: { questions: askedQuestions } });
            }
          }
        }
      };
    } else {
      console.warn('❌ 녹화가 진행 중이지 않습니다. 답변 시간이 시작되지 않았을 수 있습니다.');
      alert('답변 시간이 시작되지 않았습니다.');
    }
  };

  // 현재 질문 표시 (AI 모드 vs 일반 모드)
  const displayQuestion = isAIMode
    ? currentQuestion
    : (selectedQuestions[currentQuestionIndex] || '질문이 없습니다.');

  // 일반 모드: 질문이 바뀔 때마다 askedQuestions에 추가 (중복 방지)
  useEffect(() => {
    if (!isAIMode && displayQuestion && displayQuestion !== '질문이 없습니다.') {
      setAskedQuestions(prev => {
        // 이미 존재하는 질문인지 확인
        const alreadyExists = prev.some(item => item.question === displayQuestion);
        if (alreadyExists) {
          return prev;
        }
        return [...prev, { question: displayQuestion, isFollowUp: false }];
      });
    }
  }, [displayQuestion, isAIMode]);

  // AI 모드: 첫 질문을 askedQuestions에 추가
  useEffect(() => {
    if (isAIMode && currentQuestion && askedQuestions.length === 0) {
      setAskedQuestions([{
        question: currentQuestion,
        isFollowUp: isTailQuestion
      }]);
    }
  }, [isAIMode, currentQuestion, isTailQuestion]);

  return (
    <Layout isLoggedIn={true} userName="김똑쓰">
      <Container>
        {/* 로딩 모달 */}
        {isLoading && (
          <Modal>
            <ModalOverlay />
            <ModalContent>
              <LoadingVideo autoPlay loop muted playsInline>
                <source src={loadingVideo} type="video/mp4" />
              </LoadingVideo>
              <LoadingText key={currentMessageIndex}>
                {LOADING_MESSAGES[currentMessageIndex]}
              </LoadingText>
            </ModalContent>
          </Modal>
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
              <QuestionText>{displayQuestion}</QuestionText>
              {isPlayingAudio && (
                <AudioPlayingIndicator>🔊 질문 음성 재생 중...</AudioPlayingIndicator>
              )}
              <QuestionHint>천천히 또박또박 답변해 주세요!</QuestionHint>
              {isAIMode && remainingSlots !== null && (
                <RemainingQuestionsInfo>
                  남은 질문 슬롯: {remainingSlots}개
                </RemainingQuestionsInfo>
              )}
              {isAIMode && isLastQuestion && (
                <LastQuestionBadge>🎯 마지막 질문입니다!</LastQuestionBadge>
              )}
            </QuestionBox>
          </InterviewerSection>

          {/* 우측 - 사용자 화면 */}
          <UserSection>
            <UserScreen>
              <VideoArea ref={videoRef} autoPlay playsInline muted />
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
  height: 100%;
  max-height: 85vh;
`;

const InterviewerScreen = styled.div`
  background: #1A1A1A;
  border-radius: ${({ theme }) => theme.borderRadius['2xl']};
  width: 100%;
  aspect-ratio: 16/9;
  max-height: 280px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  flex-shrink: 0;
`;

const InterviewerCharacter = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;

  img {
    width: 250px;
    height: 250px;
    object-fit: contain;
  }
`;

const QuestionBox = styled.div`
  width: 100%;
  text-align: center;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 0;
  overflow-y: auto;
  padding: ${({ theme }) => theme.spacing.lg};
  background: rgba(0, 0, 0, 0.2);
  border-radius: ${({ theme }) => theme.borderRadius.xl};

  /* 스크롤바 스타일링 */
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.2);
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(155, 143, 245, 0.5);
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: rgba(155, 143, 245, 0.7);
  }
`;

const QuestionText = styled.h2`
  font-size: ${({ theme }) => theme.fonts.size['2xl']};
  font-weight: ${({ theme }) => theme.fonts.weight.semibold};
  color: white;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  line-height: 1.6;
  word-break: keep-all;
  white-space: pre-wrap;
`;

const QuestionHint = styled.p`
  font-size: ${({ theme }) => theme.fonts.size.sm};
  color: ${({ theme }) => theme.colors.gray[400]};
`;

const RemainingQuestionsInfo = styled.p`
  font-size: ${({ theme }) => theme.fonts.size.xs};
  color: ${({ theme }) => theme.colors.gray[500]};
  margin-top: ${({ theme }) => theme.spacing.sm};
`;

const AudioPlayingIndicator = styled.p`
  font-size: ${({ theme }) => theme.fonts.size.sm};
  color: #9B8FF5;
  margin: ${({ theme }) => theme.spacing.sm} 0;
  font-weight: ${({ theme }) => theme.fonts.weight.semibold};
  animation: pulse 1.5s ease-in-out infinite;

  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }
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

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: ${({ theme }) => theme.zIndex.modal};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModalOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
`;

const ModalContent = styled.div`
  position: relative;
  background-color: transparent;
  border-radius: ${({ theme }) => theme.borderRadius['2xl']};
  padding: ${({ theme }) => theme.spacing['4xl']};
  max-width: 1200px;
  width: 95%;
  min-height: 700px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  padding-bottom: 100px;
  text-align: center;
  gap: ${({ theme }) => theme.spacing.xl};
  box-shadow: ${({ theme }) => theme.shadows.xl};
  overflow: hidden;
`;

const fadeInOut = keyframes`
  0% {
    opacity: 0;
    transform: translateY(-10px);
  }
  15% {
    opacity: 1;
    transform: translateY(0);
  }
  85% {
    opacity: 1;
    transform: translateY(0);
  }
  100% {
    opacity: 0;
    transform: translateY(10px);
  }
`;

const LoadingText = styled.div`
  font-size: ${({ theme }) => theme.fonts.size['2xl']};
  font-weight: ${({ theme }) => theme.fonts.weight.bold};
  color: white;
  animation: ${fadeInOut} 8s ease-in-out;
  min-height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  line-height: 1.5;
  position: relative;
  z-index: 1;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
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
  z-index: 1100;
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

const bounceAnimation = keyframes`
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
`;

const LoadingVideo = styled.video`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: ${({ theme }) => theme.borderRadius['2xl']};
  z-index: 0;
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

const LastQuestionBadge = styled.div`
  background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
  color: #1A1A1A;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  font-size: ${({ theme }) => theme.fonts.size.base};
  font-weight: ${({ theme }) => theme.fonts.weight.bold};
  text-align: center;
  margin-top: ${({ theme }) => theme.spacing.md};
  box-shadow: 0 2px 8px rgba(255, 215, 0, 0.3);
  animation: pulse 2s ease-in-out infinite;

  @keyframes pulse {
    0%, 100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.05);
    }
  }
`;

export default InterviewProgress;
