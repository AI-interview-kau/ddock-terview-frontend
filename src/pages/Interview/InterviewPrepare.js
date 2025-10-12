import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Layout from '../../components/common/Layout';
import Button from '../../components/common/Button';
import iconInterview from '../../assets/icons/icon_interview.png';

const InterviewPrepare = () => {
  const navigate = useNavigate();
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showSavedDocsModal, setShowSavedDocsModal] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedFile(file);
      setShowUploadModal(true);
    }
  };

  const confirmUpload = () => {
    setShowUploadModal(false);
    setIsLoading(true);
    // AI 분석 시뮬레이션
    setTimeout(() => {
      setIsLoading(false);
      // 환경 세팅 페이지로 이동
      navigate('/interview/setting');
    }, 2000);
  };

  const handleSavedDocuments = () => {
    // 저장된 자소서가 있는지 확인
    const hasSavedDocs = false; // 임시

    if (hasSavedDocs) {
      // 있으면 자소서 선택 모달
      setShowSavedDocsModal(true);
    } else {
      // 없으면 안내 메시지
      alert('저장된 자소서가 없습니다.');
    }
  };

  const handleStartWithoutDoc = () => {
    navigate('/interview/question-selection');
  };

  return (
    <Layout isLoggedIn={true} userName="김똑쓰">
      <Container>
        <DecorativeCharacter>
          <img src={iconInterview} alt="Character" />
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
              <LoadingIcon>
                <img src={iconInterview} alt="Interview Icon" />
              </LoadingIcon>
              <ModalTitle>포트폴리오를 분석해 질문을 생성 중이에요!</ModalTitle>
            </ModalContent>
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

const CardWrapper = styled.div.attrs({ className: 'card-wrapper' })`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing['3xl']};
  max-width: 1200px;
  width: 100%;
  z-index: 2;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.div.attrs({ className: 'interview-option-card' })`
  background-color: white;
  border-radius: ${({ theme }) => theme.borderRadius['2xl']};
  padding: ${({ theme }) => theme.spacing['3xl']};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const CardTitle = styled.h2.attrs({ className: 'card-title' })`
  font-size: ${({ theme }) => theme.fonts.size.xl};
  font-weight: ${({ theme }) => theme.fonts.weight.bold};
  color: ${({ theme }) => theme.colors.text.dark};
  text-align: center;
`;

const CardSubtitle = styled.h3.attrs({ className: 'card-subtitle' })`
  font-size: ${({ theme }) => theme.fonts.size['2xl']};
  font-weight: ${({ theme }) => theme.fonts.weight.bold};
  color: ${({ theme }) => theme.colors.text.dark};
  text-align: center;
  line-height: 1.4;
`;

const Description = styled.p.attrs({ className: 'description' })`
  font-size: ${({ theme }) => theme.fonts.size.sm};
  color: ${({ theme }) => theme.colors.gray[600]};
  text-align: center;
  line-height: 1.6;
  margin-top: ${({ theme }) => theme.spacing.md};
`;

const DescriptionSmall = styled.p.attrs({ className: 'description-small' })`
  font-size: ${({ theme }) => theme.fonts.size.sm};
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
    padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing['2xl']};
    border-radius: ${({ theme }) => theme.borderRadius.full};
    text-align: center;
    cursor: pointer;
    font-weight: ${({ theme }) => theme.fonts.weight.semibold};
    font-size: ${({ theme }) => theme.fonts.size.base};
    transition: all ${({ theme }) => theme.transitions.fast};
    min-width: 250px;

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
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing['2xl']};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  min-width: 250px;

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
    width: 90px;
    height: 90px;
    object-fit: contain;
  }
`;

const StartButton = styled(Button).attrs({ className: 'start-button' })`
  background-color: #9B8FF5;
  width: 100%;
  max-width: 300px;
  margin-top: ${({ theme }) => theme.spacing.xl};
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing['2xl']};
  border-radius: ${({ theme }) => theme.borderRadius.full};

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
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  padding: ${({ theme }) => theme.spacing['3xl']};
  max-width: 500px;
  width: 90%;
  text-align: center;
  box-shadow: ${({ theme }) => theme.shadows.xl};
`;

const ModalIcon = styled.div.attrs({ className: 'modal-icon' })`
  font-size: ${({ theme }) => theme.fonts.size['5xl']};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const LoadingIcon = styled.div.attrs({ className: 'loading-icon' })`
  font-size: ${({ theme }) => theme.fonts.size['5xl']};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  animation: bounce 1s infinite;

  img {
    width: 120px;
    height: 120px;
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
  font-size: ${({ theme }) => theme.fonts.size.xl};
  font-weight: ${({ theme }) => theme.fonts.weight.bold};
  color: ${({ theme }) => theme.colors.text.dark};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const ModalText = styled.p.attrs({ className: 'modal-text' })`
  font-size: ${({ theme }) => theme.fonts.size.base};
  color: ${({ theme }) => theme.colors.gray[600]};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const ModalButtons = styled.div.attrs({ className: 'modal-buttons' })`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const ModalButton = styled(Button).attrs({ className: 'modal-button' })`
  width: 100%;
`;

export default InterviewPrepare;
