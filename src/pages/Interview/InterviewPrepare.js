import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import Layout from '../../components/common/Layout';
import Button from '../../components/common/Button';
import iconInterview from '../../assets/icons/icon_interview.png';
import starIcon from '../../assets/icons/Star (2).png';
import ddocks2 from '../../assets/icons/ddocks2.png';
import { createInterviewSession } from '../../api/interviewService';

const InterviewPrepare = () => {
  const navigate = useNavigate();
  const DOCUMENTS_STORAGE_KEY = 'ddock_my_documents';
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showSavedDocsModal, setShowSavedDocsModal] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [assignmentStage, setAssignmentStage] = useState(0); // 0: 없음, 1: 면접관 배정 중, 2: 준비 완료
  const [savedDocuments, setSavedDocuments] = useState([]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedFile(file);
      setShowUploadModal(true);
    }
  };

  useEffect(() => {
    // 면접관 배정 중 -> 준비 완료로 전환
    if (assignmentStage === 1) {
      const timer = setTimeout(() => {
        setAssignmentStage(2);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [assignmentStage]);

  const confirmUpload = async () => {
    setShowUploadModal(false);
    setIsLoading(true);

    try {
      // API 호출: 자소서 기반 면접 세션 생성
      const sessionData = await createInterviewSession('RESUME-BASED');
      console.log('Resume-based session created:', sessionData);

      // 세션 정보를 localStorage에 저장
      localStorage.setItem('currentSession', JSON.stringify(sessionData));

      // AI 분석 시뮬레이션
      setTimeout(() => {
        setIsLoading(false);
        // 면접관 배정 단계로 전환
        setAssignmentStage(1);
      }, 2000);
    } catch (error) {
      console.error('Failed to create session:', error);
      setIsLoading(false);
      alert('면접 세션 생성에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const handleStartInterview = () => {
    navigate('/interview/camera-test');
  };

  const handleCloseAssignment = () => {
    setAssignmentStage(0);
  };

  const handleSavedDocuments = () => {
    // localStorage에서 저장된 자소서 가져오기
    try {
      const savedDocs = localStorage.getItem(DOCUMENTS_STORAGE_KEY);
      const docs = savedDocs ? JSON.parse(savedDocs) : [];

      if (docs.length > 0) {
        setSavedDocuments(docs);
        setShowSavedDocsModal(true);
      } else {
        alert('저장된 자소서가 없습니다. 자소서 보관함에서 먼저 자소서를 업로드해주세요.');
      }
    } catch (error) {
      console.error('Failed to load documents:', error);
      alert('저장된 자소서를 불러오는데 실패했습니다.');
    }
  };

  const handleDocumentSelect = async (doc) => {
    setShowSavedDocsModal(false);
    setUploadedFile({ name: doc.name });
    setIsLoading(true);

    try {
      // API 호출: 자소서 기반 면접 세션 생성
      const sessionData = await createInterviewSession('RESUME-BASED');
      console.log('Resume-based session created:', sessionData);

      // 세션 정보를 localStorage에 저장
      localStorage.setItem('currentSession', JSON.stringify(sessionData));

      // AI 분석 시뮬레이션
      setTimeout(() => {
        setIsLoading(false);
        setAssignmentStage(1);
      }, 2000);
    } catch (error) {
      console.error('Failed to create session:', error);
      setIsLoading(false);
      alert('면접 세션 생성에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const handleStartWithoutDoc = async () => {
    try {
      // API 호출: 맞춤형 면접 세션 생성
      const sessionData = await createInterviewSession('CUSTOMIZED');
      console.log('Session created:', sessionData);

      // 세션 정보를 localStorage에 저장
      localStorage.setItem('currentSession', JSON.stringify(sessionData));

      // 질문 선택 페이지로 이동
      navigate('/interview/question-selection');
    } catch (error) {
      console.error('Failed to create session:', error);
      alert('면접 세션 생성에 실패했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <Layout isLoggedIn={true} userName="김똑쓰">
      <Container>
        <GrayQuarterCircle />
        <SkyBlueSemicircle />

        <DecorativeCharacter>
          <img src={iconInterview} alt="Character" />
          <Star1>
            <img src={starIcon} alt="Star" />
          </Star1>
          <Star2>
            <img src={starIcon} alt="Star" />
          </Star2>
        </DecorativeCharacter>
        <DecorativeCircle />

        <CardWrapper>
          {/* 좌측 카드 - 자소서 기반 */}
          <Card>
            <CardTitle>합격의 문을 여는 첫걸음,</CardTitle>
            <CardSubtitle>
              내 자기소개서 기반 질문으로<br />
              완벽 대비
            </CardSubtitle>

            <Description>
              자기소개서를 업로드하고 AI의 정교한 분석으로<br />
              실전 면접 질문과 전략을 경험하세요.
            </Description>

            <ButtonGroup>
              <PrimaryButton>
                <label htmlFor="file-upload">새 자소서 업로드</label>
                <input
                  id="file-upload"
                  type="file"
                  accept=".pdf,.docx,.doc"
                  onChange={handleFileUpload}
                  style={{ display: 'none' }}
                />
              </PrimaryButton>
              <FileFormat>(PDF, DOCX 등, 5MB)</FileFormat>

              <SecondaryButton onClick={handleSavedDocuments}>
                저장된 자소서 선택
              </SecondaryButton>
              <SmallText>(1개의 자소서가 저장됩니다.)</SmallText>
            </ButtonGroup>
          </Card>

          {/* 우측 카드 - 자소서 없이 */}
          <Card>
            <CardTitle>자기소개서가 없어도 괜찮아요!</CardTitle>

            <CardSubtitle>
              지금 바로<br />
              기본 면접 질문으로 연습하기
            </CardSubtitle>

            <DescriptionSmall>
              준비된 질문을 선택하거나, 나만의 질문을 직접<br />
              입력하여 면접을 대비해 보세요.
            </DescriptionSmall>

            <CharacterSection>
              <CharacterIcon>
                <img src={iconInterview} alt="Interview Icon" />
              </CharacterIcon>
              <CharacterIcon>
                <img src={iconInterview} alt="Interview Icon" />
              </CharacterIcon>
            </CharacterSection>

            <StartButton onClick={handleStartWithoutDoc}>
              면접 연습 시작
            </StartButton>
          </Card>
        </CardWrapper>

        {/* 업로드 확인 모달 */}
        {showUploadModal && (
          <Modal>
            <ModalOverlay onClick={() => setShowUploadModal(false)} />
            <ModalContent>
              <ModalIcon>📄</ModalIcon>
              <ModalTitle>이 파일로 시작할까요?</ModalTitle>
              <ModalText>
                '{uploadedFile?.name}' 파일로 AI 면접 연습을 시작할
                준비가 되셨나요?
              </ModalText>
              <ModalButtons>
                <ModalButton onClick={confirmUpload}>
                  파일 업로드
                </ModalButton>
                <ModalButton
                  $variant="outline"
                  onClick={() => setShowUploadModal(false)}
                >
                  다시 선택하기
                </ModalButton>
              </ModalButtons>
            </ModalContent>
          </Modal>
        )}

        {/* AI 분석 로딩 모달 */}
        {isLoading && (
          <Modal>
            <ModalOverlay />
            <ModalContent>
              <ModalTitle>포트폴리오를 분석해 질문을 생성 중이에요!</ModalTitle>
              <LoadingIcon>
                <img src={ddocks2} alt="Interview Icon" />
              </LoadingIcon>
            </ModalContent>
          </Modal>
        )}

        {/* 저장된 자소서 선택 모달 */}
        {showSavedDocsModal && (
          <Modal>
            <ModalOverlay onClick={() => setShowSavedDocsModal(false)} />
            <SavedDocsModalContent>
              <ModalTitle>저장된 자소서 선택</ModalTitle>
              <DocumentsList>
                {savedDocuments.map((doc) => (
                  <DocumentItem key={doc.id} onClick={() => handleDocumentSelect(doc)}>
                    <DocumentIcon>📄</DocumentIcon>
                    <DocumentInfo>
                      <DocumentName>{doc.name}</DocumentName>
                      <DocumentDate>업로드: {doc.uploadDate}</DocumentDate>
                    </DocumentInfo>
                  </DocumentItem>
                ))}
              </DocumentsList>
              <ModalButtons>
                <ModalButton
                  $variant="outline"
                  onClick={() => setShowSavedDocsModal(false)}
                >
                  취소
                </ModalButton>
              </ModalButtons>
            </SavedDocsModalContent>
          </Modal>
        )}

        {/* 면접관 배정 모달 */}
        {assignmentStage > 0 && (
          <Modal>
            <ModalOverlay />
            <AssignmentModalContent>
              {assignmentStage === 2 && (
                <CloseButton onClick={handleCloseAssignment}>✕</CloseButton>
              )}

              {assignmentStage === 1 ? (
                <>
                  <AssignmentModalTitle>어떤 면접관을 만날지 랜덤으로 배정 중이에요!</AssignmentModalTitle>
                  <AssignmentLoadingIcon>
                    <img src={ddocks2} alt="Interview Icon" />
                  </AssignmentLoadingIcon>
                </>
              ) : (
                <>
                  <AssignmentModalTitle>면접 준비 완료!</AssignmentModalTitle>
                  <AssignmentInfoSection>
                    <AssignmentInfoText>
                      지원자의 논리적 허점과 대처 능력을 날카롭게 파고드는 압박 면접관이 배정되었어요.
                    </AssignmentInfoText>
                    <AssignmentInfoHighlight>
                      총 <Strong>3개</Strong>의 질문으로 면접 연습을 시작합니다.
                    </AssignmentInfoHighlight>
                    <AssignmentInfoText>
                      면접 연습은 약 <Strong>2~3분</Strong> 정도 소요될 예정이에요.
                    </AssignmentInfoText>
                    <AssignmentInfoText>이 면접의 끝에서, 당신은 한 단계 더 성장해 있을 겁니다 !</AssignmentInfoText>
                  </AssignmentInfoSection>

                  <AssignmentCharacterSmall>
                    <img src={ddocks2} alt="Interview Character" />
                  </AssignmentCharacterSmall>

                  <AssignmentStartButton onClick={handleStartInterview}>
                    면접 연습 시작
                  </AssignmentStartButton>
                </>
              )}
            </AssignmentModalContent>
          </Modal>
        )}
      </Container>
    </Layout>
  );
};

const Container = styled.div.attrs({ className: 'interview-prepare-container' })`
  min-height: calc(100vh - 80px);
  background-color: ${({ theme }) => theme.colors.background};
  padding: ${({ theme }) => theme.spacing['4xl']} ${({ theme }) => theme.spacing.xl};
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
`;

const DecorativeCharacter = styled.div.attrs({ className: 'decorative-character' })`
  position: absolute;
  left: 80px;
  top: 50%;
  transform: translateY(-50%);
  width: 200px;
  height: 200px;
  background: linear-gradient(135deg, #9B8FF5 0%, #7C6FEE 100%);
  border-radius: ${({ theme }) => theme.borderRadius.full};
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: ${({ theme }) => theme.shadows.xl};
  z-index: 1;

  img {
    width: 140px;
    height: 140px;
    object-fit: contain;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    display: none;
  }
`;

const DecorativeCircle = styled.div.attrs({ className: 'decorative-circle' })`
  position: absolute;
  right: 80px;
  top: 50%;
  transform: translateY(-50%);
  width: 180px;
  height: 180px;
  background: linear-gradient(135deg, #E8E0FF 0%, #D1C4E9 100%);
  border-radius: ${({ theme }) => theme.borderRadius.full};
  z-index: 1;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    display: none;
  }
`;

const GrayQuarterCircle = styled.div.attrs({ className: 'gray-quarter-circle' })`
  position: absolute;
  left: 0;
  bottom: 0;
  width: 300px;
  height: 300px;
  background: #D3D3D3;
  border-radius: 0 100% 0 0;
  z-index: 0;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    display: none;
  }
`;

const SkyBlueSemicircle = styled.div.attrs({ className: 'sky-blue-semicircle' })`
  position: absolute;
  right: 0;
  top: 100px;
  width: 200px;
  height: 400px;
  background: #87CEEB;
  border-radius: 200px 0 0 200px;
  z-index: 0;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    display: none;
  }
`;

const Star1 = styled.div.attrs({ className: 'star-1' })`
  position: absolute;
  top: 30px;
  right: -20px;

  img {
    width: 45px;
    height: 45px;
    object-fit: contain;
  }
`;

const Star2 = styled.div.attrs({ className: 'star-2' })`
  position: absolute;
  bottom: 40px;
  left: -15px;

  img {
    width: 50px;
    height: 50px;
    object-fit: contain;
  }
`;

const CardWrapper = styled.div.attrs({ className: 'card-wrapper' })`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing['3xl']};
  max-width: 1400px;
  width: 100%;
  z-index: 2;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.div.attrs({ className: 'interview-option-card' })`
  background-color: white;
  border-radius: ${({ theme }) => theme.borderRadius['2xl']};
  padding: ${({ theme }) => theme.spacing['4xl']};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xl};
  min-height: 550px;
`;

const CardTitle = styled.h2.attrs({ className: 'card-title' })`
  font-size: ${({ theme }) => theme.fonts.size['2xl']};
  font-weight: ${({ theme }) => theme.fonts.weight.bold};
  color: ${({ theme }) => theme.colors.text.dark};
  text-align: center;
`;

const CardSubtitle = styled.h3.attrs({ className: 'card-subtitle' })`
  font-size: ${({ theme }) => theme.fonts.size['3xl']};
  font-weight: ${({ theme }) => theme.fonts.weight.bold};
  color: ${({ theme }) => theme.colors.text.dark};
  text-align: center;
  line-height: 1.4;
`;

const Description = styled.p.attrs({ className: 'description' })`
  font-size: ${({ theme }) => theme.fonts.size.base};
  color: ${({ theme }) => theme.colors.gray[600]};
  text-align: center;
  line-height: 1.6;
  margin-top: ${({ theme }) => theme.spacing.md};
`;

const DescriptionSmall = styled.p.attrs({ className: 'description-small' })`
  font-size: ${({ theme }) => theme.fonts.size.base};
  color: ${({ theme }) => theme.colors.gray[600]};
  text-align: center;
  line-height: 1.6;
  margin-top: ${({ theme }) => theme.spacing.md};
`;

const ButtonGroup = styled.div.attrs({ className: 'button-group' })`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  width: 100%;
  margin-top: ${({ theme }) => theme.spacing.lg};
`;

const PrimaryButton = styled.div.attrs({ className: 'primary-button' })`
  label {
    display: block;
    background-color: #9B8FF5;
    color: white;
    padding: ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing['2xl']};
    border-radius: ${({ theme }) => theme.borderRadius.full};
    text-align: center;
    cursor: pointer;
    font-weight: ${({ theme }) => theme.fonts.weight.semibold};
    font-size: ${({ theme }) => theme.fonts.size.lg};
    transition: all ${({ theme }) => theme.transitions.fast};
    min-width: 280px;

    &:hover {
      background-color: #8B7FE5;
      transform: translateY(-2px);
      box-shadow: ${({ theme }) => theme.shadows.md};
    }
  }
`;

const SecondaryButton = styled(Button).attrs({ className: 'secondary-button' })`
  background-color: white;
  color: #9B8FF5;
  border: 2px solid #9B8FF5;
  padding: ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing['2xl']};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  min-width: 280px;
  font-size: ${({ theme }) => theme.fonts.size.lg};

  &:hover {
    background-color: #9B8FF5;
    color: white;
  }
`;

const FileFormat = styled.span.attrs({ className: 'file-format' })`
  display: block;
  font-size: ${({ theme }) => theme.fonts.size.xs};
  color: ${({ theme }) => theme.colors.gray[500]};
  text-align: center;
  margin-top: ${({ theme }) => theme.spacing.xs};
`;

const SmallText = styled.span.attrs({ className: 'small-text' })`
  font-size: ${({ theme }) => theme.fonts.size.xs};
  color: ${({ theme }) => theme.colors.gray[500]};
  text-align: center;
  margin-top: ${({ theme }) => theme.spacing.xs};
`;

const CharacterSection = styled.div.attrs({ className: 'character-section' })`
  display: flex;
  gap: ${({ theme }) => theme.spacing.lg};
  margin-top: ${({ theme }) => theme.spacing.xl};
  justify-content: center;

  & > div:nth-child(2) img {
    transform: scaleX(-1);
  }
`;

const CharacterIcon = styled.div.attrs({ className: 'character-icon' })`
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 110px;
    height: 110px;
    object-fit: contain;
  }
`;

const StartButton = styled(Button).attrs({ className: 'start-button' })`
  background-color: #9B8FF5;
  width: 100%;
  max-width: 320px;
  margin-top: ${({ theme }) => theme.spacing.xl};
  padding: ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing['2xl']};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: ${({ theme }) => theme.fonts.size.lg};

  &:hover {
    background-color: #8B7FE5;
  }
`;

// Modal styles
const Modal = styled.div.attrs({ className: 'modal' })`
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

const ModalOverlay = styled.div.attrs({ className: 'modal-overlay' })`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
`;

const ModalContent = styled.div.attrs({ className: 'modal-content' })`
  position: relative;
  background-color: white;
  border-radius: ${({ theme }) => theme.borderRadius['2xl']};
  padding: ${({ theme }) => theme.spacing['4xl']};
  max-width: 900px;
  width: 90%;
  min-height: 550px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: ${({ theme }) => theme.spacing.xl};
  box-shadow: ${({ theme }) => theme.shadows.xl};
`;

const ModalIcon = styled.div.attrs({ className: 'modal-icon' })`
  font-size: ${({ theme }) => theme.fonts.size['5xl']};
  margin: ${({ theme }) => theme.spacing.xl} 0;
`;

const LoadingIcon = styled.div.attrs({ className: 'loading-icon' })`
  font-size: ${({ theme }) => theme.fonts.size['5xl']};
  margin: ${({ theme }) => theme.spacing.xl} 0;
  animation: bounce 1s infinite;

  img {
    width: 180px;
    height: 180px;
    object-fit: contain;
  }

  @keyframes bounce {
    0%,
    100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-20px);
    }
  }
`;

const ModalTitle = styled.h3.attrs({ className: 'modal-title' })`
  font-size: ${({ theme }) => theme.fonts.size['2xl']};
  font-weight: ${({ theme }) => theme.fonts.weight.bold};
  color: ${({ theme }) => theme.colors.text.dark};
  text-align: center;
`;

const ModalText = styled.p.attrs({ className: 'modal-text' })`
  font-size: ${({ theme }) => theme.fonts.size.base};
  color: ${({ theme }) => theme.colors.gray[600]};
  line-height: 1.6;
  margin: ${({ theme }) => theme.spacing.md} 0;
`;

const ModalButtons = styled.div.attrs({ className: 'modal-buttons' })`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  width: 100%;
  max-width: 400px;
  margin-top: ${({ theme }) => theme.spacing.lg};
`;

const ModalButton = styled(Button).attrs({ className: 'modal-button' })`
  width: 100%;
`;

// Assignment Modal styles
const AssignmentModalContent = styled.div`
  position: relative;
  background-color: white;
  border-radius: ${({ theme }) => theme.borderRadius['2xl']};
  padding: ${({ theme }) => theme.spacing['4xl']};
  max-width: 900px;
  width: 90%;
  min-height: 550px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.xl};
  box-shadow: ${({ theme }) => theme.shadows.xl};
  z-index: 2;
`;

const bounce2 = keyframes`
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
`;

const AssignmentLoadingIcon = styled.div`
  font-size: ${({ theme }) => theme.fonts.size['5xl']};
  margin: ${({ theme }) => theme.spacing.xl} 0;
  animation: ${bounce2} 1.5s infinite;

  img {
    width: 180px;
    height: 180px;
    object-fit: contain;
  }
`;

const AssignmentModalTitle = styled.h3`
  font-size: ${({ theme }) => theme.fonts.size['2xl']};
  font-weight: ${({ theme }) => theme.fonts.weight.bold};
  color: ${({ theme }) => theme.colors.text.dark};
  text-align: center;
`;

const CloseButton = styled.button`
  position: absolute;
  top: ${({ theme }) => theme.spacing.xl};
  left: ${({ theme }) => theme.spacing.xl};
  background: none;
  border: none;
  font-size: ${({ theme }) => theme.fonts.size['2xl']};
  color: ${({ theme }) => theme.colors.text.dark};
  cursor: pointer;
  padding: ${({ theme }) => theme.spacing.sm};
  line-height: 1;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    color: ${({ theme }) => theme.colors.gray[600]};
  }
`;

const AssignmentInfoSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  text-align: center;
  max-width: 600px;
`;

const AssignmentInfoText = styled.p`
  font-size: ${({ theme }) => theme.fonts.size.base};
  color: ${({ theme }) => theme.colors.text.dark};
  line-height: 1.6;
`;

const AssignmentInfoHighlight = styled.p`
  font-size: ${({ theme }) => theme.fonts.size.lg};
  color: ${({ theme }) => theme.colors.text.dark};
  line-height: 1.6;
  margin: ${({ theme }) => theme.spacing.sm} 0;
`;

const Strong = styled.span`
  font-weight: ${({ theme }) => theme.fonts.weight.bold};
  color: #9B8FF5;
`;

const AssignmentCharacterSmall = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: ${({ theme }) => theme.spacing.lg} 0;

  img {
    width: 120px;
    height: 120px;
    object-fit: contain;
  }
`;

const AssignmentStartButton = styled.button`
  background-color: #9B8FF5;
  color: white;
  padding: ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing['3xl']};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: ${({ theme }) => theme.fonts.size.lg};
  font-weight: ${({ theme }) => theme.fonts.weight.semibold};
  border: none;
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  min-width: 250px;
  margin-top: ${({ theme }) => theme.spacing.lg};

  &:hover {
    background-color: #8B7FE5;
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.md};
  }
`;

// Saved Documents Modal styles
const SavedDocsModalContent = styled.div`
  position: relative;
  background-color: white;
  border-radius: ${({ theme }) => theme.borderRadius['2xl']};
  padding: ${({ theme }) => theme.spacing['4xl']};
  max-width: 600px;
  width: 90%;
  max-height: 70vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xl};
  box-shadow: ${({ theme }) => theme.shadows.xl};
  z-index: 2;
`;

const DocumentsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const DocumentItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  background-color: ${({ theme }) => theme.colors.gray[50]};
  border: 2px solid ${({ theme }) => theme.colors.gray[200]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    background-color: white;
    border-color: #9B8FF5;
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.md};
  }
`;

const DocumentIcon = styled.div`
  font-size: ${({ theme }) => theme.fonts.size['3xl']};
`;

const DocumentInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const DocumentName = styled.div`
  font-size: ${({ theme }) => theme.fonts.size.base};
  font-weight: ${({ theme }) => theme.fonts.weight.semibold};
  color: ${({ theme }) => theme.colors.text.dark};
`;

const DocumentDate = styled.div`
  font-size: ${({ theme }) => theme.fonts.size.sm};
  color: ${({ theme }) => theme.colors.gray[600]};
`;

export default InterviewPrepare;
