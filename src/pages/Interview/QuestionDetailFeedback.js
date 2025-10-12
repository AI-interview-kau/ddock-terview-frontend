import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import Layout from '../../components/common/Layout';
import Button from '../../components/common/Button';

const QuestionDetailFeedback = () => {
  const navigate = useNavigate();
  const { questionId } = useParams();
  const [feedbackMode, setFeedbackMode] = useState('language'); // 'language' or 'behavior'

  const questionText = '가장 힘들었던 순간이 무엇이었나요?';

  const languageFeedback = [
    {
      title: '핵심은 간결하게 말해주세요!',
      content:
        '불필요한 이야기가 많으면 면접관이 중요한 내용을 놓칠 수 있어요. 취약점바가 힘들다고 하셨는데 어떤 면에 대한지 너무 짧았어요.',
    },
    {
      title: '관련 없는 이야기를 생략해주세요!',
      content:
        'L사 이야기는 주제와 연관이 적어서 집중력을 떨어뜨릴 수 있어요. 필요한 내용만 전달해 보세요.',
    },
    {
      title: '에피소드는 짧고 간결하게!',
      content:
        '지나치게 길거나 추첨한 동행이면 에피소드는 줄여주세요. 청중이 흥...',
    },
  ];

  const behaviorFeedback = [
    {
      title: '시선 처리가 자연스럽지 않아요',
      content:
        '면접관을 바라보는 시선이 불안정해 보였어요. 자연스럽게 면접관의 눈을 바라보세요.',
    },
    {
      title: '자세를 바르게 유지하세요',
      content:
        '등을 펴고 바른 자세로 면접에 임하는 것이 좋습니다.',
    },
    {
      title: '제스처를 적절히 활용하세요',
      content:
        '손동작을 활용하면 답변이 더 설득력 있게 전달됩니다.',
    },
  ];

  const currentFeedback = feedbackMode === 'language' ? languageFeedback : behaviorFeedback;

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
                  active={feedbackMode === 'behavior'}
                  onClick={() => setFeedbackMode('behavior')}
                >
                  행동
                </ToggleButton>
                <ToggleButton
                  active={feedbackMode === 'language'}
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
              onClick={() => navigate('/interview/feedback')}
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
  padding: ${({ theme }) => theme.spacing.xl};
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
`;

const SectionTitle = styled.h2`
  font-size: ${({ theme }) => theme.fonts.size['4xl']};
  font-weight: ${({ theme }) => theme.fonts.weight.bold};
  color: white;
  background-color: #2C2539;
  padding: ${({ theme }) => theme.spacing.xl} ${({ theme }) => theme.spacing['2xl']};
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
  align-items: start;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
  }
`;

const VideoSection = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: center;
  position: sticky;
  top: 0;
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
  background-color: #9B8FF5;
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
    background-color: #8B7FE5;
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
  background-color: ${({ theme }) => theme.colors.gray[300]};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  padding: 4px;
  width: fit-content;
  margin: 0 auto;
`;

const ToggleButton = styled.button`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.xl};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: ${({ theme }) => theme.fonts.size.base};
  font-weight: ${({ theme }) => theme.fonts.weight.medium};
  background-color: ${({ active }) =>
    active ? '#9B8FF5' : 'transparent'};
  color: ${({ active }) =>
    active ? 'white' : '#666'};
  transition: all ${({ theme }) => theme.transitions.fast};
  cursor: pointer;
  min-width: 80px;

  &:hover {
    background-color: ${({ active }) =>
      active ? '#8B7FE5' : 'rgba(155, 143, 245, 0.1)'};
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
