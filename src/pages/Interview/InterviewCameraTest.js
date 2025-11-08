import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import Layout from '../../components/common/Layout';
import ddocksCharacter from '../../assets/icons/ddocks with mic.png';
import cameraIcon from '../../assets/icons/camera.png';
import interviewerCalm from '../../assets/icons/온화형 면접관.png';
import interviewerPressure from '../../assets/icons/압박형 면접관.png';
import interviewerDry from '../../assets/icons/건조형 면접관.png';

const INTERVIEWER_TYPES = {
  calm: { name: '온화형 면접관', icon: interviewerCalm },
  pressure: { name: '압박형 면접관', icon: interviewerPressure },
  dry: { name: '건조형 면접관', icon: interviewerDry },
};

const InterviewCameraTest = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedQuestions = location.state?.selectedQuestions || [];
  const questionItems = location.state?.questionItems || [];  // inq_id 포함된 데이터
  const isAIMode = location.state?.isAIMode || false;
  const sessionData = location.state?.sessionData || null;
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [interviewerType, setInterviewerType] = useState('calm'); // 기본값: 온화형
  const [isTestCompleted, setIsTestCompleted] = useState(false); // 카메라 테스트 완료 상태
  const interviewerTypesArray = ['calm', 'pressure', 'dry'];

  useEffect(() => {
    // 카메라 스트림 시작
    const startCamera = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (error) {
        console.error('카메라 접근 오류:', error);
      }
    };

    startCamera();

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
    } else {
      // 스트림 정지
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      // 마이크 테스트로 이동 (AI 모드 정보 전달)
      navigate('/interview/mic-test', {
        state: {
          selectedQuestions,
          questionItems,  // inq_id 포함된 데이터 전달
          isAIMode,
          sessionData
        }
      });
    }
  };

  const currentInterviewer = INTERVIEWER_TYPES[interviewerType];

  // 카메라 테스트 완료 화면
  if (isTestCompleted) {
    return (
      <Layout isLoggedIn={true} userName="김똑쓰">
        <Container>
          <CompletionCard>
            <CheckIcon>✓</CheckIcon>
            <CompletionTitle>카메라 테스트를 통과했어요!</CompletionTitle>
            <IllustrationWrapper>
              <CameraIllustration>
                <img src={cameraIcon} alt="Camera" />
              </CameraIllustration>
              <DdocksIllustration>
                <img src={ddocksCharacter} alt="Ddocks" />
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

  // 카메라 테스트 진행 화면
  return (
    <Layout isLoggedIn={true} userName="김똑쓰">
      <Container>
        <CameraTestCard>
          <TestHeader>
            <HeaderTitle>카메라 테스트</HeaderTitle>
            <HeaderUnderline />
          </TestHeader>

          <InstructionText>화면을 응시하며 진행해주세요.</InstructionText>

          <InstructionBox>고개를 끄덕여주세요!</InstructionBox>

          <VideoSection>
            <VideoWrapper>
              <VideoElement ref={videoRef} autoPlay playsInline muted />
            </VideoWrapper>

            <CameraTestOverlay>
              <DdocksCharacter>
                <img src={ddocksCharacter} alt="Ddocks Character" />
              </DdocksCharacter>
              <CameraIcon>
                <img src={cameraIcon} alt="Camera" />
              </CameraIcon>
            </CameraTestOverlay>
          </VideoSection>
        </CameraTestCard>

        <BottomButtonWrapper>
          <ContinueButton onClick={handleContinue}>진행하기</ContinueButton>
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

const CameraTestCard = styled.div`
  background: linear-gradient(to bottom, #FFFFFF 0%, #EBF5FF 50%, #D1E8FF 100%);
  border-radius: ${({ theme }) => theme.borderRadius['3xl']};
  padding: ${({ theme }) => theme.spacing['4xl']} ${({ theme }) => theme.spacing['3xl']};
  max-width: 1000px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: ${({ theme }) => theme.shadows.xl};
`;

const TestHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const HeaderTitle = styled.h1`
  font-size: ${({ theme }) => theme.fonts.size['2xl']};
  font-weight: ${({ theme }) => theme.fonts.weight.bold};
  color: ${({ theme }) => theme.colors.text.dark};
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const HeaderUnderline = styled.div`
  width: 120px;
  height: 3px;
  background-color: #8B7AB8;
  border-radius: 2px;
`;

const InstructionText = styled.p`
  font-size: ${({ theme }) => theme.fonts.size.base};
  color: ${({ theme }) => theme.colors.gray[600]};
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const InstructionBox = styled.div`
  background-color: #F5F5F5;
  padding: ${({ theme }) => theme.spacing.xl};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  text-align: center;
  font-size: ${({ theme }) => theme.fonts.size.xl};
  font-weight: ${({ theme }) => theme.fonts.weight.semibold};
  color: ${({ theme }) => theme.colors.text.dark};
  margin-bottom: ${({ theme }) => theme.spacing['2xl']};
  width: 100%;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;

const VideoSection = styled.div`
  position: relative;
  width: 100%;
  max-width: 800px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const VideoWrapper = styled.div`
  position: relative;
  width: 100%;
  max-width: 600px;
  aspect-ratio: 4 / 3;
  background-color: #1a1a1a;
  border-radius: ${({ theme }) => theme.borderRadius['2xl']};
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
`;

const VideoElement = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: ${({ theme }) => theme.borderRadius['2xl']};
`;

const CameraTestOverlay = styled.div`
  position: absolute;
  left: -120px;
  bottom: 20px;
  display: flex;
  align-items: flex-end;
  gap: ${({ theme }) => theme.spacing.sm};
  z-index: 10;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    left: -60px;
  }
`;

const DdocksCharacter = styled.div`
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

const CameraIcon = styled.div`
  position: relative;
  bottom: 25px;
  left: -15px;
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

// 카메라 테스트 완료 화면 스타일
const CompletionCard = styled.div`
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

const CameraIllustration = styled.div`
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

export default InterviewCameraTest;
