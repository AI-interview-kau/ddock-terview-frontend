import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import Layout from '../../components/common/Layout';
import Button from '../../components/common/Button';
import iconInterview from '../../assets/icons/icon_interview.png';
import ddocks2 from '../../assets/icons/ddocks2.png';

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

const QuestionSelection = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('personality');
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [assignmentStage, setAssignmentStage] = useState(0); // 0: 없음, 1: 면접관 배정 중, 2: 준비 완료

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

  const handleStartInterview = () => {
    if (selectedQuestions.length === 0) {
      alert('최소 1개 이상의 질문을 선택해주세요.');
      return;
    }
    // TODO: 선택한 질문들을 저장소에 저장
    setAssignmentStage(1);
  };

  const handleStartInterviewProgress = () => {
    navigate('/interview/camera-test');
  };

  const handleCloseAssignment = () => {
    setAssignmentStage(0);
  };

  const getCategoryQuestions = () => {
    if (activeCategory === 'saved') {
      return selectedQuestions;
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
                {activeCategory === 'personality' && '인성 면접 질문 선택'}
                {activeCategory === 'technical' && '기술 면접 질문 선택'}
                {activeCategory === 'custom' && '내가 만든 질문 선택'}
                {activeCategory === 'saved' && '찜한 질문 모음집'}
              </ContentTitle>
              <ContentDescription>
                {activeCategory === 'saved'
                  ? '선택한 질문들이 모여있습니다. 이 질문들로 면접을 시작하세요!'
                  : '면접에 사용할 질문을 선택해주세요. 선택한 질문은 찜한 질문에 추가됩니다.'}
              </ContentDescription>
            </ContentHeader>

            <QuestionGrid>
              {getCategoryQuestions().map((question, index) => (
                <QuestionCard key={index}>
                  <Checkbox
                    type="checkbox"
                    checked={selectedQuestions.includes(question)}
                    onChange={() => toggleQuestionSelection(question)}
                  />
                  <QuestionText>{question}</QuestionText>
                </QuestionCard>
              ))}
            </QuestionGrid>

            {getCategoryQuestions().length === 0 && (
              <EmptyState>
                아직 {activeCategory === 'saved' ? '찜한' : ''} 질문이 없습니다.
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

export default QuestionSelection;
