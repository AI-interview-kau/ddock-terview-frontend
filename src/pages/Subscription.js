import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Layout from '../components/common/Layout';
import Button from '../components/common/Button';
import Footer from '../components/common/Footer';
import ticketIcon from '../assets/icons/이용권.png';
import { useAuth } from '../contexts/AuthContext';
import { getSubscriptionInfo, purchaseSubscription } from '../api/userService';

const PLANS = [
  {
    name: '1-Day Plan',
    duration: '구매일 이후 1개월',
    originalPrice: '5,400원',
    price: '1,200원',
    features: [
      '무용량 고민 면담 (최대 3회까지 이용 가능, 30일간 동안 불레마)',
      '스트레스 면역 면담 (면접 걱정과 불안 해소하는 가능성을 누릴)',
      'AI 성장 피드백 (취업 면담 성장 결과 면접전화)',
    ],
  },
  {
    name: '3-Day Plan',
    duration: '구매일 이후 1개월',
    originalPrice: '6,600원',
    price: '3,000원',
    features: [
      '무용량 고민 면담',
      '스트레스 면역 면담',
      'AI 성장 피드백',
    ],
  },
  {
    name: '1-Week Plan',
    duration: '구매일 이후 1개월',
    originalPrice: '15,410원',
    price: '5,200원',
    features: [
      '무용량 고민 면담',
      '스트레스 면역 면담',
      'AI 성장 피드백',
    ],
  },
  {
    name: '1-Month Plan',
    duration: '구매일 이후 1개월',
    originalPrice: '22,000원',
    price: '11,000원',
    features: [
      '무용량 고민 면담',
      '스트레스 면역 면담',
      'AI 성장 피드백',
    ],
  },
];

const Subscription = () => {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [subscriptionInfo, setSubscriptionInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubscriptionInfo = async () => {
      if (!isLoggedIn) {
        setLoading(false);
        return;
      }

      try {
        const data = await getSubscriptionInfo();
        setSubscriptionInfo(data);
      } catch (error) {
        console.error('Failed to fetch subscription info:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptionInfo();
  }, [isLoggedIn]);

  const handlePurchase = async (planId) => {
    if (!isLoggedIn) {
      alert('로그인이 필요합니다.');
      navigate('/login');
      return;
    }

    try {
      const result = await purchaseSubscription({
        planId: planId,
        paymentMethod: 'card', // 기본 결제 방법
      });

      alert('이용권이 구매되었습니다!');
      // 구매 후 정보 다시 불러오기
      const data = await getSubscriptionInfo();
      setSubscriptionInfo(data);
    } catch (error) {
      console.error('Failed to purchase subscription:', error);
      alert('이용권 구매에 실패했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <Layout>
      <Container>
        {/* 헤더 */}
        <Header>
          <HeaderTitle>
            다가오는 세해에도 더 나은 나를 위해, 면접 준비를 완벽하게!
          </HeaderTitle>
          <HeaderSubtitle>똑터뷰와 함께 시작해볼까요?</HeaderSubtitle>
          {!isLoggedIn && (
            <LoginButton onClick={() => navigate('/login')}>
              로그인 후 이용하기
            </LoginButton>
          )}
        </Header>

        {/* 플랜 카드 */}
        <PlansGrid>
          {PLANS.map((plan, index) => (
            <PlanCard key={index}>
              <PlanContent>
                <PlanLeft>
                  <PlanName>{plan.name}</PlanName>
                  <PlanDuration>유효기간: {plan.duration}</PlanDuration>

                  <Features>
                    {plan.features.map((feature, idx) => (
                      <Feature key={idx}>
                        <FeatureIcon>✓</FeatureIcon>
                        <FeatureText>{feature}</FeatureText>
                      </Feature>
                    ))}
                  </Features>
                </PlanLeft>

                <PlanRight>
                  <PriceInfo>
                    <OriginalPrice>{plan.originalPrice}</OriginalPrice>
                    <Price>{plan.price}</Price>
                    <Discount>할인 중!</Discount>
                  </PriceInfo>
                </PlanRight>
              </PlanContent>
            </PlanCard>
          ))}
        </PlansGrid>

        {/* 유의사항 */}
        <Notice>
          <NoticeTitle>이용권 유의사항</NoticeTitle>
          <NoticeList>
            <NoticeItem>
              • 면접 이용권은 환불관련 지침에 기재 내재 사항이 허니, 유효기간이
              지난 사항이 존재합니다.
            </NoticeItem>
            <NoticeItem>
              • 이용권은 구매 후 언제든 사용 가능하며, 타인과게 양도되거나
              재판매할 수 없습니다.
            </NoticeItem>
            <NoticeItem>
              • 이용권의 취소 및 환불은 구매 시점부터 7일 이내에만 유효하며,
              결제 가격 금액으로 환불 받게 됩니다.
            </NoticeItem>
            <NoticeItem>
              • 이용권에 포함된 서비스는 별 도전은 사항이 출력될 적정의 주세요.
            </NoticeItem>
            <NoticeItem>
              • 모든 사항은 이용권이 자재하면 모든 사실이 비활성화됩니다.
            </NoticeItem>
            <NoticeItem>
              • 모든 이용권은 회사의 손해 발생의 대한 변동을 업그레이드 받을 수
              없습니다.
            </NoticeItem>
            <NoticeItem>
              • 무료 시스템의 최제발 정부, 서비스 제공이 제한되거나 이용금이
              무상혈이 주실되오.
            </NoticeItem>
            <NoticeItem>
              • 예약 및 서비스는 사전 정전없이 수정되거나 개정되오.
            </NoticeItem>
          </NoticeList>
        </Notice>

        {/* 푸터 */}
        <Footer />
      </Container>
    </Layout>
  );
};

const Container = styled.div`
  min-height: calc(100vh - 80px);
  background-color: ${({ theme }) => theme.colors.background};
`;

const Header = styled.header`
  background: linear-gradient(180deg, #7C6FEE 0%, #9B8FF5 100%);
  padding: ${({ theme }) => theme.spacing['4xl']} ${({ theme }) => theme.spacing.xl};
  text-align: center;
`;

const HeaderTitle = styled.h1`
  font-size: ${({ theme }) => theme.fonts.size['3xl']};
  font-weight: ${({ theme }) => theme.fonts.weight.bold};
  color: white;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const HeaderSubtitle = styled.p`
  font-size: ${({ theme }) => theme.fonts.size.xl};
  color: white;
  margin-bottom: ${({ theme }) => theme.spacing['2xl']};
`;

const LoginButton = styled(Button)`
  background-color: white;
  color: ${({ theme }) => theme.colors.primary};

  &:hover {
    background-color: ${({ theme }) => theme.colors.gray[100]};
    color: ${({ theme }) => theme.colors.primaryDark};
  }
`;

const PlansGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
  max-width: 1000px;
  margin: ${({ theme }) => theme.spacing['3xl']} auto;
  padding: 0 ${({ theme }) => theme.spacing.xl};
`;

const PlanCard = styled.div`
  background: url(${ticketIcon}) center/contain no-repeat;
  background-size: 100% 100%;
  padding: ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing.xl};
  transition: all ${({ theme }) => theme.transitions.fast};
  position: relative;
  min-height: 120px;
  display: flex;
  align-items: center;

  &:hover {
    transform: translateY(-4px);
    filter: drop-shadow(0 8px 16px rgba(0, 0, 0, 0.12));
  }
`;

const PlanContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  gap: ${({ theme }) => theme.spacing.xl};
`;

const PlanLeft = styled.div`
  flex: 1;
`;

const PlanName = styled.h3`
  font-size: ${({ theme }) => theme.fonts.size.xl};
  font-weight: ${({ theme }) => theme.fonts.weight.bold};
  color: ${({ theme }) => theme.colors.text.dark};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const PlanDuration = styled.p`
  font-size: ${({ theme }) => theme.fonts.size.xs};
  color: ${({ theme }) => theme.colors.gray[600]};
`;

const Features = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-top: ${({ theme }) => theme.spacing.md};
`;

const Feature = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  align-items: flex-start;
`;

const FeatureIcon = styled.span`
  flex-shrink: 0;
  color: ${({ theme }) => theme.colors.primary};
  font-weight: ${({ theme }) => theme.fonts.weight.bold};
`;

const FeatureText = styled.p`
  font-size: ${({ theme }) => theme.fonts.size.sm};
  color: ${({ theme }) => theme.colors.text.dark};
  line-height: 1.5;
`;

const PlanRight = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  border-left: 2px dashed ${({ theme }) => theme.colors.gray[300]};
  padding-left: ${({ theme }) => theme.spacing.lg};
`;


const PriceInfo = styled.div`
  text-align: center;
`;

const OriginalPrice = styled.p`
  font-size: ${({ theme }) => theme.fonts.size.sm};
  color: ${({ theme }) => theme.colors.gray[500]};
  text-decoration: line-through;
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const Price = styled.p`
  font-size: ${({ theme }) => theme.fonts.size['2xl']};
  font-weight: ${({ theme }) => theme.fonts.weight.bold};
  color: ${({ theme }) => theme.colors.text.dark};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const Discount = styled.span`
  font-size: ${({ theme }) => theme.fonts.size.xs};
  color: ${({ theme }) => theme.colors.primary};
  font-weight: ${({ theme }) => theme.fonts.weight.semibold};
`;

const Notice = styled.section`
  max-width: 1400px;
  margin: ${({ theme }) => theme.spacing['4xl']} auto;
  padding: 0 ${({ theme }) => theme.spacing.xl};
`;

const NoticeTitle = styled.h2`
  font-size: ${({ theme }) => theme.fonts.size.xl};
  font-weight: ${({ theme }) => theme.fonts.weight.bold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const NoticeList = styled.ul`
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const NoticeItem = styled.li`
  font-size: ${({ theme }) => theme.fonts.size.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
  line-height: 1.6;
`;

export default Subscription;
