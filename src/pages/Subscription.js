import React from 'react';
import styled from 'styled-components';
import Layout from '../components/common/Layout';
import Button from '../components/common/Button';

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
  return (
    <Layout isLoggedIn={false}>
      <Container>
        {/* 헤더 */}
        <Header>
          <HeaderTitle>
            다가오는 세해에도 더 나은 나를 위해, 면접 준비를 완벽하게!
          </HeaderTitle>
          <HeaderSubtitle>똑터뷰와 함께 시작해볼까요?</HeaderSubtitle>
          <LoginButton>로그인 후 이용하기</LoginButton>
        </Header>

        {/* 플랜 카드 */}
        <PlansGrid>
          {PLANS.map((plan, index) => (
            <PlanCard key={index}>
              <PlanHeader>
                <PlanName>{plan.name}</PlanName>
                <PlanDuration>유효기간: {plan.duration}</PlanDuration>
              </PlanHeader>

              <Features>
                {plan.features.map((feature, idx) => (
                  <Feature key={idx}>
                    <FeatureIcon>✅</FeatureIcon>
                    <FeatureText>{feature}</FeatureText>
                  </Feature>
                ))}
              </Features>

              <PriceSection>
                <CharacterIcon>🤖</CharacterIcon>
                <PriceInfo>
                  <OriginalPrice>{plan.originalPrice}</OriginalPrice>
                  <Price>{plan.price}</Price>
                  <Discount>할인 중</Discount>
                </PriceInfo>
              </PriceSection>
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
        <Footer>
          <FooterLinks>
            <FooterLink>서비스 이용약관</FooterLink>
            <FooterLink>개인정보 처리방침</FooterLink>
            <FooterLink>데이터 서비스 이용약관</FooterLink>
            <FooterLink>이용자 관리 및 운영사생</FooterLink>
          </FooterLinks>

          <FooterInfo>
            <LogoSection>
              <LogoIcon>😊</LogoIcon>
              <LogoText>똑터뷰</LogoText>
            </LogoSection>

            <FooterDetails>
              <FooterText>Team 똑쓰</FooterText>
              <FooterText>대표: 홍길수</FooterText>
              <FooterText>전화번호: 010-1234-5678</FooterText>
              <FooterText>이메일: plus@gmail.com</FooterText>
              <FooterCopyright>@Ddokterview ALL RIGHTS RESERVED</FooterCopyright>
            </FooterDetails>
          </FooterInfo>
        </Footer>
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
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${({ theme }) => theme.spacing.xl};
  max-width: 1400px;
  margin: ${({ theme }) => theme.spacing['4xl']} auto;
  padding: 0 ${({ theme }) => theme.spacing.xl};
`;

const PlanCard = styled.div`
  background-color: white;
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  padding: ${({ theme }) => theme.spacing['2xl']};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  border: 3px dashed ${({ theme }) => theme.colors.primary};
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    transform: translateY(-8px);
    box-shadow: ${({ theme }) => theme.shadows.xl};
  }
`;

const PlanHeader = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const PlanName = styled.h3`
  font-size: ${({ theme }) => theme.fonts.size['2xl']};
  font-weight: ${({ theme }) => theme.fonts.weight.bold};
  color: ${({ theme }) => theme.colors.text.dark};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const PlanDuration = styled.p`
  font-size: ${({ theme }) => theme.fonts.size.sm};
  color: ${({ theme }) => theme.colors.gray[600]};
`;

const Features = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const Feature = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  align-items: flex-start;
`;

const FeatureIcon = styled.span`
  flex-shrink: 0;
`;

const FeatureText = styled.p`
  font-size: ${({ theme }) => theme.fonts.size.sm};
  color: ${({ theme }) => theme.colors.text.dark};
  line-height: 1.5;
`;

const PriceSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: ${({ theme }) => theme.spacing.lg};
  border-top: 1px solid ${({ theme }) => theme.colors.gray[200]};
`;

const CharacterIcon = styled.div`
  font-size: ${({ theme }) => theme.fonts.size['4xl']};
`;

const PriceInfo = styled.div`
  text-align: right;
`;

const OriginalPrice = styled.p`
  font-size: ${({ theme }) => theme.fonts.size.sm};
  color: ${({ theme }) => theme.colors.gray[500]};
  text-decoration: line-through;
`;

const Price = styled.p`
  font-size: ${({ theme }) => theme.fonts.size['3xl']};
  font-weight: ${({ theme }) => theme.fonts.weight.bold};
  color: ${({ theme }) => theme.colors.primary};
`;

const Discount = styled.span`
  font-size: ${({ theme }) => theme.fonts.size.sm};
  color: ${({ theme }) => theme.colors.error};
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

const Footer = styled.footer`
  background-color: #000;
  padding: ${({ theme }) => theme.spacing['3xl']} ${({ theme }) => theme.spacing.xl};
  margin-top: ${({ theme }) => theme.spacing['4xl']};
`;

const FooterLinks = styled.div`
  display: flex;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.xl};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  flex-wrap: wrap;
`;

const FooterLink = styled.a`
  color: white;
  font-size: ${({ theme }) => theme.fonts.size.sm};
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

const FooterInfo = styled.div`
  text-align: center;
`;

const LogoSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const LogoIcon = styled.div`
  width: 40px;
  height: 40px;
  background-color: ${({ theme }) => theme.colors.secondary};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${({ theme }) => theme.fonts.size.xl};
`;

const LogoText = styled.span`
  font-size: ${({ theme }) => theme.fonts.size.xl};
  font-weight: ${({ theme }) => theme.fonts.weight.bold};
  color: white;
`;

const FooterDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const FooterText = styled.p`
  font-size: ${({ theme }) => theme.fonts.size.sm};
  color: ${({ theme }) => theme.colors.gray[400]};
`;

const FooterCopyright = styled.p`
  font-size: ${({ theme }) => theme.fonts.size.xs};
  color: ${({ theme }) => theme.colors.gray[500]};
  margin-top: ${({ theme }) => theme.spacing.md};
`;

export default Subscription;
