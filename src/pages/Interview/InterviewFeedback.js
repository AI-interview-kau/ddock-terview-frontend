import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FiHeart } from 'react-icons/fi';
import Layout from '../../components/common/Layout';

const MOCK_QUESTIONS = [
  '본인이 가지고 있는 강점을 설명해주세요.',
  '보안 취약점에 대해 알고 있는 것과 그 대응 방법은 무엇인가요?',
  '코드 리뷰의 중요성에 대해 이야기해 주세요.',
  '본인이 최선을 다해 성취한 경험에 대해서 이야기해 주세요.',
  '보안 취약점에 대해 알고 있는 것과 그 대응 방법은 무엇인가요?',
];

const InterviewFeedback = () => {
  const navigate = useNavigate();
  const [savedQuestions, setSavedQuestions] = useState([]);

  const toggleSaveQuestion = (index) => {
    if (savedQuestions.includes(index)) {
      setSavedQuestions(savedQuestions.filter((i) => i !== index));
    } else {
      setSavedQuestions([...savedQuestions, index]);
    }
  };

  const handleQuestionClick = (index) => {
    navigate(`/interview/feedback/${index}`);
  };

  return (
    <Layout isLoggedIn={true} userName="김똑쓰">
      <Container>
        {/* 최종 피드백 섹션 */}
        <Section>
          <SectionTitle>최종 피드백</SectionTitle>

          <FeedbackCard>
            <ScoreBox>
              <ScoreLabel>총점:</ScoreLabel>
              <Score>82점 / 100점</Score>
            </ScoreBox>

            <FeedbackText>
              전반적으로 준비된 모습이 돋보였지만, 구체적인 사례와 자료스러운 태도를
              보완한다면 훨씬 더 매력적인 답변이 될 것입니다.
              다음에는 답변 시간을 적절히 조절하여 더욱 실감을 살린 모의 면접을
              시도해 보세요!
            </FeedbackText>

            <FeedbackSection>
              <FeedbackTitle>장점</FeedbackTitle>
              <FeedbackList>
                <FeedbackItem>
                  자신감 있는 태도와 명확한 목소리 톤이 인상적이었습니다.
                </FeedbackItem>
                <FeedbackItem>
                  질문의 의도를 잘 파악하고 논리적으로 답변하려는 노력이
                  돋보였습니다.
                </FeedbackItem>
              </FeedbackList>
            </FeedbackSection>

            <FeedbackSection>
              <FeedbackTitle>개선점</FeedbackTitle>
              <FeedbackList>
                <FeedbackItem>
                  일부 질문에서 예시가 부족해 구체성이 떨어졌습니다. 구체적인
                  상황을 곁들여 답변하면 더 설득력이 있을 것입니다.
                </FeedbackItem>
                <FeedbackItem>
                  말의 속도가 조금 빠른 청중이 내용을 따라가기 어려웠을 수
                  있습니다. 천천히 말하는 연습이 필요합니다.
                </FeedbackItem>
                <FeedbackItem>
                  시선 처리에서 자연스럽지 않은 부분이 있어 약간 어색하게
                  느껴졌습니다. 면접관을 바라보며 응시해 보세요.
                </FeedbackItem>
              </FeedbackList>
            </FeedbackSection>
          </FeedbackCard>
        </Section>

        {/* 면접 질문 및 피드백 섹션 */}
        <Section>
          <SectionTitle>면접 질문 및 피드백</SectionTitle>

          <QuestionContainer>
            <QuestionDescription>
              방금 진행한 면접의 전체 질문 목록이에요.
              <br />
              답변이 아쉬웠거나 다시 연습하고 싶은 중요한 질문이 있다면, 하트를
              눌러 질문 저장소에 저장해 보세요!
              <br />
              질문을 클릭하면 해당 질문의 피드백을 확인해볼 수 있어요.
            </QuestionDescription>

            <QuestionList>
              {MOCK_QUESTIONS.map((question, index) => (
                <QuestionCard
                  key={index}
                  onClick={() => handleQuestionClick(index)}
                >
                  <HeartButton
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSaveQuestion(index);
                    }}
                    $saved={savedQuestions.includes(index)}
                  >
                    <FiHeart />
                  </HeartButton>
                  <QuestionText>{question}</QuestionText>
                </QuestionCard>
              ))}
            </QuestionList>
          </QuestionContainer>
        </Section>
      </Container>
    </Layout>
  );
};

const Container = styled.div`
  min-height: calc(100vh - 80px);
  background-color: ${({ theme }) => theme.colors.background};
  padding: ${({ theme }) => theme.spacing['3xl']} ${({ theme }) => theme.spacing.xl};
  max-width: 1200px;
  margin: 0 auto;
`;

const Section = styled.section`
  margin-bottom: ${({ theme }) => theme.spacing['4xl']};
`;

const SectionTitle = styled.h2`
  font-size: ${({ theme }) => theme.fonts.size['3xl']};
  font-weight: ${({ theme }) => theme.fonts.weight.bold};
  color: white;
  background-color: #2C2539;
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  border-top-left-radius: ${({ theme }) => theme.borderRadius.md};
  border-top-right-radius: ${({ theme }) => theme.borderRadius.md};
`;

const FeedbackCard = styled.div`
  background-color: white;
  border-bottom-left-radius: ${({ theme }) => theme.borderRadius.xl};
  border-bottom-right-radius: ${({ theme }) => theme.borderRadius.xl};
  padding: ${({ theme }) => theme.spacing['3xl']};
  box-shadow: ${({ theme }) => theme.shadows.md};
`;

const ScoreBox = styled.div`
  background: linear-gradient(135deg, #8973FF 0%, #7BA3FF 100%);
  padding: ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

const ScoreLabel = styled.span`
  font-size: ${({ theme }) => theme.fonts.size.xl};
  font-weight: ${({ theme }) => theme.fonts.weight.bold};
  color: white;
`;

const Score = styled.span`
  font-size: ${({ theme }) => theme.fonts.size['2xl']};
  font-weight: ${({ theme }) => theme.fonts.weight.bold};
  color: white;
`;

const FeedbackText = styled.p`
  font-size: ${({ theme }) => theme.fonts.size.lg};
  font-weight: ${({ theme }) => theme.fonts.weight.bold};
  color: ${({ theme }) => theme.colors.text.dark};
  line-height: 1.8;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const FeedbackSection = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.xl};

  &:last-child {
    margin-bottom: 0;
  }
`;

const FeedbackTitle = styled.h3`
  font-size: ${({ theme }) => theme.fonts.size.xl};
  font-weight: ${({ theme }) => theme.fonts.weight.bold};
  color: ${({ theme }) => theme.colors.text.dark};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const FeedbackList = styled.ul`
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const FeedbackItem = styled.li`
  font-size: ${({ theme }) => theme.fonts.size.base};
  color: ${({ theme }) => theme.colors.text.dark};
  line-height: 1.6;
  padding-left: ${({ theme }) => theme.spacing.md};
  position: relative;

  &::before {
    content: '•';
    position: absolute;
    left: 0;
    color: ${({ theme }) => theme.colors.primary};
    font-weight: bold;
  }
`;

const QuestionContainer = styled.div`
  background-color: white;
  border-bottom-left-radius: ${({ theme }) => theme.borderRadius.xl};
  border-bottom-right-radius: ${({ theme }) => theme.borderRadius.xl};
  padding: ${({ theme }) => theme.spacing['3xl']};
  box-shadow: ${({ theme }) => theme.shadows.md};
`;

const QuestionDescription = styled.p`
  font-size: ${({ theme }) => theme.fonts.size.base};
  color: ${({ theme }) => theme.colors.text.dark};
  line-height: 1.6;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const QuestionList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const QuestionCard = styled.div`
  background-color: ${({ $active, theme }) =>
    $active ? 'rgba(124, 111, 238, 0.1)' : 'white'};
  border: 1px solid
    ${({ $active, theme }) =>
      $active ? theme.colors.primary : theme.colors.gray[300]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing.xl};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    background-color: rgba(124, 111, 238, 0.05);
    transform: translateX(4px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
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

export default InterviewFeedback;
