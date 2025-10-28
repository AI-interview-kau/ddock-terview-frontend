import React from 'react';
import styled from 'styled-components';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import Layout from '../components/common/Layout';

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
              <LineChart data={GROWTH_DATA}>
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
            <SectionInfo>(2025.04.23) | 3차 면접</SectionInfo>
            <ImprovementBadge>
              2차 대비 자신감이 30% 증가했어요!
            </ImprovementBadge>

            <FeedbackText>
            면접 전반적으로 준비된 모습이 돋보였지만, 구체적인 사례와
            자료스러운 태도를 보완한다면 훨씬 더 매력적인 답변이 될 것입니다.
          </FeedbackText>

          <RadarChartsContainer>
            <RadarChartWrapper>
              <RadarChartTitle>직무 역량</RadarChartTitle>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={SKILL_DATA}>
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
                <RadarChart data={BEHAVIOR_DATA}>
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
            {INTERVIEW_HISTORY.map((item, index) => (
              <HistoryItem key={index}>
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

const SectionInfo = styled.p`
  font-size: ${({ theme }) => theme.fonts.size.lg};
  color: ${({ theme }) => theme.colors.text.dark};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const ImprovementBadge = styled.div`
  display: inline-block;
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: ${({ theme }) => theme.fonts.size.sm};
  font-weight: ${({ theme }) => theme.fonts.weight.semibold};
`;

const ChartContainer = styled.div`
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  padding: ${({ theme }) => theme.spacing.xl};
`;

const FeedbackText = styled.p`
  font-size: ${({ theme }) => theme.fonts.size.lg};
  color: ${({ theme }) => theme.colors.text.dark};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  line-height: 1.6;
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
  background-color: ${({ theme }) => theme.colors.gray[50]};
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing.xl};
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    transform: translateX(4px);
    background-color: ${({ theme }) => theme.colors.gray[100]};
    border-color: ${({ theme }) => theme.colors.primary};
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
