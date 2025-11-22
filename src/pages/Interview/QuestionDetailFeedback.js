import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import Layout from '../../components/common/Layout';
import Button from '../../components/common/Button';
import { getQuestionFeedback } from '../../api/interviewService';

const QuestionDetailFeedback = () => {
  const navigate = useNavigate();
  const { sessionId, inqId } = useParams();
  const [feedbackMode, setFeedbackMode] = useState('language'); // 'language' or 'behavior'
  const [feedbackData, setFeedbackData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuestionFeedback = async () => {
      if (!sessionId || !inqId) {
        setLoading(false);
        return;
      }

      try {
        const data = await getQuestionFeedback(sessionId, inqId);
        setFeedbackData(data);
      } catch (error) {
        console.error('Failed to fetch question feedback:', error);
        alert('질문별 피드백을 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchQuestionFeedback();
  }, [sessionId, inqId]);

  const questionText = feedbackData?.content || '가장 힘들었던 순간이 무엇이었나요?';
  const videoUrl = feedbackData?.videoUrl;
  const languageFeedbackText = feedbackData?.langfeedback || '생성된 언어 피드백이 없습니다.';
  const behaviorFeedbackText = feedbackData?.behavefeedback || '생성된 행동 피드백이 없습니다.';

  // 피드백 텍스트를 배열 형식으로 변환
  const languageFeedback = [
    {
      title: '언어적 피드백',
      content: languageFeedbackText,
    },
  ];

  const behaviorFeedback = [
    {
      title: '행동적 피드백',
      content: behaviorFeedbackText,
    },
  ];

  const currentFeedback = feedbackMode === 'language' ? languageFeedback : behaviorFeedback;

  if (loading) {
    return (
      <Layout>
        <Container>
          <div>로딩 중...</div>
        </Container>
      </Layout>
    );
  }

  return (
    <Layout isLoggedIn={true} userName="김똑쓰">
      <Container>
        <SectionTitle>질문별 피드백</SectionTitle>

        <ContentWrapper>
          <QuestionTitle>{questionText}</QuestionTitle>

          <ContentGrid>
            {/* 좌측 - 답변 영상 */}
            <VideoSection>
              <VideoPlayer>
                <PlayButton>▶</PlayButton>
                <VideoPlaceholder>📹</VideoPlaceholder>
                <VideoHint>답변 영상</VideoHint>
              </VideoPlayer>
            </VideoSection>

            {/* 우측 - 피드백 */}
            <FeedbackSection>
              <ToggleWrapper>
                <ToggleButton
                  $active={feedbackMode === 'behavior'}
                  onClick={() => setFeedbackMode('behavior')}
                >
                  행동
                </ToggleButton>
                <ToggleButton
                  $active={feedbackMode === 'language'}
                  onClick={() => setFeedbackMode('language')}
                >
                  언어
                </ToggleButton>
              </ToggleWrapper>

              <FeedbackContent>
                {currentFeedback.map((item, index) => (
                  <FeedbackItem key={index}>
                    <FeedbackItemTitle>{item.title}</FeedbackItemTitle>
                    <FeedbackItemContent>{item.content}</FeedbackItemContent>
                  </FeedbackItem>
                ))}
              </FeedbackContent>
            </FeedbackSection>
          </ContentGrid>

          <ButtonWrapper>
            <ConfirmButton
              size="large"
              onClick={() => navigate(`/my-log/${sessionId}`)}
            >
              확인
            </ConfirmButton>
          </ButtonWrapper>
        </ContentWrapper>
      </Container>
    </Layout>
  );
};

const Container = styled.div`
  min-height: calc(100vh - 80px);
  background-color: ${({ theme }) => theme.colors.background};
  padding: ${({ theme }) => theme.spacing.xl};
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
`;

const SectionTitle = styled.h2`
  font-size: ${({ theme }) => theme.fonts.size['2xl']};
  font-weight: ${({ theme }) => theme.fonts.weight.bold};
  color: white;
  background-color: #2C2539;
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  border-top-left-radius: ${({ theme }) => theme.borderRadius.md};
  border-top-right-radius: ${({ theme }) => theme.borderRadius.md};
`;

const ContentWrapper = styled.div`
  background-color: white;
  border-bottom-left-radius: ${({ theme }) => theme.borderRadius.xl};
  border-bottom-right-radius: ${({ theme }) => theme.borderRadius.xl};
  padding: ${({ theme }) => theme.spacing['3xl']};
  box-shadow: ${({ theme }) => theme.shadows.md};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xl};
`;

const QuestionTitle = styled.h1`
  font-size: ${({ theme }) => theme.fonts.size['2xl']};
  font-weight: ${({ theme }) => theme.fonts.weight.bold};
  color: ${({ theme }) => theme.colors.text.dark};
  text-align: center;
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing['3xl']};
  flex: 1;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
  }
`;

const VideoSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const VideoPlayer = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 4/3;
  background: linear-gradient(135deg, #2C2C2C 0%, #1A1A1A 100%);
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow: ${({ theme }) => theme.shadows.xl};
`;

const PlayButton = styled.button`
  position: absolute;
  width: 80px;
  height: 80px;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  font-size: ${({ theme }) => theme.fonts.size['3xl']};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  padding-left: 8px;

  &:hover {
    transform: scale(1.1);
    background-color: ${({ theme }) => theme.colors.primaryDark};
  }
`;

const VideoPlaceholder = styled.div`
  font-size: 80px;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const VideoHint = styled.p`
  font-size: ${({ theme }) => theme.fonts.size.lg};
  color: ${({ theme }) => theme.colors.gray[400]};
`;

const FeedbackSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xl};
`;

const ToggleWrapper = styled.div`
  display: flex;
  background-color: ${({ theme }) => theme.colors.gray[200]};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  padding: 4px;
  width: fit-content;
  margin: 0 auto;
`;

const ToggleButton = styled.button`
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing['2xl']};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: ${({ theme }) => theme.fonts.size.base};
  font-weight: ${({ theme }) => theme.fonts.weight.semibold};
  background-color: ${({ $active, theme }) =>
    $active ? theme.colors.primary : 'transparent'};
  color: ${({ $active, theme }) =>
    $active ? 'white' : theme.colors.text.dark};
  transition: all ${({ theme }) => theme.transitions.fast};
  cursor: pointer;

  &:hover {
    background-color: ${({ $active, theme }) =>
      $active ? theme.colors.primaryDark : theme.colors.gray[300]};
  }
`;

const FeedbackContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  flex: 1;
  overflow-y: auto;
`;

const FeedbackItem = styled.div`
  background-color: #E8E4F9;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.lg};
`;

const FeedbackItemTitle = styled.h3`
  font-size: ${({ theme }) => theme.fonts.size.base};
  font-weight: ${({ theme }) => theme.fonts.weight.bold};
  color: ${({ theme }) => theme.colors.text.dark};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const FeedbackItemContent = styled.p`
  font-size: ${({ theme }) => theme.fonts.size.sm};
  color: ${({ theme }) => theme.colors.text.dark};
  line-height: 1.6;
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: ${({ theme }) => theme.spacing.xl};
`;

const ConfirmButton = styled(Button)`
  width: auto;
  min-width: 200px;
  background-color: #9B8FF5;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing['2xl']};

  &:hover {
    background-color: #8B7FE5;
  }
`;

export default QuestionDetailFeedback;
