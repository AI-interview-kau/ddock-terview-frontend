import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import Layout from '../../components/common/Layout';
import ddocksWithMic from '../../assets/icons/ddocks with mic.png';
import micIcon from '../../assets/icons/mic.png';
import interviewerCalm from '../../assets/icons/온화형 면접관.png';
import interviewerPressure from '../../assets/icons/압박형 면접관.png';
import interviewerDry from '../../assets/icons/건조형 면접관.png';

const INTERVIEWER_TYPES = {
  calm: { name: '온화형 면접관', icon: interviewerCalm },
  pressure: { name: '압박형 면접관', icon: interviewerPressure },
  dry: { name: '건조형 면접관', icon: interviewerDry },
};

const InterviewMicTest = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedQuestions = location.state?.selectedQuestions || [];
  const isAIMode = location.state?.isAIMode || false;
  const sessionData = location.state?.sessionData || null;
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [interviewerType, setInterviewerType] = useState('calm');
  const [isTestCompleted, setIsTestCompleted] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);
  const interviewerTypesArray = ['calm', 'pressure', 'dry'];

  useEffect(() => {
    // 카메라 및 오디오 스트림 시작
    const startMedia = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (error) {
        console.error('카메라/마이크 접근 오류:', error);
      }
    };

    startMedia();

    // 음성 인식 초기화
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = 'ko-KR';
      recognition.continuous = true;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        const transcript = event.results[event.results.length - 1][0].transcript.trim();
        console.log('인식된 음성:', transcript);

        // "안녕하세요" 또는 "반갑습니다" 포함 시 테스트 완료
        if (transcript.includes('안녕') || transcript.includes('반갑')) {
          setIsTestCompleted(true);
          recognition.stop();
        }
      };

      recognition.onerror = (event) => {
        console.error('음성 인식 오류:', event.error);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;

      // 음성 인식 시작
      try {
        recognition.start();
      } catch (error) {
        console.error('음성 인식 시작 오류:', error);
      }
    }

    // 면접관 타입 로테이션 (3초마다 변경)
    let currentIndex = 0;
    const rotationInterval = setInterval(() => {
      currentIndex = (currentIndex + 1) % interviewerTypesArray.length;
      setInterviewerType(interviewerTypesArray[currentIndex]);
    }, 3000);

    // 컴포넌트 언마운트 시 정리
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      clearInterval(rotationInterval);
    };
  }, []);

  const handleExit = () => {
    // 스트림 정지
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    navigate('/interview');
  };

  const handleContinue = () => {
    if (!isTestCompleted) {
      // 테스트 완료 상태로 전환
      setIsTestCompleted(true);
      // 음성 인식 중지
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    } else {
      // 스트림 정지
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      // 면접 준비 화면으로 이동 (AI 모드 정보 전달)
      navigate('/interview/ready', {
        state: {
          selectedQuestions,
          isAIMode,
          sessionData
        }
      });
    }
  };

  const currentInterviewer = INTERVIEWER_TYPES[interviewerType];

  // 음성 테스트 완료 화면
  if (isTestCompleted) {
    return (
      <Layout isLoggedIn={true} userName="김똑쓰">
        <Container>
          <CompletionCard>
            <CheckIcon>✓</CheckIcon>
            <CompletionTitle>음성 테스트를 통과했어요!</CompletionTitle>
            <IllustrationWrapper>
              <MicIllustration>
                <img src={micIcon} alt="Microphone" />
              </MicIllustration>
              <DdocksIllustration>
                <img src={ddocksWithMic} alt="Ddocks" />
              </DdocksIllustration>
            </IllustrationWrapper>
          </CompletionCard>
          <BottomButtonWrapper>
            <ContinueButton onClick={handleContinue}>진행하기</ContinueButton>
            <ExitButton onClick={handleExit}>종료하기</ExitButton>
          </BottomButtonWrapper>
        </Container>
      </Layout>
    );
  }

  // 음성 테스트 진행 화면
  return (
    <Layout isLoggedIn={true} userName="김똑쓰">
      <Container>
        <ContentLayout>
          <TestCard>
            <TestHeader>
              <Title>마이크 테스트</Title>
              <TitleUnderline />
            </TestHeader>
            <Subtitle>다음 글을 따라 읽어주세요.</Subtitle>

            <CameraSection>
              <TestText>안녕하세요. 반갑습니다.</TestText>

              <VideoWrapper>
                <VideoElement ref={videoRef} autoPlay playsInline muted />

                <CharacterOverlay>
                  <DdocksWithMic>
                    <img src={ddocksWithMic} alt="Ddocks with Mic" />
                  </DdocksWithMic>
                  <MicIcon>
                    <img src={micIcon} alt="Microphone" />
                  </MicIcon>
                </CharacterOverlay>
              </VideoWrapper>
            </CameraSection>
          </TestCard>

          <RightSection>
            <SpeechBubble>이런 면접관 유형들이 나와요!</SpeechBubble>
            <InterviewerSection>
              <InterviewerIcon>
                <img src={currentInterviewer.icon} alt={currentInterviewer.name} />
              </InterviewerIcon>
              <InterviewerName>{currentInterviewer.name}</InterviewerName>
            </InterviewerSection>

          </RightSection>
        </ContentLayout>

        <BottomTestButtonWrapper>
          <ContinueButton onClick={handleContinue}>진행하기</ContinueButton>
          <ExitButton onClick={handleExit}>종료하기</ExitButton>
        </BottomTestButtonWrapper>
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

const ContentLayout = styled.div`
  position: relative;
  max-width: 1400px;
  width: 100%;
  min-height: 600px;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
`;

const TestCard = styled.div`
  background: linear-gradient(to top, #D1E8FF 0%, #EBF5FF 50%, #FFFFFF 100%);
  border-radius: ${({ theme }) => theme.borderRadius['3xl']};
  padding: ${({ theme }) => theme.spacing['4xl']} ${({ theme }) => theme.spacing['3xl']};
  width: 100%;
  max-width: 1000px;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xl};
  box-shadow: ${({ theme }) => theme.shadows.xl};
`;

const TestHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.fonts.size['2xl']};
  font-weight: ${({ theme }) => theme.fonts.weight.bold};
  color: ${({ theme }) => theme.colors.text.dark};
  text-align: center;
`;

const TitleUnderline = styled.div`
  width: 120px;
  height: 3px;
  background-color: #8B7AB8;
  border-radius: 2px;
`;

const Subtitle = styled.p`
  font-size: ${({ theme }) => theme.fonts.size.base};
  color: ${({ theme }) => theme.colors.gray[600]};
  text-align: center;
`;

const CameraSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
  margin: ${({ theme }) => theme.spacing.xl} 0;
`;

const RightSection = styled.div`
  position: absolute;
  right: 0;
  bottom: 50%;
  transform: translateY(50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xl};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    position: relative;
    margin-top: ${({ theme }) => theme.spacing['2xl']};
    transform: none;
  }
`;

const SpeechBubble = styled.div`
  position: relative;
  background-color: white;
  color: ${({ theme }) => theme.colors.text.dark};
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  font-size: ${({ theme }) => theme.fonts.size.base};
  font-weight: ${({ theme }) => theme.fonts.weight.semibold};
  box-shadow: ${({ theme }) => theme.shadows.md};
  white-space: nowrap;

  &::after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
    border-top: 10px solid white;
    filter: drop-shadow(0 2px 2px rgba(0, 0, 0, 0.1));
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    font-size: ${({ theme }) => theme.fonts.size.sm};
    padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  }
`;

const TestText = styled.div`
  background-color: #F5F5F5;
  padding: ${({ theme }) => theme.spacing.xl};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  text-align: center;
  font-size: ${({ theme }) => theme.fonts.size.xl};
  font-weight: ${({ theme }) => theme.fonts.weight.semibold};
  color: ${({ theme }) => theme.colors.text.dark};
  width: 100%;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;

const VideoWrapper = styled.div`
  position: relative;
  width: 100%;
  max-width: 600px;
  aspect-ratio: 4 / 3;
  background-color: #1a1a1a;
  border-radius: ${({ theme }) => theme.borderRadius['2xl']};
  overflow: visible;
  margin: 0 auto;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
`;

const VideoElement = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: ${({ theme }) => theme.borderRadius['2xl']};
`;

const CharacterOverlay = styled.div`
  position: absolute;
  bottom: 20px;
  left: -120px;
  display: flex;
  align-items: flex-end;
  gap: ${({ theme }) => theme.spacing.sm};
  z-index: 10;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    left: -60px;
  }
`;

const DdocksWithMic = styled.div`
  position: relative;
  z-index: 1;

  img {
    width: 140px;
    height: 140px;
    object-fit: contain;
    filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    img {
      width: 80px;
      height: 80px;
    }
  }
`;

const MicIcon = styled.div`
  position: relative;
  bottom: 25px;
  left: -35px;
  z-index: 2;

  img {
    width: 75px;
    height: 75px;
    object-fit: contain;
    filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    img {
      width: 55px;
      height: 55px;
    }
  }
`;

const InterviewerSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const InterviewerIcon = styled.div`
  img {
    width: 280px;
    height: 280px;
    object-fit: contain;
  }
`;

const InterviewerName = styled.p`
  font-size: ${({ theme }) => theme.fonts.size.xl};
  font-weight: ${({ theme }) => theme.fonts.weight.bold};
  color: white;
  text-align: center;
`;

// 음성 테스트 완료 화면 스타일
const CompletionCard = styled.div`
  background: linear-gradient(to top, #D1E8FF 0%, #EBF5FF 50%, #FFFFFF 100%);
  border-radius: ${({ theme }) => theme.borderRadius['3xl']};
  padding: ${({ theme }) => theme.spacing['4xl']} ${({ theme }) => theme.spacing['3xl']};
  max-width: 950px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing['2xl']};
  box-shadow: ${({ theme }) => theme.shadows.xl};
  margin: 0 auto;
`;

const CheckIcon = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #8B7AB8;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36px;
  font-weight: bold;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const CompletionTitle = styled.h1`
  font-size: ${({ theme }) => theme.fonts.size['3xl']};
  font-weight: ${({ theme }) => theme.fonts.weight.bold};
  color: ${({ theme }) => theme.colors.text.dark};
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const IllustrationWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing['3xl']};
  margin: ${({ theme }) => theme.spacing['2xl']} 0;
  position: relative;
`;

const MicIllustration = styled.div`
  img {
    width: 200px;
    height: 200px;
    object-fit: contain;
    filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1));
  }
`;

const DdocksIllustration = styled.div`
  img {
    width: 200px;
    height: 200px;
    object-fit: contain;
    filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1));
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
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    right: auto;
    width: calc(100% - 40px);
    max-width: 400px;
    flex-direction: column;
  }
`;

const BottomTestButtonWrapper = styled.div`
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
  white-space: nowrap;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    width: 100%;
    min-width: unset;
  }

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
  white-space: nowrap;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    width: 100%;
    min-width: unset;
  }

  &:hover {
    background-color: #4B5563;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }
`;

export default InterviewMicTest;
