import React, { useState } from 'react';
import styled from 'styled-components';
import { FiHeart, FiX } from 'react-icons/fi';
import Layout from '../components/common/Layout';
import Button from '../components/common/Button';

const QUESTIONS = {
  personality: [
    '자신의 강점과 약점은 무엇인가요?',
    '이전 직장에서의 갈등 상황을 어떻게 해결했나요?',
    '팀워크를 중요시하는 이유는 무엇인가요?',
    '어려운 상황에서 어떻게 대처하나요?',
    '자신의 가치관에 대해 설명해 주세요.',
    '리더십 경험이 있다면, 그 경험에 대해 이야기해 주세요.',
  ],
  technical: [
    '자신의 기술 스택에 대해 설명해 주세요.',
    '프로젝트하면서 가장 힘든 경험이 무엇이었나요?',
    '특정 언어의 장단점은 무엇인가요?',
    '객체 지향 프로그래밍(OOP)의 기본 개념을 설명해 주세요.',
    'RESTful API란 무엇인가요?',
    '데이터베이스를 설계할 때 고려해야 할 사항은 무엇인가요?',
  ],
  custom: [
    '본인이 가지고 있는 강점을 설명해주세요.',
    '보안 취약점에 대해 알고 있는 것과 그 대응 방법은 무엇인가요?',
    '코드 리뷰의 중요성에 대해 이야기해 주세요.',
  ],
};

const QuestionBank = () => {
  const [activeCategory, setActiveCategory] = useState('personality');
  const [savedQuestions, setSavedQuestions] = useState([]);
  const [showMemoModal, setShowMemoModal] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState('');
  const [memo, setMemo] = useState('');

  const toggleSaveQuestion = (question) => {
    if (savedQuestions.includes(question)) {
      setSavedQuestions(savedQuestions.filter((q) => q !== question));
    } else {
      setSavedQuestions([...savedQuestions, question]);
    }
  };

  const handleQuestionClick = (question) => {
    setSelectedQuestion(question);
    setShowMemoModal(true);
  };

  const getCategoryQuestions = () => {
    if (activeCategory === 'saved') {
      return savedQuestions;
    }
    return QUESTIONS[activeCategory] || [];
  };

  return (
    <Layout isLoggedIn={true} userName="김똑쓰">
      <Container>
        <ContentCard>
          {/* 좌측 사이드바 */}
          <Sidebar>
          <SidebarTitle>Category</SidebarTitle>
          <CategorySubtitle>질문 리스트 카테고리</CategorySubtitle>

          <CategoryList>
            <CategoryItem
              $active={activeCategory === 'personality'}
              onClick={() => setActiveCategory('personality')}
            >
              인성 면접
            </CategoryItem>
            <CategoryItem
              $active={activeCategory === 'technical'}
              onClick={() => setActiveCategory('technical')}
            >
              기술 면접
            </CategoryItem>
            <CategoryItem
              $active={activeCategory === 'custom'}
              onClick={() => setActiveCategory('custom')}
            >
              내가 만든 질문
            </CategoryItem>
            <CategoryItem
              $active={activeCategory === 'saved'}
              onClick={() => setActiveCategory('saved')}
            >
              찜한 질문
            </CategoryItem>
          </CategoryList>
        </Sidebar>

        {/* 우측 콘텐츠 */}
        <Content>
          <ContentHeader>
            <ContentTitle>
              {activeCategory === 'personality' && '인성 면접 질문 목록'}
              {activeCategory === 'technical' && '기술 면접 질문 목록'}
              {activeCategory === 'custom' && '내가 만든 질문 목록'}
              {activeCategory === 'saved' && '찜한 질문 모음집'}
            </ContentTitle>
            <ContentDescription>
              {activeCategory === 'saved'
                ? '참고자극 쌓이는 질문만을 나의 함께 기능성도 함께 놓아져요.'
                : '자주 보고 싶은 질문은 하트를 눌러 "찜한 질문"에 추가해 보세요!'}
            </ContentDescription>
          </ContentHeader>

          <QuestionGrid>
            {getCategoryQuestions().map((question, index) => (
              <QuestionCard
                key={index}
                onClick={() => handleQuestionClick(question)}
              >
                <HeartButton
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleSaveQuestion(question);
                  }}
                  $saved={savedQuestions.includes(question)}
                >
                  <FiHeart />
                </HeartButton>
                <QuestionText>{question}</QuestionText>
              </QuestionCard>
            ))}
          </QuestionGrid>

          {getCategoryQuestions().length === 0 && (
            <EmptyState>아직 {activeCategory === 'saved' ? '찜한' : ''} 질문이 없습니다.</EmptyState>
          )}
        </Content>

        {/* 메모장 모달 */}
        {showMemoModal && (
          <Modal>
            <ModalOverlay onClick={() => setShowMemoModal(false)} />
            <ModalContent>
              <ModalHeader>
                <div>
                  <ModalTitle>메모장</ModalTitle>
                  <ModalSubtitle>
                    질문을 보고 떠오르는 생각이나 답변의 핵심 내용을 자유롭게
                    메모하는 공간이에요.
                  </ModalSubtitle>
                </div>
                <CloseButton onClick={() => setShowMemoModal(false)}>
                  <FiX />
                </CloseButton>
              </ModalHeader>

              <QuestionBox>{selectedQuestion}</QuestionBox>

              <MemoTextarea
                placeholder="본인의 의견을 자유롭게 작성해보세요 : )"
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
              />

              <SaveButton onClick={() => setShowMemoModal(false)}>
                저장하기
              </SaveButton>
            </ModalContent>
          </Modal>
        )}
        </ContentCard>
      </Container>
    </Layout>
  );
};

const Container = styled.div`
  min-height: calc(100vh - 80px);
  background-color: #3E3655;
  padding: ${({ theme }) => theme.spacing['3xl']} ${({ theme }) => theme.spacing.xl};
  display: flex;
  justify-content: center;
`;

const ContentCard = styled.div`
  width: 100%;
  max-width: 1400px;
  background-color: #2A2640;
  border-radius: ${({ theme }) => theme.borderRadius['2xl']};
  display: grid;
  grid-template-columns: 280px 1fr;
  overflow: hidden;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
  }
`;

const Sidebar = styled.aside`
  background-color: #1E1B2E;
  padding: ${({ theme }) => theme.spacing['3xl']} ${({ theme }) => theme.spacing.xl};
`;

const SidebarTitle = styled.h2`
  font-size: ${({ theme }) => theme.fonts.size['2xl']};
  font-weight: ${({ theme }) => theme.fonts.weight.bold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const CategorySubtitle = styled.p`
  font-size: ${({ theme }) => theme.fonts.size.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const CategoryList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const CategoryItem = styled.button`
  padding: ${({ theme }) => theme.spacing.lg};
  background-color: ${({ $active }) =>
    $active ? '#4A4160' : 'transparent'};
  color: white;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  font-size: ${({ theme }) => theme.fonts.size.lg};
  font-weight: ${({ theme }) => theme.fonts.weight.semibold};
  text-align: left;
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    background-color: ${({ $active }) =>
      $active ? '#4A4160' : 'rgba(255, 255, 255, 0.1)'};
  }
`;

const Content = styled.main`
  padding: ${({ theme }) => theme.spacing['3xl']} ${({ theme }) => theme.spacing.xl};
  background-color: #3A3154;
`;

const ContentHeader = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const ContentTitle = styled.h1`
  font-size: ${({ theme }) => theme.fonts.size['3xl']};
  font-weight: ${({ theme }) => theme.fonts.weight.bold};
  color: white;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const ContentDescription = styled.p`
  font-size: ${({ theme }) => theme.fonts.size.base};
  color: white;
`;

const QuestionGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const QuestionCard = styled.div`
  background-color: white;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing.xl};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    transform: translateX(4px);
    box-shadow: ${({ theme }) => theme.shadows.md};
  }
`;

const HeartButton = styled.button`
  color: ${({ $saved, theme }) =>
    $saved ? theme.colors.error : theme.colors.gray[400]};
  font-size: ${({ theme }) => theme.fonts.size.xl};
  transition: all ${({ theme }) => theme.transitions.fast};

  svg {
    fill: ${({ $saved }) => ($saved ? 'currentColor' : 'none')};
  }

  &:hover {
    color: ${({ theme }) => theme.colors.error};
    transform: scale(1.1);
  }
`;

const QuestionText = styled.p`
  font-size: ${({ theme }) => theme.fonts.size.base};
  color: ${({ theme }) => theme.colors.text.dark};
  flex: 1;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing['4xl']};
  color: white;
  font-size: ${({ theme }) => theme.fonts.size.lg};
`;

// Modal
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
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  padding: ${({ theme }) => theme.spacing['3xl']};
  max-width: 700px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: ${({ theme }) => theme.shadows.xl};
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const ModalTitle = styled.h3`
  font-size: ${({ theme }) => theme.fonts.size.xl};
  font-weight: ${({ theme }) => theme.fonts.weight.bold};
  color: ${({ theme }) => theme.colors.text.dark};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const ModalSubtitle = styled.p`
  font-size: ${({ theme }) => theme.fonts.size.sm};
  color: ${({ theme }) => theme.colors.gray[600]};
`;

const CloseButton = styled.button`
  font-size: ${({ theme }) => theme.fonts.size['2xl']};
  color: ${({ theme }) => theme.colors.gray[600]};
  cursor: pointer;

  &:hover {
    color: ${({ theme }) => theme.colors.gray[800]};
  }
`;

const QuestionBox = styled.div`
  background-color: ${({ theme }) => theme.colors.gray[100]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  font-size: ${({ theme }) => theme.fonts.size.base};
  color: ${({ theme }) => theme.colors.text.dark};
`;

const MemoTextarea = styled.textarea`
  width: 100%;
  min-height: 300px;
  padding: ${({ theme }) => theme.spacing.lg};
  border: 1px solid ${({ theme }) => theme.colors.gray[300]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  font-size: ${({ theme }) => theme.fonts.size.base};
  font-family: inherit;
  resize: vertical;
  margin-bottom: ${({ theme }) => theme.spacing.lg};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const SaveButton = styled(Button)`
  width: 100%;
  background-color: #000;

  &:hover {
    background-color: #333;
  }
`;

export default QuestionBank;
