import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Layout from '../components/common/Layout';
import Button from '../components/common/Button';

// Import icons
import mainIcon from '../assets/icons/logo.png';
import ddockTerview from '../assets/icons/ddock-terview.png';
import svgLogo from '../assets/icons/svgLogo.svg';
import manIcon from '../assets/icons/man.png';
import womanIcon from '../assets/icons/woman.png';
import starIcon from '../assets/icons/Star.png';
import card2 from '../assets/icons/card-2.png';
import card3 from '../assets/icons/card-3.png';
import cloudIcon from '../assets/icons/cloud.png';
import cubeIcon from '../assets/icons/cube.png';
import cylinderIcon from '../assets/icons/cylinder.png';
import section1Bg from '../assets/icons/section_1.png';
import section2Bg from '../assets/icons/section_2.png';
import section2Bg2 from '../assets/icons/section_2 (2).png';
import section2Bg3 from '../assets/icons/section_2 (3).png';
import ddocksIcon from '../assets/icons/ddocks.png';
import yellowBalloon from '../assets/icons/yellow_balloon.png';
import circleIcon from '../assets/icons/circle.png';
import chainLink from '../assets/icons/chain-link.png';
import donutIcon from '../assets/icons/donut.png';
import signUpIcon from '../assets/icons/sign up.png';
import loginIcon from '../assets/icons/login.png';
import ticketIcon from '../assets/icons/lightPurpleTicket.png';
const Main = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      {/* Hero Section */}
      <HeroSection>
        <Star style={{ top: '10%', left: '15%' }} src={starIcon} alt="" />
        <Star style={{ top: '15%', right: '20%' }} src={starIcon} alt="" />
        <Star style={{ top: '60%', left: '10%' }} src={starIcon} alt="" />
        <Star style={{ bottom: '20%', right: '15%' }} src={starIcon} alt="" />
        <Star style={{ top: '25%', left: '25%' }} src={starIcon} alt="" />
        <Star style={{ top: '45%', right: '12%' }} src={starIcon} alt="" />
        <Star style={{ bottom: '35%', left: '20%' }} src={starIcon} alt="" />
        <Star style={{ top: '70%', right: '25%' }} src={starIcon} alt="" />

        <HeroContent>
          <LogoIcon src={svgLogo} alt="Logo" />
          {/* <HeroTitle src={ddockTerview} alt="똑터뷰" /> */}
          <HeroSubtitle>반짝반짝 빛날 당신의 앞날을 응원해요</HeroSubtitle>

          <CharacterWrapper>
            <CharacterWithBalloon style={{ position: 'absolute', bottom: '20px', left: '15%' }}>
              <CharacterIcon $small $flipped src={ddocksIcon} alt="Ddocks character" />
              <Balloon $small $flipped src={yellowBalloon} alt="" />
            </CharacterWithBalloon>
            <CharacterWithBalloon style={{ position: 'absolute', top: '80px', right: '10%' }}>
              <CharacterIcon src={ddocksIcon} alt="Ddocks character" />
              <Balloon src={yellowBalloon} alt="" />
            </CharacterWithBalloon>
          </CharacterWrapper>
        </HeroContent>
      </HeroSection>

      {/* Combined Section with Multiple Backgrounds */}
      <CombinedSection>
        {/* Part 1: Value Proposition + Features */}
        <SectionPart1>
          <DecorativeObject style={{ top: '5%', left: '2%', width: '80px' }} src={cubeIcon} alt="" />
          <DecorativeObject style={{ top: '30%', left: '1%', width: '60px', opacity: 0.6 }} src={circleIcon} alt="" />
          <DecorativeObject style={{ top: '50%', left: '3%', width: '80px', opacity: 0.4 }} src={circleIcon} alt="" />
          <DecorativeObject style={{ top: '5%', left: '25%', width: '100px' }} src={donutIcon} alt="" />
          <DecorativeObject style={{ top: '8%', right: '5%', width: '90px' }} src={chainLink} alt="" />
          <DecorativeObject style={{ top: '15%', right: '2%', width: '70px' }} src={cylinderIcon} alt="" />
          <DecorativeObject style={{ top: '40%', right: '1%', width: '90px' }} src={cylinderIcon} alt="" />

          <SectionTitle>
            <TitleText>면접 준비를 혼자 하려니 막막하지 않으셨나요?</TitleText>
          </SectionTitle>
          <ValueSubtitle>
            나에게 다가온 소중한 면접 기회, 최선을 다해서 연습해보고 싶다는 마음이 들어요.
          </ValueSubtitle>

          <ValueCards>
            <ValueCard>
              <CardTitle>반복적으로 말하기를 할 수 없는 환경</CardTitle>
            </ValueCard>
            <ValueCard>
              <CardTitle>부족한 면접관련 자료</CardTitle>
            </ValueCard>
            <ValueCard>
              <CardTitle>충분하지 않은 피드백</CardTitle>
            </ValueCard>
          </ValueCards>

          <FeatureCard>
            <FeatureTitle>
              우리는 이런 <Highlight>면접준비가 필요한 사람</Highlight>들,<br />
              세상의 모든 <Highlight>"똑쓰"</Highlight> 들을 위한 사이트를 만들기로 했습니다.
            </FeatureTitle>
          </FeatureCard>

          <FeatureGrid>
            <FeatureItem>
              <FeatureTag>면접 과정 이후</FeatureTag>
              <FeatureLabel>내가 연습한 영상 확인 가능</FeatureLabel>
              <FeatureText>
                면접을 진행하면서 촬영된 영상을 다시<br />
                확인할 수 있습니다. 해당 영상을<br />
                기반으로 피드백 또한 제공됩니다.
              </FeatureText>
              <FeatureImage src={card2} alt="Feature illustration" />
            </FeatureItem>
            <FeatureItem>
              <FeatureTag>면접 도중 및 마무리</FeatureTag>
              <FeatureLabel>지속적인 피드백 제공</FeatureLabel>
              <FeatureText>
                면접을 진행하면서 혹은 다 끝나고 난 뒤, <br />
                지속적이고 정확한 피드백을 제공해줍니다.
              </FeatureText>
              <FeatureImage src={card3} alt="Feature illustration" />
            </FeatureItem>
            <FeatureItem>
              <FeatureTag>우리 똑스는 !</FeatureTag>
              <FeatureLabel>자기소개서 기반 면접 질문 생성</FeatureLabel>
              <FeatureText>
                내 자기소개서에서 나올 수 있는<br />
                예상 질문을 확인하고,<br />
                나만을 위한 맞춤형 면접 질문을 받아보세요.
              </FeatureText>
              <CharacterGroup>
                <CharacterImage src={womanIcon} alt="Woman character" />
                <CharacterImage src={manIcon} alt="Man character" />
              </CharacterGroup>
            </FeatureItem>
          </FeatureGrid>
        </SectionPart1>

        {/* Part 2: Oval/Ellipse overlay */}
        <SectionPart2>
          <Star style={{ top: '10%', left: '15%' }} src={starIcon} alt="" />
          <Star style={{ top: '15%', right: '20%' }} src={starIcon} alt="" />
          <Star style={{ bottom: '30%', left: '12%' }} src={starIcon} alt="" />
          <Star style={{ bottom: '25%', right: '15%' }} src={starIcon} alt="" />
          <Star style={{ top: '25%', left: '8%' }} src={starIcon} alt="" />
          <Star style={{ top: '50%', right: '10%' }} src={starIcon} alt="" />
          <Star style={{ bottom: '40%', left: '18%' }} src={starIcon} alt="" />
          <Star style={{ top: '40%', right: '25%' }} src={starIcon} alt="" />

          <DecorativeObject style={{ top: '8%', left: '5%', width: '70px' }} src={cubeIcon} alt="" />
          <DecorativeObject style={{ top: '20%', right: '8%', width: '80px' }} src={cylinderIcon} alt="" />
          <DecorativeObject style={{ bottom: '15%', left: '10%', width: '90px' }} src={donutIcon} alt="" />
          <DecorativeObject style={{ top: '35%', left: '3%', width: '60px', opacity: 0.7 }} src={circleIcon} alt="" />
          <DecorativeObject style={{ bottom: '35%', right: '5%', width: '75px' }} src={chainLink} alt="" />
          <DecorativeObject style={{ top: '60%', right: '15%', width: '65px', opacity: 0.6 }} src={circleIcon} alt="" />
          <DecorativeObject style={{ bottom: '50%', left: '20%', width: '70px' }} src={cubeIcon} alt="" />
          <DecorativeObject style={{ top: '70%', left: '8%', width: '55px' }} src={cylinderIcon} alt="" />

          <DdocksCharacter src={ddocksIcon} alt="Ddocks character" />
        </SectionPart2>

        {/* Part 3: Bottom section */}
        <SectionPart3>
          {/* Content for third part if needed */}
        </SectionPart3>
      </CombinedSection>

      {/* Subscription Plans Section */}
      <SubscriptionSection>
        <SectionTitle>똑쓰들을 위한 노력은 계속됩니다.</SectionTitle>

        <PlanCards>
          <PlanCard onClick={() => navigate('/onboarding')}>
            <PlanIcon src={signUpIcon} alt="Sign Up" />
            <PlanTitle>회원가입 하러가기</PlanTitle>
          </PlanCard>
          <PlanCard onClick={() => navigate('/login')}>
            <PlanIcon src={loginIcon} alt="Login" />
            <PlanTitle>로그인 하러가기</PlanTitle>
          </PlanCard>
          <PlanCard onClick={() => navigate('/subscription')}>
            <PlanIcon src={ticketIcon} alt="Ticket" />
            <PlanTitle>이용권 보러가기</PlanTitle>
          </PlanCard>
        </PlanCards>
      </SubscriptionSection>

      {/* Footer */}
      <Footer>
        <FooterLinks>
          <FooterLink href="#">서비스 이용약관</FooterLink>
          <FooterLink href="#">개인정보 처리방침</FooterLink>
          <FooterLink href="#">데이터 서비스 이용약관</FooterLink>
          <FooterLink href="#">이용자 관리 및 운영사생</FooterLink>
        </FooterLinks>

        <FooterContent>
          <FooterInfo>
            <LogoIcon $small src={mainIcon} alt="Logo" />
            <LogoText src={ddockTerview} alt="똑터뷰" />
          </FooterInfo>

          <FooterDetails>
            <FooterText>Team 똑쓰</FooterText>
            <FooterText>대표: 홍길수</FooterText>
            <FooterText>전화번호: 010-1234-5678</FooterText>
            <FooterText>이메일: plus@gmail.com</FooterText>
            <FooterCopyright>@Ddokterview ALL RIGHTS RESERVED</FooterCopyright>
          </FooterDetails>
        </FooterContent>
      </Footer>
    </Layout>
  );
};

// Styled Components
const HeroSection = styled.section.attrs({ className: 'hero-section' })`
  background: url(${section1Bg}) center/cover no-repeat;
  padding: ${({ theme }) => theme.spacing['4xl']} ${({ theme }) => theme.spacing.xl};
  text-align: center;
  position: relative;
  min-height: 600px;
`;

const HeroContent = styled.div.attrs({ className: 'hero-content' })`
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
`;

const Star = styled.img.attrs({ className: 'star-icon' })`
  position: absolute;
  width: 30px;
  height: 30px;
  object-fit: contain;
`;

const LogoIcon = styled.img.attrs({ className: 'logo-icon' })`
  width: ${({ $small }) => ($small ? '40px' : '450px')};
  height: ${({ $small }) => ($small ? '40px' : '160px')};
  object-fit: contain;
  margin-bottom: ${({ $small }) => ($small ? '0' : '20px')};
`;

const HeroTitle = styled.img.attrs({ className: 'hero-title' })`
  height: 120px;
  object-fit: contain;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const HeroSubtitle = styled.p.attrs({ className: 'hero-subtitle' })`
  font-size: ${({ theme }) => theme.fonts.size.xl};
  color: white;
  margin-bottom: ${({ theme }) => theme.spacing['3xl']};
`;

const CharacterWrapper = styled.div.attrs({ className: 'character-wrapper' })`
  position: relative;
  width: 100%;
  height: 400px;
  margin-top: ${({ theme }) => theme.spacing['3xl']};
`;

const CharacterWithBalloon = styled.div.attrs({ className: 'character-with-balloon' })`
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const CharacterIcon = styled.img.attrs({ className: 'character-icon' })`
  width: ${({ $small }) => ($small ? '120px' : '180px')};
  height: ${({ $small }) => ($small ? '120px' : '180px')};
  object-fit: contain;
  position: relative;
  z-index: 2;
  transform: ${({ $flipped }) => ($flipped ? 'scaleX(-1)' : 'none')};
`;

const Balloon = styled.img.attrs({ className: 'balloon' })`
  width: ${({ $small }) => ($small ? '150px' : '220px')};
  height: ${({ $small }) => ($small ? '150px' : '220px')};
  object-fit: contain;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -10%) ${({ $flipped }) => ($flipped ? 'scaleX(-1)' : '')};
  z-index: 1;
`;

const CombinedSection = styled.section.attrs({ className: 'combined-section' })`
  position: relative;
`;

const SectionPart1 = styled.div.attrs({ className: 'section-part-1' })`
  background: #2E2845;
  padding: ${({ theme }) => theme.spacing['4xl']} ${({ theme }) => theme.spacing.xl};
  text-align: center;
  position: relative;
  min-height: 1200px;
  padding-bottom: 200px;
  z-index: 5;
`;

const DecorativeObject = styled.img.attrs({ className: 'decorative-object' })`
  position: absolute;
  object-fit: contain;
  pointer-events: none;
`;

const FeatureGrid = styled.div.attrs({ className: 'feature-grid' })`
  display: flex;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.xl};
  max-width: 1200px;
  margin: 0 auto;
  position: relative;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    flex-direction: column;
    align-items: center;
  }
`;

const SectionPart2 = styled.div.attrs({ className: 'section-part-2' })`
  background: linear-gradient(180deg,
    rgba(46, 40, 69, 0.95) 0%,
    rgba(46, 40, 69, 0.9) 50%,
    rgba(74, 65, 100, 0.85) 75%,
    rgba(90, 80, 117, 0.8) 100%
  );
  border-radius: 50% / 35%;
  position: relative;
  margin: -280px 0 0;
  width: 100%;
  min-height: 850px;
  z-index: 1;
  padding: ${({ theme }) => theme.spacing['4xl']} ${({ theme }) => theme.spacing.xl};
  padding-top: 200px;
  text-align: center;
  box-shadow: 0 10px 50px rgba(0, 0, 0, 0.3);

  ${FeatureGrid} {
    max-width: 800px;
    margin: 0 auto;
    padding-top: ${({ theme }) => theme.spacing['2xl']};
    position: relative;
    z-index: 2;
  }

  ${Star} {
    position: relative;
    z-index: 2;
  }
`;

const DdocksCharacter = styled.img.attrs({ className: 'ddocks-character' })`
  width: 200px;
  height: 200px;
  object-fit: contain;
  position: absolute;
  bottom: 80px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2;
`;

const SectionPart3 = styled.div.attrs({ className: 'section-part-3' })`
  background: url(${section2Bg3}) center/cover no-repeat;
  background-size: 100% auto;
  background-position: center top;
  padding: ${({ theme }) => theme.spacing['4xl']} ${({ theme }) => theme.spacing.xl};
  position: relative;
  margin-top: -200px;
  min-height: 500px;
`;

const SectionTitle = styled.h2.attrs({ className: 'section-title' })`
  font-size: ${({ theme }) => theme.fonts.size['3xl']};
  font-weight: ${({ theme }) => theme.fonts.weight.bold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

const TitleIcon = styled.img.attrs({ className: 'title-icon' })`
  width: 40px;
  height: 40px;
  object-fit: contain;
`;

const TitleText = styled.span.attrs({ className: 'title-text' })``;

const ValueSubtitle = styled.p.attrs({ className: 'value-subtitle' })`
  font-size: ${({ theme }) => theme.fonts.size.lg};
  color: ${({ theme }) => theme.colors.text.secondary};
  max-width: 800px;
  margin: 0 auto ${({ theme }) => theme.spacing['3xl']};
`;

const ValueCards = styled.div.attrs({ className: 'value-cards' })`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${({ theme }) => theme.spacing.xl};
  max-width: 1200px;
  margin: 0 auto ${({ theme }) => theme.spacing['4xl']};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
  }
`;

const ValueCard = styled.div.attrs({ className: 'value-card' })`
  background-color: white;
  padding: ${({ theme }) => theme.spacing['3xl']};
  border-radius: 50%;
  aspect-ratio: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow: ${({ theme }) => theme.shadows.lg};
`;

const CardIcon = styled.img.attrs({ className: 'card-icon' })`
  width: 80px;
  height: 80px;
  object-fit: contain;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const CardTitle = styled.h3.attrs({ className: 'card-title' })`
  font-size: ${({ theme }) => theme.fonts.size.lg};
  font-weight: ${({ theme }) => theme.fonts.weight.semibold};
  color: ${({ theme }) => theme.colors.text.dark};
`;

const FeatureCard = styled.div.attrs({ className: 'feature-card' })`
  max-width: 800px;
  margin: 0 auto ${({ theme }) => theme.spacing['3xl']};
  text-align: center;
`;

const FeatureTitle = styled.h2.attrs({ className: 'feature-title' })`
  font-size: ${({ theme }) => theme.fonts.size['2xl']};
  font-weight: ${({ theme }) => theme.fonts.weight.bold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const Highlight = styled.span.attrs({ className: 'highlight' })`
  color: ${({ theme }) => theme.colors.primary};
  font-weight: ${({ theme }) => theme.fonts.weight.bold};
`;

const FeatureDescription = styled.p.attrs({ className: 'feature-description' })`
  font-size: ${({ theme }) => theme.fonts.size.lg};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const FeatureItem = styled.div.attrs({ className: 'feature-item' })`
  background-color: #3A3154;
  padding: ${({ theme }) => theme.spacing['2xl']};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  text-align: left;
  min-height: 450px;
  display: flex;
  flex-direction: column;
  max-width: 350px;
`;

const FeatureTag = styled.div.attrs({ className: 'feature-tag' })`
  font-size: ${({ theme }) => theme.fonts.size.sm};
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  font-weight: ${({ theme }) => theme.fonts.weight.medium};
`;

const FeatureLabel = styled.h3.attrs({ className: 'feature-label' })`
  font-size: ${({ theme }) => theme.fonts.size.xl};
  font-weight: ${({ theme }) => theme.fonts.weight.bold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const FeatureText = styled.p.attrs({ className: 'feature-text' })`
  font-size: ${({ theme }) => theme.fonts.size.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
  line-height: 1.6;
`;

const FeatureImage = styled.img.attrs({ className: 'feature-image' })`
  width: 100%;
  max-width: 300px;
  height: 180px;
  margin-top: ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  object-fit: cover;
`;

const CharacterGroup = styled.div.attrs({ className: 'character-group' })`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.lg};
  justify-content: center;
  width: 100%;
  max-width: 300px;
  height: 180px;
  align-items: center;
`;

const CharacterImage = styled.img.attrs({ className: 'character-image' })`
  width: 130px;
  height: 130px;
  object-fit: contain;
`;

const SubscriptionSection = styled.section.attrs({ className: 'subscription-section' })`
  background: linear-gradient(180deg, #7C6FEE 0%, #9B8FF5 100%);
  padding: ${({ theme }) => theme.spacing['4xl']} ${({ theme }) => theme.spacing.xl};
  text-align: center;

  ${SectionTitle} {
    color: white;
  }
`;

const PlanCards = styled.div.attrs({ className: 'plan-cards' })`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${({ theme }) => theme.spacing.xl};
  max-width: 1200px;
  margin: ${({ theme }) => theme.spacing['3xl']} auto 0;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
  }
`;

const PlanCard = styled.div.attrs({ className: 'plan-card' })`
  background-color: white;
  padding: ${({ theme }) => theme.spacing['3xl']};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  display: flex;
  flex-direction: column-reverse;
  align-items: center;
  justify-content: flex-start;
  gap: ${({ theme }) => theme.spacing.xl};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    transform: translateY(-8px);
    box-shadow: ${({ theme }) => theme.shadows.xl};
  }
`;

const PlanIcon = styled.img.attrs({ className: 'plan-icon' })`
  width: 240px;
  height: 250px;
  object-fit: contain;
`;

const PlanTitle = styled.h3.attrs({ className: 'plan-title' })`
  font-size: ${({ theme }) => theme.fonts.size.lg};
  font-weight: ${({ theme }) => theme.fonts.weight.semibold};
  color: ${({ theme }) => theme.colors.text.dark};
`;

const Footer = styled.footer.attrs({ className: 'footer' })`
  background-color: #000;
  padding: ${({ theme }) => theme.spacing['3xl']} ${({ theme }) => theme.spacing.xl};
  color: white;
`;

const FooterLinks = styled.div.attrs({ className: 'footer-links' })`
  display: flex;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.xl};
  margin-bottom: ${({ theme }) => theme.spacing['2xl']};
  flex-wrap: wrap;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
`;

const FooterLink = styled.a.attrs({ className: 'footer-link' })`
  color: white;
  font-size: ${({ theme }) => theme.fonts.size.sm};
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const FooterContent = styled.div.attrs({ className: 'footer-content' })`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.xl};
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
`;

const FooterInfo = styled.div.attrs({ className: 'footer-info' })`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

const LogoText = styled.img.attrs({ className: 'logo-text' })`
  height: 24px;
  object-fit: contain;
`;

const FooterDetails = styled.div.attrs({ className: 'footer-details' })`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const FooterText = styled.p.attrs({ className: 'footer-text' })`
  font-size: ${({ theme }) => theme.fonts.size.sm};
  color: ${({ theme }) => theme.colors.gray[400]};
`;

const FooterCopyright = styled.p.attrs({ className: 'footer-copyright' })`
  font-size: ${({ theme }) => theme.fonts.size.xs};
  color: ${({ theme }) => theme.colors.gray[500]};
  margin-top: ${({ theme }) => theme.spacing.md};
`;

export default Main;
