import React, { useState, useRef, useEffect } from "react";
import styled from 'styled-components';
import Layout from '../components/common/Layout';
import { FiPlus, FiX } from 'react-icons/fi';
import twoLittleStarsIcon from '../assets/icons/two little Star.png';
import moonWithCharacter from '../images/moon with.png';
import pozzakCharacter from '../assets/icons/뽀짝.png';
import { useNavigate } from "react-router-dom";

const MyDocuments = () => {
  const DOCUMENTS_STORAGE_KEY = 'ddock_my_documents';
  const navigate = useNavigate();

  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [docToDelete, setDocToDelete] = useState(null);
  const [documents, setDocuments] = useState(() => {
    try {
      const savedDocs = localStorage.getItem(DOCUMENTS_STORAGE_KEY);
      return savedDocs ? JSON.parse(savedDocs) : [];
    } catch (error) {
      console.error("Failed to parse documents from localStorage", error);
      return [];
    }
  });
  const fileInputRef = useRef(null);

  // documents 상태가 변경될 때마다 localStorage에 저장
  useEffect(() => {
    try {
      localStorage.setItem(DOCUMENTS_STORAGE_KEY, JSON.stringify(documents));
    } catch (error) {
      console.error("Failed to save documents to localStorage", error);
    }
  }, [documents]);

  // 컴포넌트가 언마운트될 때 Object URL을 정리하여 메모리 누수를 방지합니다.
  useEffect(() => {
    return () => {
      documents.forEach(doc => {
        if (doc.fileUrl) URL.revokeObjectURL(doc.fileUrl);
      });
    };
  }, [documents]);

  const handleUploadClick = () => {
    // 무료 사용자는 1개만 업로드 가능하다고 가정
    if (documents.length >= 1) {
      setShowPremiumModal(true);
    } else {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedFile(file);
      setShowUploadModal(true);
    }
  };

  const confirmUpload = () => {
    setShowUploadModal(false);

    const newDocument = {
      id: Date.now(),
      name: uploadedFile.name,
      uploadDate: new Date().toLocaleDateString('ko-KR'),
      fileUrl: URL.createObjectURL(uploadedFile), // 파일에 대한 임시 URL 생성
    };
    setDocuments(prevDocs => [...prevDocs, newDocument]);

    // 업로드 후 상태 초기화
    setUploadedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = null;
  };

  const handleDocumentClick = (e, doc) => { 
    e.stopPropagation();
    if (!doc.fileUrl) return;

    // 모든 파일 타입에 대해 다운로드를 실행합니다.
    const link = document.createElement('a');
    link.href = doc.fileUrl;
    link.download = doc.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const cancelUpload = () => {
    setShowUploadModal(false);
    setUploadedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = null;
  }

  const handleDeleteClick = (e, id) => {
    e.stopPropagation();
    setDocToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (docToDelete) {
      setDocuments(documents.filter(doc => doc.id !== docToDelete));
    }
    setShowDeleteModal(false);
    setDocToDelete(null);
  };

  const handleReselectFile = () => {
    setShowUploadModal(false);
    // 파일 입력(input)을 프로그래매틱하게 클릭하여 파일 선택 창을 다시 엽니다.
    if (fileInputRef.current) {
      fileInputRef.current.value = null; // 동일한 파일을 다시 선택할 수 있도록 값을 초기화합니다.
      fileInputRef.current.click();
    }
  };

  const goToSubscription = () => {
    setShowPremiumModal(false);
    navigate('/subscription');
  };

  return ( 
    <Layout isLoggedIn={true} userName="김똑쓰">
      <PageContainer>
        <TitleWrapper>
          <Title>자소서 보관함</Title>
          <StarIcon src={twoLittleStarsIcon} alt="Star decoration" />
        </TitleWrapper>
        
        <ContentContainer>
          <UploadBox onClick={handleUploadClick}>
            <UploadButton aria-label="새 자소서 파일 업로드">
              <FiPlus size={48} />
            </UploadButton>
            <UploadLabel>새 자소서 파일 업로드</UploadLabel>
            <input
              ref={fileInputRef}
              id="file-upload"
              type="file"
              accept=".pdf,.docx,.doc"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
            <UploadInfo>(PDF, DOCX 등, 최대 5MB)</UploadInfo>
          </UploadBox>

          <DocumentList>
            {documents.map(doc => (
              <DocumentCard key={doc.id}>
                <DeleteButton onClick={(e) => handleDeleteClick(e, doc.id)}>
                  <FiX size={16} />
                </DeleteButton>
                <DocInfo onClick={(e) => handleDocumentClick(e, doc)}>
                  <DocName>{doc.name}</DocName>
                  <DocDate>업로드 날짜: {doc.uploadDate}</DocDate>
                </DocInfo>
              </DocumentCard>
            ))}
          </DocumentList>

        </ContentContainer>

        <FloatingCharacter src={moonWithCharacter} alt="Character on a moon" />

        {showUploadModal && (
          <Modal>
            <ModalOverlay onClick={cancelUpload} />
            <ModalContent>
              <ModalIcon>📄</ModalIcon>
              <ModalTitle>이 파일로 업로드할까요?</ModalTitle>
              <ModalText>
                '{uploadedFile?.name}'
              </ModalText>
              <ModalButtons>
                <ModalButton onClick={confirmUpload}>
                  파일 업로드
                </ModalButton>
                <ModalButton $variant="outline" onClick={handleReselectFile}>
                  다시 선택하기
                </ModalButton>
              </ModalButtons>
            </ModalContent>
          </Modal>
        )}

        {showDeleteModal && (
          <Modal>
            <ModalOverlay onClick={() => setShowDeleteModal(false)} />
            <DeleteModalContent>
              <DeleteModalTitle>정말로 보관함에서 삭제하실 건가요?</DeleteModalTitle>
              <DeleteModalSubtitle>삭제시 보관함에서 사라져요 !</DeleteModalSubtitle>
              <DeleteModalCharacter src={pozzakCharacter} alt="캐릭터" />
              <ModalButtons>
                <ModalButton onClick={confirmDelete}>
                  삭제
                </ModalButton>
                <ModalButton $variant="outline" onClick={() => setShowDeleteModal(false)}>
                  취소
                </ModalButton>
              </ModalButtons>
            </DeleteModalContent>
          </Modal>
        )}

        {showPremiumModal && (
          <Modal>
            <ModalOverlay onClick={() => setShowPremiumModal(false)} />
            <PremiumModalContent>
              <PremiumCloseButton onClick={() => setShowPremiumModal(false)}>
                <FiX size={24} />
              </PremiumCloseButton>
              <PremiumModalTitle>더 많은 합격 자소서를 관리해보세요!</PremiumModalTitle>
              <PremiumModalSubtitle>
                프리미엄 플랜으로 업그레이드하고,
                <br />
                여러 개의 자소서를 무제한으로 보관하고 관리해보세요!
              </PremiumModalSubtitle>
              <PremiumModalCharacter src={pozzakCharacter} alt="뽀짝 캐릭터" />
              <PremiumButton onClick={goToSubscription}>
                업그레이드 하러가기
              </PremiumButton>
            </PremiumModalContent>
          </Modal>
        )}
      </PageContainer>
    </Layout>
  );
};

export default MyDocuments;

// Styled components
const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  min-height: calc(100vh - 80px); /* Adjust based on header height */
  padding: ${({ theme }) => theme.spacing['4xl']} ${({ theme }) => theme.spacing.xl};
  margin: 0 auto;
  max-width: 1440px;
  position: relative;
`;

const TitleWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  margin-left: 5%;
`;

const ContentContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xl};
  align-items: flex-start;
  width: 100%;
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.fonts.size['4xl']};
  font-weight: ${({ theme }) => theme.fonts.weight.bold};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const StarIcon = styled.img`
  width: 60px;
  height: 60px;
  position: relative;
  bottom: 8px;
`;

const UploadBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.sm};
  background-color: #7c6fee; /* 보라색 */
  padding: ${({ theme }) => theme.spacing['3xl']} ${({ theme }) => theme.spacing['2xl']};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  margin-top: ${({ theme }) => theme.spacing.lg};
  margin-left: 5%;
  border: 2px dashed white; /* 흰색 점선 테두리 추가 */
  min-height: 180px;
  width: 400px;
  max-width: 90%;
  cursor: pointer;
`;

const UploadButton = styled.label`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  color: white;
  cursor: pointer;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const UploadLabel = styled.span`
  color: white;
  font-size: ${({ theme }) => theme.fonts.size['2xl']};
  font-weight: ${({ theme }) => theme.fonts.weight.semibold};
`;

const UploadInfo = styled.span`
  color: white;
  font-size: ${({ theme }) => theme.fonts.size.sm};
`;

const DocumentList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
  margin-top: ${({ theme }) => theme.spacing.lg};
  flex: 1;
`;

const DocumentCard = styled.div`
  position: relative;
  background-color: #424243;
  border: 2px solid #7c6fee;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing.xl};
  width: 400px;
  min-height: 250px;
  display: flex; /* 내부 컨텐츠 정렬을 위해 추가 */
  align-items: center; /* 내부 컨텐츠 수직 중앙 정렬 */
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.md};
  }
`;

const DocInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  cursor: pointer;
`;

const DocName = styled.p`
  color: white;
  font-size: ${({ theme }) => theme.fonts.size['2xl']}; /* 폰트 크기 증가 */
  font-weight: ${({ theme }) => theme.fonts.weight.semibold};
  word-break: break-all;
`;

const DocDate = styled.p`
  color: white;
  font-size: ${({ theme }) => theme.fonts.size.sm};
`;

const DeleteButton = styled.button`
  position: absolute;
  top: 8px;
  right: 8px;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  &:hover {
    background: rgba(255, 255, 255, 0.4);
  }
`;

const FloatingCharacter = styled.img`
  position: absolute;
  right: 20px;
  bottom: 20px;
  width: 320px;
  height: 320px;
  object-fit: contain;
`;

// Modal Styles
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
  background-color: white;
  border-radius: ${({ theme }) => theme.borderRadius['2xl']};
  padding: ${({ theme }) => theme.spacing['3xl']};
  max-width: 500px;
  width: 90%;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: ${({ theme }) => theme.spacing.md};
  box-shadow: ${({ theme }) => theme.shadows.xl};
`;

const ModalIcon = styled.div`
  font-size: ${({ theme }) => theme.fonts.size['4xl']};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const ModalTitle = styled.h3`
  font-size: ${({ theme }) => theme.fonts.size['2xl']};
  font-weight: ${({ theme }) => theme.fonts.weight.bold};
  color: ${({ theme }) => theme.colors.text.dark};
`;

const ModalText = styled.p`
  font-size: ${({ theme }) => theme.fonts.size.base};
  color: ${({ theme }) => theme.colors.gray[600]};
  line-height: 1.6;
  margin-top: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  word-break: break-all;
`;

const ModalButtons = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  width: 100%;
  max-width: 320px;
`;

const ModalButton = styled.button`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  font-size: ${({ theme }) => theme.fonts.size.lg};
  font-weight: ${({ theme }) => theme.fonts.weight.semibold};
  cursor: pointer;
  border: 1px solid ${({ theme, $variant }) => $variant === 'outline' ? theme.colors.primary : 'transparent'};
  background-color: ${({ theme, $variant }) => $variant === 'outline' ? 'white' : theme.colors.primary};
  color: ${({ theme, $variant }) => $variant === 'outline' ? theme.colors.primary : 'white'};
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    opacity: 0.9;
  }
`;

const DeleteModalContent = styled(ModalContent)`
  max-width: 450px;
  padding: ${({ theme }) => theme.spacing['2xl']};
  background: linear-gradient(#FAFCFF, #B4CDF6);
`;

const DeleteModalTitle = styled.h3`
  font-size: ${({ theme }) => theme.fonts.size['xl']};
  font-weight: ${({ theme }) => theme.fonts.weight.bold};
  color: #7E5ECE;
  margin-top: ${({ theme }) => theme.spacing.lg};
`;

const DeleteModalSubtitle = styled.p`
  font-size: ${({ theme }) => theme.fonts.size.sm};
  color: #8B8B8B;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const DeleteModalCharacter = styled.img`
  width: 120px;
  height: 120px;
  object-fit: contain;
  margin: ${({ theme }) => theme.spacing.md} 0;
`;

// Premium Modal Styles
const PremiumModalContent = styled(ModalContent)`
  background: linear-gradient(180deg, #FAFCFF 0%, #B4CDF6 100%);
  max-width: 500px;
  padding: ${({ theme }) => theme.spacing['2xl']};
  gap: ${({ theme }) => theme.spacing.sm};
`;

const PremiumCloseButton = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  background: none;
  border: none;
  color: #8B8B8B;
  cursor: pointer;
`;

const PremiumModalTitle = styled.h3`
  font-size: ${({ theme }) => theme.fonts.size['xl']};
  font-weight: ${({ theme }) => theme.fonts.weight.bold};
  color: #7E5ECE;
  margin-top: ${({ theme }) => theme.spacing.lg};
`;

const PremiumModalSubtitle = styled.p`
  font-size: ${({ theme }) => theme.fonts.size.base};
  color: #8B8B8B;
  line-height: 1.6;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const PremiumModalCharacter = styled.img`
  width: 150px;
  height: 150px;
  object-fit: contain;
  margin: ${({ theme }) => theme.spacing.sm} 0;
`;

const PremiumButton = styled(ModalButton)`
  background-color: #8973FF;
  color: white;
  border: none;
  margin-top: ${({ theme }) => theme.spacing.sm};

  &:hover {
    background-color: #7A62F8;
  }
`;
