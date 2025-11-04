import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import Layout from '../components/common/Layout';
import { getMyLog } from '../api/userService';

const GROWTH_DATA = [
  { session: '1회', score: 30 },
  { session: '2회', score: 35 },
  { session: '3회', score: 40 },
  { session: '4회', score: 48 },
  { session: '5회', score: 55 },
  { session: '6회', score: 65 },
  { session: '7회', score: 75 },
  { session: '8회', score: 82 },
  { session: '9회', score: 90 },
  { session: '10회', score: 92 },
];

const SKILL_DATA = [
  { subject: '직무적합성', value: 85 },
  { subject: '질문 의도 파악', value: 75 },
  { subject: '문제 해결', value: 70 },
  { subject: '정확성', value: 80 },
  { subject: '논리성', value: 78 },
  { subject: '구체성 및 경험', value: 72 },
];

const BEHAVIOR_DATA = [
  { subject: '시선 처리', value: 80 },
  { subject: '자신감', value: 85 },
  { subject: '자세 및 태도', value: 75 },
  { subject: '말의 속도', value: 70 },
  { subject: '표정 및 제스처', value: 78 },
  { subject: '목소리 크기', value: 82 },
];

const INTERVIEW_HISTORY = [
  { date: '25.09.10 14:30', score: 92 },
  { date: '25.09.08 18:41', score: 90 },
  { date: '25.09.05 21:08', score: 82 },
  { date: '25.09.01 09:01', score: 75 },
  { date: '25.08.28 17:23', score: 65 },
  { date: '25.08.25 10:15', score: 55 },
  { date: '25.08.20 14:45', score: 48 },
  { date: '25.08.15 16:30', score: 40 },
  { date: '25.08.10 11:20', score: 35 },
  { date: '25.08.05 09:00', score: 30 },
];

const MyLog = () => {
  const navigate = useNavigate();
  const [myLogData, setMyLogData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyLog = async () => {
      try {
        const data = await getMyLog();
        setMyLogData(data);
      } catch (error) {
        console.error('Failed to fetch my log:', error);
        alert('면접 기록을 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchMyLog();
  }, []);

  const handleHistoryClick = (sessionId) => {
    // 특정 면접 기록 클릭 시 피드백 페이지로 이동
    navigate(`/interview/feedback/${sessionId}`);
  };

  if (loading) {
    return (
      <Layout>
        <Container>
          <div>로딩 중...</div>
        </Container>
      </Layout>
    );
  }

  // API 응답이 없으면 더미 데이터 사용
  const growthData = myLogData?.growthReport || GROWTH_DATA;
  const skillData = myLogData?.latestSkillReport || SKILL_DATA;
  const behaviorData = myLogData?.latestBehaviorReport || BEHAVIOR_DATA;
  const interviewHistory = myLogData?.interviewHistory || INTERVIEW_HISTORY;

  return (
    <Layout isLoggedIn={true} userName="김똑쓰">
      <Container>
        {/* 나의 성장 리포트 */}
        <Section>
          <SectionTitleBar>나의 성장 리포트</SectionTitleBar>
          <ContentWrapper>
            <SectionSubtitle>
              꾸준한 연습으로 성장하는 나를 확인해 보세요!
            </SectionSubtitle>

            <ChartContainer>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={growthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
                <XAxis dataKey="session" stroke="#9E9E9E" />
                <YAxis domain={[0, 100]} stroke="#9E9E9E" />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#7C6FEE"
                  strokeWidth={3}
                  dot={{ fill: '#7C6FEE', r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
            </ChartContainer>
          </ContentWrapper>
        </Section>

        {/* 3차 면접 역량 분석 */}
        <Section>
          <SectionTitleBar>3차 면접 역량</SectionTitleBar>
          <ContentWrapper>
            <InterviewHeader>
              <SectionInfo>(2025.04.23) | 3차 면접</SectionInfo>
              <ImprovementBadge>
                2차 대비 자신감이 30% 증가했어요!
              </ImprovementBadge>
            </InterviewHeader>

            <FeedbackText>
              면접 전반적으로 준비된 모습이 돋보였지만, 구체적인 사례와
              자료스러운 태도를 보완한다면 훨씬 더 매력적인 답변이 될 것입니다.
            </FeedbackText>

          <RadarChartsContainer>
            <RadarChartWrapper>
              <RadarChartTitle>직무 역량</RadarChartTitle>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={skillData}>
                  <PolarGrid stroke="#E0E0E0" />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12 }} />
                  <PolarRadiusAxis domain={[0, 100]} />
                  <Radar
                    dataKey="value"
                    stroke="#7C6FEE"
                    fill="#7C6FEE"
                    fillOpacity={0.3}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </RadarChartWrapper>

            <RadarChartWrapper>
              <RadarChartTitle>비언어적 역량</RadarChartTitle>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={behaviorData}>
                  <PolarGrid stroke="#E0E0E0" />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12 }} />
                  <PolarRadiusAxis domain={[0, 100]} />
                  <Radar
                    dataKey="value"
                    stroke="#9B8FF5"
                    fill="#9B8FF5"
                    fillOpacity={0.3}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </RadarChartWrapper>
          </RadarChartsContainer>
          </ContentWrapper>
        </Section>

        {/* 나의 면접 기록 */}
        <Section>
          <SectionTitleBar>나의 면접 기록</SectionTitleBar>
          <ContentWrapper>
            <SectionSubtitle>
              과거의 면접 기록을 확인해 보세요!
            </SectionSubtitle>

            <HistoryList>
            {interviewHistory.map((item, index) => (
              <HistoryItem
                key={item.sessionId || index}
                onClick={() => handleHistoryClick(item.sessionId)}
                $clickable={true}
              >
                <HistoryDate>{item.date}</HistoryDate>
                <HistoryScore>{item.score}점</HistoryScore>
              </HistoryItem>
            ))}
            </HistoryList>
          </ContentWrapper>
        </Section>
      </Container>
    </Layout>
  );
};

const Container = styled.div`
  min-height: calc(100vh - 80px);
  background-color: ${({ theme }) => theme.colors.background};
  padding: ${({ theme }) => theme.spacing['3xl']} ${({ theme }) => theme.spacing.xl};
  max-width: 1400px;
  margin: 0 auto;
`;

const Section = styled.section`
  margin-bottom: ${({ theme }) => theme.spacing['4xl']};
`;

const SectionTitleBar = styled.h2`
  font-size: ${({ theme }) => theme.fonts.size['3xl']};
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
`;

const SectionSubtitle = styled.p`
  font-size: ${({ theme }) => theme.fonts.size.lg};
  color: ${({ theme }) => theme.colors.text.dark};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const InterviewHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  flex-wrap: wrap;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const SectionInfo = styled.p`
  font-size: ${({ theme }) => theme.fonts.size['2xl']};
  font-weight: ${({ theme }) => theme.fonts.weight.bold};
  color: ${({ theme }) => theme.colors.text.dark};
`;

const ImprovementBadge = styled.div`
  display: inline-flex;
  align-items: center;
  background: linear-gradient(135deg, #8973FF 0%, #7BA3FF 100%);
  color: white;
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.xl};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: ${({ theme }) => theme.fonts.size.base};
  font-weight: ${({ theme }) => theme.fonts.weight.bold};
  box-shadow: 0 4px 12px rgba(137, 115, 255, 0.3);
`;

const ChartContainer = styled.div`
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  padding: ${({ theme }) => theme.spacing.xl};
`;

const FeedbackText = styled.p`
  font-size: ${({ theme }) => theme.fonts.size.xl};
  font-weight: ${({ theme }) => theme.fonts.weight.medium};
  color: ${({ theme }) => theme.colors.text.dark};
  margin-bottom: ${({ theme }) => theme.spacing['2xl']};
  line-height: 1.8;
  background-color: ${({ theme }) => theme.colors.gray[50]};
  padding: ${({ theme }) => theme.spacing.xl};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
`;

const RadarChartsContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing.xl};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
  }
`;

const RadarChartWrapper = styled.div`
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  padding: ${({ theme }) => theme.spacing.xl};
  background-color: ${({ theme }) => theme.colors.gray[50]};
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
`;

const RadarChartTitle = styled.h3`
  font-size: ${({ theme }) => theme.fonts.size.xl};
  font-weight: ${({ theme }) => theme.fonts.weight.bold};
  color: ${({ theme }) => theme.colors.text.dark};
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const HistoryList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.xl};
`;

const HistoryItem = styled.div`
  background-color: white;
  border: 1px solid ${({ theme }) => theme.colors.gray[300]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing.xl};
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: ${({ $clickable }) => ($clickable ? 'pointer' : 'default')};
  transition: all ${({ theme }) => theme.transitions.fast};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  &:hover {
    ${({ $clickable }) =>
      $clickable &&
      `
      transform: translateX(4px);
      border-color: #7C6FEE;
      box-shadow: 0 4px 12px rgba(124, 111, 238, 0.2);
    `}
  }
`;

const HistoryDate = styled.span`
  font-size: ${({ theme }) => theme.fonts.size.lg};
  color: ${({ theme }) => theme.colors.text.dark};
`;

const HistoryScore = styled.span`
  font-size: ${({ theme }) => theme.fonts.size.xl};
  font-weight: ${({ theme }) => theme.fonts.weight.bold};
  color: white;
  background: linear-gradient(135deg, #8973FF 0%, #7BA3FF 100%);
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
`;

export default MyLog;
