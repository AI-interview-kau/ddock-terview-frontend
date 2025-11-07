import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FiHeart, FiX, FiPlus, FiTrash2 } from 'react-icons/fi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Layout from '../components/common/Layout';
import Button from '../components/common/Button';
import {
  getQuestionList,
  createQuestion,
  deleteQuestion,
  saveQuestion,
  unsaveQuestion,
  getSavedQuestions,
  getQuestionNote,
  updateQuestionNote
} from '../api/interviewService';

const QuestionBank = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('personality');
  const [questions, setQuestions] = useState({
    personality: [],
    technical: [],
    custom: [],
    saved: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [savedQuestionIds, setSavedQuestionIds] = useState(new Set());
  const [showMemoModal, setShowMemoModal] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [selectedForInterview, setSelectedForInterview] = useState([]);
  const [memo, setMemo] = useState('');
  const [newQuestionText, setNewQuestionText] = useState('');
  const [isCreatingQuestion, setIsCreatingQuestion] = useState(false);
  const [isSavingMemo, setIsSavingMemo] = useState(false);

  // 질문 목록 불러오기
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setIsLoading(true);

        // 1. 전체 질문 목록 가져오기
        const data = await getQuestionList();
        console.log('Questions loaded:', data);

        // 각 카테고리의 질문들
        const personalityItems = data.categories?.PERSONALITY?.items || [];
        const techItems = data.categories?.TECH?.items || [];
        const customItems = data.categories?.MINE?.items || [];

        // 2. 찜한 질문 목록 별도로 가져오기
        let savedQuestionsList = [];
        let savedIds = new Set();
        let savedContents = new Set(); // 질문 내용으로 매칭

        try {
          const savedData = await getSavedQuestions();
          console.log('Saved questions loaded:', savedData);

          // API 응답: { "contents": ["질문1", "질문2", ...] }
          const savedContentArray = savedData?.contents || [];

          // 찜한 질문 내용 Set 생성
          savedContents = new Set(savedContentArray);

          // 전체 질문 목록에서 찜한 질문들 찾기 (내용으로 매칭)
          const allQuestions = [...personalityItems, ...techItems, ...customItems];

          savedQuestionsList = allQuestions.filter(q =>
            savedContents.has(q.content)
          );

          // 찜한 질문 ID Set 생성
          savedIds = new Set(
            savedQuestionsList.map(q => q.bqId || q.bq_id).filter(id => id != null)
          );

          console.log('Saved contents:', Array.from(savedContents));
          console.log('Matched saved questions:', savedQuestionsList);

        } catch (error) {
          console.error('Failed to load saved questions:', error);
        }

        setSavedQuestionIds(savedIds);

        setQuestions({
          personality: personalityItems,
          technical: techItems,
          custom: customItems,
          saved: savedQuestionsList,
        });

        console.log('Saved question IDs:', Array.from(savedIds));
      } catch (error) {
        console.error('Failed to load questions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  // 질문 찜하기/해제
  const toggleSaveQuestion = async (question) => {
    console.log('🔍 [DEBUG] Toggle save question clicked');
    console.log('📋 Question object:', question);
    console.log('🆔 Question bq_id:', question.bq_id);
    console.log('📝 Question content:', question.content);

    const questionId = question.bq_id;

    if (!questionId) {
      console.error('❌ [ERROR] Question ID (bq_id) is missing!');
      toast.error('이 질문은 ID가 없어서 찜할 수 없습니다. 백엔드 데이터를 확인해주세요.');
      return;
    }

    const isSaved = savedQuestionIds.has(questionId);
    console.log('💾 Is saved:', isSaved);

    try {
      if (isSaved) {
        // 찜 해제
        await unsaveQuestion({ bqId: questionId });
        console.log('Question unsaved:', questionId);

        setSavedQuestionIds(prev => {
          const newSet = new Set(prev);
          newSet.delete(questionId);
          return newSet;
        });

        // saved 카테고리에서 제거
        setQuestions(prev => ({
          ...prev,
          saved: prev.saved.filter(q => q.bq_id !== questionId),
        }));

        toast.info('질문이 찜 목록에서 제거되었습니다.');
      } else {
        // 찜 추가
        await saveQuestion({ bqId: questionId });
        console.log('Question saved:', questionId);

        setSavedQuestionIds(prev => new Set([...prev, questionId]));

        // saved 카테고리에 추가
        setQuestions(prev => ({
          ...prev,
          saved: [...prev.saved, question],
        }));

        toast.success('질문이 찜 목록에 추가되었습니다!');
      }
    } catch (error) {
      console.error('Failed to toggle save question:', error);
      if (error.response?.status === 409) {
        toast.warning('이미 찜한 질문입니다.');
      } else if (error.response?.status === 404) {
        toast.error('찜 목록에서 해당 질문을 찾을 수 없습니다.');
      } else {
        toast.error(`질문 ${isSaved ? '해제' : '찜하기'}에 실패했습니다.`);
      }
    }
  };

  // 질문 클릭 시 메모 불러오기
  const handleQuestionClick = async (question) => {
    setSelectedQuestion(question);
    setShowMemoModal(true);
    setMemo('');

    // 질문 ID 생성 (예: "B:12")
    const questionId = `B:${question.bq_id}`;

    try {
      const noteData = await getQuestionNote(questionId);
      if (noteData && noteData.content) {
        setMemo(noteData.content);
      }
    } catch (error) {
      console.error('Failed to load question note:', error);
      // 메모가 없는 경우는 에러로 처리하지 않음
    }
  };

  // 메모 저장
  const handleSaveMemo = async () => {
    if (!selectedQuestion || !selectedQuestion.bq_id) {
      toast.error('질문 정보를 찾을 수 없습니다.');
      return;
    }

    const questionId = `B:${selectedQuestion.bq_id}`;
    setIsSavingMemo(true);

    try {
      await updateQuestionNote(questionId, memo);
      console.log('Memo saved for question:', questionId);
      toast.success('메모가 저장되었습니다!');
      setShowMemoModal(false);
    } catch (error) {
      console.error('Failed to save memo:', error);
      toast.error('메모 저장에 실패했습니다.');
    } finally {
      setIsSavingMemo(false);
    }
  };

  // 질문 생성
  const handleCreateQuestion = async () => {
    if (!newQuestionText.trim()) {
      toast.warning('질문 내용을 입력해주세요.');
      return;
    }

    setIsCreatingQuestion(true);
    try {
      const newQuestion = await createQuestion(newQuestionText.trim());
      console.log('Question created:', newQuestion);

      setQuestions(prev => ({
        ...prev,
        custom: [...prev.custom, newQuestion],
      }));

      setNewQuestionText('');
      toast.success('질문이 성공적으로 생성되었습니다!');
    } catch (error) {
      console.error('Failed to create question:', error);
      toast.error('질문 생성에 실패했습니다.');
    } finally {
      setIsCreatingQuestion(false);
    }
  };

  // 질문 삭제
  const handleDeleteQuestion = async (bqId, questionContent) => {
    const confirmed = window.confirm(`"${questionContent}" 질문을 삭제하시겠습니까?`);
    if (!confirmed) return;

    try {
      await deleteQuestion(bqId);
      console.log('Question deleted:', bqId);

      setQuestions(prev => ({
        ...prev,
        custom: prev.custom.filter(q => q.bq_id !== bqId),
      }));

      toast.success('질문이 성공적으로 삭제되었습니다.');
    } catch (error) {
      console.error('Failed to delete question:', error);
      toast.error('질문 삭제에 실패했습니다.');
    }
  };

  // 면접용 질문 선택/해제
  const toggleInterviewSelection = (question) => {
    const questionContent = question.content || question;
    if (selectedForInterview.includes(questionContent)) {
      setSelectedForInterview(selectedForInterview.filter((q) => q !== questionContent));
    } else {
      setSelectedForInterview([...selectedForInterview, questionContent]);
    }
  };

  // 면접 시작
  const handleStartInterview = () => {
    if (selectedForInterview.length === 0) {
      toast.warning('최소 1개 이상의 질문을 선택해주세요.');
      return;
    }

    // InterviewProgress로 질문들을 전달
    navigate('/interview/progress', {
      state: { selectedQuestions: selectedForInterview }
    });
  };

  const getCategoryQuestions = () => {
    return questions[activeCategory] || [];
  };

  return (
    <Layout>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
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
                ? '찜한 질문들을 모아볼 수 있어요. 이 질문들로 면접 연습을 해보세요!'
                : '자주 보고 싶은 질문은 하트를 눌러 "찜한 질문"에 추가해 보세요!'}
            </ContentDescription>
          </ContentHeader>

          {/* 내가 만든 질문 카테고리일 때만 질문 생성 UI 표시 */}
          {activeCategory === 'custom' && (
            <CreateQuestionSection>
              <QuestionInput
                type="text"
                placeholder="새로운 질문을 입력하세요 (예: 당신의 강점은 무엇인가요?)"
                value={newQuestionText}
                onChange={(e) => setNewQuestionText(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleCreateQuestion();
                  }
                }}
                disabled={isCreatingQuestion}
              />
              <CreateButton
                onClick={handleCreateQuestion}
                disabled={isCreatingQuestion || !newQuestionText.trim()}
              >
                <FiPlus /> {isCreatingQuestion ? '생성 중...' : '질문 추가'}
              </CreateButton>
            </CreateQuestionSection>
          )}

          {isLoading ? (
            <EmptyState>질문을 불러오는 중...</EmptyState>
          ) : (
            <>
              <QuestionGrid>
                {getCategoryQuestions().map((question) => (
                  <QuestionCard key={question.bq_id || question.content}>
                    <HeartButton
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSaveQuestion(question);
                      }}
                      $saved={savedQuestionIds.has(question.bq_id)}
                    >
                      <FiHeart />
                    </HeartButton>
                    <QuestionText onClick={() => handleQuestionClick(question)}>
                      {question.content || question}
                    </QuestionText>

                    {/* 내가 만든 질문일 때만 삭제 버튼 표시 */}
                    {activeCategory === 'custom' && question.bq_id && (
                      <DeleteButton
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteQuestion(question.bq_id, question.content);
                        }}
                        title="질문 삭제"
                      >
                        <FiTrash2 />
                      </DeleteButton>
                    )}
                  </QuestionCard>
                ))}
              </QuestionGrid>

              {getCategoryQuestions().length === 0 && (
                <EmptyState>
                  아직 {activeCategory === 'saved' ? '찜한' : activeCategory === 'custom' ? '만든' : ''} 질문이 없습니다.
                </EmptyState>
              )}
            </>
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

              <QuestionBox>{selectedQuestion?.content || selectedQuestion}</QuestionBox>

              <MemoTextarea
                placeholder="본인의 의견을 자유롭게 작성해보세요 : )"
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
                disabled={isSavingMemo}
              />

              <SaveButton
                onClick={handleSaveMemo}
                disabled={isSavingMemo}
              >
                {isSavingMemo ? '저장 중...' : '저장하기'}
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
  cursor: pointer;
  transition: color ${({ theme }) => theme.transitions.fast};

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const Checkbox = styled.input`
  width: 20px;
  height: 20px;
  cursor: pointer;
  accent-color: #9B8FF5;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing['4xl']};
  color: white;
  font-size: ${({ theme }) => theme.fonts.size.lg};
`;

const InterviewStartSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.xl};
  margin-top: ${({ theme }) => theme.spacing.xl};
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  position: sticky;
  bottom: 0;
  background-color: #3A3154;
`;

const SelectedCountText = styled.div`
  font-size: ${({ theme }) => theme.fonts.size.lg};
  font-weight: ${({ theme }) => theme.fonts.weight.semibold};
  color: white;
`;

const StartInterviewButton = styled.button`
  background-color: #9B8FF5;
  color: white;
  padding: ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing['2xl']};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: ${({ theme }) => theme.fonts.size.base};
  font-weight: ${({ theme }) => theme.fonts.weight.semibold};
  border: none;
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  min-width: 200px;

  &:hover {
    background-color: #8B7FE5;
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.md};
  }
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

  &:hover:not(:disabled) {
    background-color: #333;
  }

  &:disabled {
    background-color: ${({ theme }) => theme.colors.gray[400]};
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

// Create Question Section styles
const CreateQuestionSection = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  padding: ${({ theme }) => theme.spacing.lg};
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: ${({ theme }) => theme.borderRadius.lg};
`;

const QuestionInput = styled.input`
  flex: 1;
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  background-color: white;
  color: ${({ theme }) => theme.colors.text.dark};
  font-size: ${({ theme }) => theme.fonts.size.base};
  outline: none;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:focus {
    border-color: #9B8FF5;
    box-shadow: 0 0 0 3px rgba(155, 143, 245, 0.1);
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.gray[400]};
  }

  &:disabled {
    background-color: ${({ theme }) => theme.colors.gray[100]};
    cursor: not-allowed;
  }
`;

const CreateButton = styled.button`
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.xl};
  background-color: #9B8FF5;
  color: white;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  font-size: ${({ theme }) => theme.fonts.size.base};
  font-weight: ${({ theme }) => theme.fonts.weight.semibold};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};

  &:hover:not(:disabled) {
    background-color: #8B7FE5;
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.md};
  }

  &:disabled {
    background-color: ${({ theme }) => theme.colors.gray[400]};
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

const DeleteButton = styled.button`
  background-color: transparent;
  border: none;
  color: ${({ theme }) => theme.colors.gray[400]};
  font-size: ${({ theme }) => theme.fonts.size.lg};
  cursor: pointer;
  padding: ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  transition: all ${({ theme }) => theme.transitions.fast};
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;

  &:hover {
    background-color: #ef444410;
    color: #ef4444;
    transform: scale(1.1);
  }

  &:active {
    transform: scale(0.95);
  }
`;

export default QuestionBank;
