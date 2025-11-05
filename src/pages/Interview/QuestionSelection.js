import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import Layout from '../../components/common/Layout';
import Button from '../../components/common/Button';
import iconInterview from '../../assets/icons/icon_interview.png';
import ddocks2 from '../../assets/icons/ddocks2.png';
import { getQuestionList, submitSelectedQuestions, createQuestion, deleteQuestion, saveQuestion, unsaveQuestion } from '../../api/interviewService';

const QuestionSelection = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('PERSONALITY');
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [assignmentStage, setAssignmentStage] = useState(0); // 0: 없음, 1: 면접관 배정 중, 2: 준비 완료
  const [questions, setQuestions] = useState({
    PERSONALITY: [],
    TECH: [],
    MINE: [],
    SAVED: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [newQuestionText, setNewQuestionText] = useState('');
  const [isCreatingQuestion, setIsCreatingQuestion] = useState(false);
  const [savedQuestionIds, setSavedQuestionIds] = useState(new Set()); // 찜한 질문 ID 집합

  // 질문 목록 불러오기
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const data = await getQuestionList();
        console.log('Questions loaded:', data);

        // API 응답을 state에 저장
        setQuestions({
          PERSONALITY: data.categories?.PERSONALITY?.items || [],
          TECH: data.categories?.TECH?.items || [],
          MINE: data.categories?.MINE?.items || [],
          SAVED: [], // 찜한 질문은 별도 관리
        });
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to load questions:', error);
        // 에러 발생 시 더미 데이터 사용
        setQuestions({
          PERSONALITY: [
            { bq_id: 1, content: '자신의 강점과 약점은 무엇인가요?' },
            { bq_id: 2, content: '이전 직장에서의 갈등 상황을 어떻게 해결했나요?' },
          ],
          TECH: [
            { bq_id: 3, content: '자신의 기술 스택에 대해 설명해 주세요.' },
            { bq_id: 4, content: '프로젝트하면서 가장 힘든 경험이 무엇이었나요?' },
          ],
          MINE: [],
          SAVED: [],
        });
        setIsLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  useEffect(() => {
    // 면접관 배정 중 -> 준비 완료로 전환
    if (assignmentStage === 1) {
      const timer = setTimeout(() => {
        setAssignmentStage(2);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [assignmentStage]);

  const toggleQuestionSelection = (question) => {
    if (selectedQuestions.includes(question)) {
      setSelectedQuestions(selectedQuestions.filter((q) => q !== question));
    } else {
      setSelectedQuestions([...selectedQuestions, question]);
    }
  };

  const handleStartInterview = async () => {
    if (selectedQuestions.length === 0) {
      alert('최소 1개 이상의 질문을 선택해주세요.');
      return;
    }

    try {
      // localStorage에서 현재 세션 정보 가져오기
      const currentSession = localStorage.getItem('currentSession');
      if (!currentSession) {
        alert('면접 세션 정보를 찾을 수 없습니다. 다시 시도해주세요.');
        navigate('/interview');
        return;
      }

      const sessionData = JSON.parse(currentSession);
      const sessionId = sessionData.session_id || sessionData.sessionId;

      // 선택한 질문들을 서버에 전송
      const response = await submitSelectedQuestions(sessionId, selectedQuestions);
      console.log('Questions submitted successfully:', response);

      // 서버 응답을 localStorage에 업데이트
      localStorage.setItem('currentSession', JSON.stringify(response));

      // 면접관 배정 단계로 전환
      setAssignmentStage(1);
    } catch (error) {
      console.error('Failed to submit questions:', error);
      alert('질문 등록에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const handleStartInterviewProgress = () => {
    // 선택한 질문들을 camera-test로 전달
    navigate('/interview/camera-test', {
      state: { selectedQuestions }
    });
  };

  const handleCloseAssignment = () => {
    setAssignmentStage(0);
  };

  const handleCreateQuestion = async () => {
    if (!newQuestionText.trim()) {
      alert('질문 내용을 입력해주세요.');
      return;
    }

    setIsCreatingQuestion(true);
    try {
      const newQuestion = await createQuestion(newQuestionText.trim());
      console.log('Question created:', newQuestion);

      // 생성된 질문을 MINE 카테고리에 추가
      setQuestions(prev => ({
        ...prev,
        MINE: [...prev.MINE, newQuestion]
      }));

      // 입력 필드 초기화
      setNewQuestionText('');
      alert('질문이 성공적으로 생성되었습니다!');
    } catch (error) {
      console.error('Failed to create question:', error);
      alert('질문 생성에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsCreatingQuestion(false);
    }
  };

  const handleDeleteQuestion = async (bqId, questionContent) => {
    const confirmed = window.confirm(`"${questionContent}" 질문을 삭제하시겠습니까?`);

    if (!confirmed) return;

    try {
      await deleteQuestion(bqId);
      console.log('Question deleted:', bqId);

      // MINE 카테고리에서 삭제된 질문 제거
      setQuestions(prev => ({
        ...prev,
        MINE: prev.MINE.filter(q => q.bq_id !== bqId)
      }));

      // 선택된 질문 목록에서도 제거
      setSelectedQuestions(prev => prev.filter(q => q !== questionContent));

      alert('질문이 성공적으로 삭제되었습니다.');
    } catch (error) {
      console.error('Failed to delete question:', error);
      alert('질문 삭제에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const handleToggleSaveQuestion = async (bqId, inqId = null) => {
    const questionId = bqId || inqId;
    const isSaved = savedQuestionIds.has(questionId);

    // 사용자 ID 가져오기 (localStorage에서)
    let userId = null;
    try {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        userId = user.id || user.userId;
      }
    } catch (error) {
      console.error('Failed to get user ID:', error);
    }

    if (!userId) {
      alert('사용자 정보를 찾을 수 없습니다.');
      return;
    }

    try {
      if (isSaved) {
        // 찜 해제
        await unsaveQuestion({ userId, bqId, inqId });
        console.log('Question unsaved:', questionId);

        // 찜한 질문 ID 집합에서 제거
        setSavedQuestionIds(prev => {
          const newSet = new Set(prev);
          newSet.delete(questionId);
          return newSet;
        });

        alert('질문이 찜 목록에서 제거되었습니다.');
      } else {
        // 찜 추가
        const result = await saveQuestion({ bqId, inqId });
        console.log('Question saved:', result);

        // 찜한 질문 ID 집합에 추가
        setSavedQuestionIds(prev => new Set([...prev, questionId]));

        alert('질문이 찜 목록에 추가되었습니다!');
      }
    } catch (error) {
      console.error('Failed to toggle save question:', error);
      if (error.response?.status === 409) {
        alert('이미 찜한 질문입니다.');
      } else if (error.response?.status === 404) {
        alert('찜 목록에서 해당 질문을 찾을 수 없습니다.');
      } else {
        alert(`질문 ${isSaved ? '해제' : '찜하기'}에 실패했습니다. 다시 시도해주세요.`);
      }
    }
  };

  const getCategoryQuestions = () => {
    if (activeCategory === 'SAVED') {
      return selectedQuestions;
    }
    return questions[activeCategory] || [];
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
                $active={activeCategory === 'PERSONALITY'}
                onClick={() => setActiveCategory('PERSONALITY')}
              >
                인성 면접
              </CategoryItem>
              <CategoryItem
                $active={activeCategory === 'TECH'}
                onClick={() => setActiveCategory('TECH')}
              >
                기술 면접
              </CategoryItem>
              <CategoryItem
                $active={activeCategory === 'MINE'}
                onClick={() => setActiveCategory('MINE')}
              >
                내가 만든 질문
              </CategoryItem>
              <CategoryItem
                $active={activeCategory === 'SAVED'}
                onClick={() => setActiveCategory('SAVED')}
              >
                찜한 질문
              </CategoryItem>
            </CategoryList>
          </Sidebar>

          {/* 우측 콘텐츠 */}
          <Content>
            <ContentHeader>
              <ContentTitle>
                {activeCategory === 'PERSONALITY' && '인성 면접 질문 선택'}
                {activeCategory === 'TECH' && '기술 면접 질문 선택'}
                {activeCategory === 'MINE' && '내가 만든 질문 선택'}
                {activeCategory === 'SAVED' && '찜한 질문 모음집'}
              </ContentTitle>
              <ContentDescription>
                {activeCategory === 'SAVED'
                  ? '선택한 질문들이 모여있습니다. 이 질문들로 면접을 시작하세요!'
                  : '면접에 사용할 질문을 선택해주세요. 선택한 질문은 찜한 질문에 추가됩니다.'}
              </ContentDescription>
            </ContentHeader>

            {/* 내가 만든 질문 카테고리일 때만 질문 생성 UI 표시 */}
            {activeCategory === 'MINE' && (
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
                  {isCreatingQuestion ? '생성 중...' : '질문 추가'}
                </CreateButton>
              </CreateQuestionSection>
            )}

            {isLoading ? (
              <EmptyState>질문을 불러오는 중...</EmptyState>
            ) : (
              <QuestionGrid>
                {getCategoryQuestions().map((question) => (
                  <QuestionCard key={question.bq_id || question}>
                    <Checkbox
                      type="checkbox"
                      checked={selectedQuestions.includes(question.content || question)}
                      onChange={() => toggleQuestionSelection(question.content || question)}
                    />
                    <QuestionText>{question.content || question}</QuestionText>

                    {/* 찜하기 버튼 (찜한 질문 탭 제외) */}
                    {activeCategory !== 'SAVED' && question.bq_id && (
                      <SaveButton
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleSaveQuestion(question.bq_id);
                        }}
                        $isSaved={savedQuestionIds.has(question.bq_id)}
                        title={savedQuestionIds.has(question.bq_id) ? '찜 해제' : '질문 찜하기'}
                      >
                        {savedQuestionIds.has(question.bq_id) ? '♥' : '♡'}
                      </SaveButton>
                    )}

                    {/* 내가 만든 질문일 때만 삭제 버튼 표시 */}
                    {activeCategory === 'MINE' && question.bq_id && (
                      <DeleteButton
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteQuestion(question.bq_id, question.content);
                        }}
                        title="질문 삭제"
                      >
                        ✕
                      </DeleteButton>
                    )}
                  </QuestionCard>
                ))}
              </QuestionGrid>
            )}

            {!isLoading && getCategoryQuestions().length === 0 && (
              <EmptyState>
                아직 {activeCategory === 'SAVED' ? '찜한' : ''} 질문이 없습니다.
              </EmptyState>
            )}

            <BottomBar>
              <SelectedCount>
                선택된 질문: {selectedQuestions.length}개
              </SelectedCount>
              <ButtonGroup>
                <CancelButton onClick={() => navigate('/interview')}>
                  취소
                </CancelButton>
                <StartButton onClick={handleStartInterview}>
                  면접 시작하기
                </StartButton>
              </ButtonGroup>
            </BottomBar>
          </Content>
        </ContentCard>

        {/* 면접관 배정 모달 */}
        {assignmentStage > 0 && (
          <Modal>
            <ModalOverlay />
            <AssignmentModalContent>
              <CloseButton onClick={handleCloseAssignment}>✕</CloseButton>

              {assignmentStage === 1 ? (
                <>
                  <ModalTitle>어떤 면접관을 만날지 랜덤으로 배정 중이에요!</ModalTitle>
                  <LoadingIcon>
                    <img src={ddocks2} alt="Interview Icon" />
                  </LoadingIcon>
                </>
              ) : (
                <>
                  <ModalTitle>면접 준비 완료!</ModalTitle>
                  <AssignmentInfoSection>
                    <AssignmentInfoText>
                      지원자의 논리적 허점과 대처 능력을 날카롭게 파고드는 압박 면접관이 배정되었어요.
                    </AssignmentInfoText>
                    <AssignmentInfoHighlight>
                      총 <Strong>{selectedQuestions.length}개</Strong>의 질문으로 면접 연습을 시작합니다.
                    </AssignmentInfoHighlight>
                    <AssignmentInfoText>
                      면접 연습은 약 <Strong>20~30분</Strong> 정도 소요될 예정이에요.
                    </AssignmentInfoText>
                    <AssignmentInfoText>이 면접의 끝에서, 당신은 한 단계 더 성장해 있을 겁니다 !</AssignmentInfoText>
                  </AssignmentInfoSection>

                  <AssignmentCharacterSmall>
                    <img src={ddocks2} alt="Interview Character" />
                  </AssignmentCharacterSmall>

                  <AssignmentStartButton onClick={handleStartInterviewProgress}>
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
  display: flex;
  flex-direction: column;
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
  flex: 1;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const QuestionCard = styled.div`
  background-color: white;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing.xl};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    transform: translateX(4px);
    box-shadow: ${({ theme }) => theme.shadows.md};
  }
`;

const Checkbox = styled.input`
  width: 20px;
  height: 20px;
  cursor: pointer;
  accent-color: ${({ theme }) => theme.colors.primary};
`;

const QuestionText = styled.p`
  font-size: ${({ theme }) => theme.fonts.size.base};
  color: ${({ theme }) => theme.colors.text.dark};
  flex: 1;
`;

const SaveButton = styled.button`
  background-color: transparent;
  border: none;
  color: ${({ $isSaved, theme }) => ($isSaved ? '#FF6B9D' : theme.colors.gray[400])};
  font-size: ${({ theme }) => theme.fonts.size.xl};
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
    background-color: #FF6B9D10;
    color: #FF6B9D;
    transform: scale(1.1);
  }

  &:active {
    transform: scale(0.95);
  }
`;

const DeleteButton = styled.button`
  background-color: transparent;
  border: none;
  color: ${({ theme }) => theme.colors.gray[400]};
  font-size: ${({ theme }) => theme.fonts.size.xl};
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
    background-color: ${({ theme }) => theme.colors.red}10;
    color: ${({ theme }) => theme.colors.red};
    transform: scale(1.1);
  }

  &:active {
    transform: scale(0.95);
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing['4xl']};
  color: white;
  font-size: ${({ theme }) => theme.fonts.size.lg};
`;

const BottomBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: ${({ theme }) => theme.spacing.xl};
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

const SelectedCount = styled.div`
  font-size: ${({ theme }) => theme.fonts.size.lg};
  font-weight: ${({ theme }) => theme.fonts.weight.semibold};
  color: white;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
`;

const CancelButton = styled(Button)`
  background-color: ${({ theme }) => theme.colors.gray[600]};

  &:hover {
    background-color: ${({ theme }) => theme.colors.gray[700]};
  }
`;

const StartButton = styled(Button)`
  background-color: ${({ theme }) => theme.colors.primary};

  &:hover {
    background-color: ${({ theme }) => theme.colors.primaryDark};
  }
`;

// Modal styles
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

const bounce = keyframes`
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
`;

const LoadingIcon = styled.div`
  font-size: ${({ theme }) => theme.fonts.size['5xl']};
  margin: ${({ theme }) => theme.spacing.xl} 0;
  animation: ${bounce} 1.5s infinite;

  img {
    width: 180px;
    height: 180px;
    object-fit: contain;
  }
`;

const ModalTitle = styled.h3`
  font-size: ${({ theme }) => theme.fonts.size['2xl']};
  font-weight: ${({ theme }) => theme.fonts.weight.bold};
  color: ${({ theme }) => theme.colors.text.dark};
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

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

export default QuestionSelection;
