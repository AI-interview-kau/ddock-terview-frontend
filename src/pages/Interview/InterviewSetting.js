import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Layout from '../../components/common/Layout';
import Button from '../../components/common/Button';
import iconInterview from '../../assets/icons/icon_interview.png';
import starIcon from '../../assets/icons/Star.png';

const InterviewSetting = () => {
  const navigate = useNavigate();
  const [settings, setSettings] = useState({
    duration: '15:00',
    thinkingTime: '15',
    interviewerType: 'ai',
  });

  const handleStart = () => {
    navigate('/interview/progress');
  };

  return (
    <Layout isLoggedIn={true} userName="김똑쓰">
      <Container>
        <ContentWrapper>
          <SettingsSection>
            {/* 캐릭터 섹션 */}
            <CharacterSection>
              <CharacterIcon>
                <img src={iconInterview} alt="Interview Icon" />
              </CharacterIcon>
              <Sparkle1>
                <img src={starIcon} alt="Star" />
              </Sparkle1>
              <Sparkle2>
                <img src={starIcon} alt="Star" />
              </Sparkle2>
              <Sparkle3>
                <img src={starIcon} alt="Star" />
              </Sparkle3>
              <Sparkle4>
                <img src={starIcon} alt="Star" />
              </Sparkle4>
            </CharacterSection>

            {/* 면접 소요 시간 */}
            <SettingCard>
              <TopSection>
                <CardTitle>면접 소요 시간</CardTitle>
                <Select
                  value={settings.duration}
                  onChange={(e) =>
                    setSettings({ ...settings, duration: e.target.value })
                  }
                >
                  <option value="5:00">5:00</option>
                  <option value="10:00">10:00</option>
                  <option value="15:00">15:00</option>
                  <option value="20:00">20:00</option>
                  <option value="30:00">30:00</option>
                </Select>
              </TopSection>
              <InfoButton>
                면접 소요 시간을
                <br />
                선택해주세요!
                <br />
                맞춤드릴게요!
              </InfoButton>
              <SmallCharacter>
                <img src={iconInterview} alt="Interview Icon" />
              </SmallCharacter>
            </SettingCard>

            {/* 질문 확인 시간 */}
            <SettingCard>
              <TopSection>
                <CardTitle>질문 확인 시간</CardTitle>
                <Select
                  value={settings.thinkingTime}
                  onChange={(e) =>
                    setSettings({ ...settings, thinkingTime: e.target.value })
                  }
                >
                  <option value="5">5초</option>
                  <option value="10">10초</option>
                  <option value="15">15초</option>
                  <option value="20">20초</option>
                  <option value="30">30초</option>
                </Select>
              </TopSection>
              <InfoButton>
                질문을 확인하고
                <br />
                대답을 고민 후
                <br />
                시간을 알려주세요!
              </InfoButton>
              <SmallCharacter>
                <img src={iconInterview} alt="Interview Icon" />
              </SmallCharacter>
            </SettingCard>

            {/* 면접관 유형 선택 */}
            <SettingCard>
              <CardTitle>면접관 유형 선택</CardTitle>
              <InterviewerOptions>
                <InterviewerOption
                  active={settings.interviewerType === 'ai'}
                  onClick={() =>
                    setSettings({ ...settings, interviewerType: 'ai' })
                  }
                >
                  <OptionIcon>👨‍💼</OptionIcon>
                  <OptionLabel>AI 면접관</OptionLabel>
                </InterviewerOption>

                <InterviewerOption
                  active={settings.interviewerType === 'ddox'}
                  onClick={() =>
                    setSettings({ ...settings, interviewerType: 'ddox' })
                  }
                >
                  <OptionIcon>
                    <img src={iconInterview} alt="Interview Icon" />
                  </OptionIcon>
                  <OptionLabel>똑스</OptionLabel>
                </InterviewerOption>

                <InterviewerOption
                  active={settings.interviewerType === 'alone'}
                  onClick={() =>
                    setSettings({ ...settings, interviewerType: 'alone' })
                  }
                >
                  <OptionLabel>면접관 없이 하기</OptionLabel>
                </InterviewerOption>
              </InterviewerOptions>
            </SettingCard>
          </SettingsSection>
        </ContentWrapper>

        <StartButton size="large" onClick={handleStart}>
          시작하기
        </StartButton>
      </Container>
    </Layout>
  );
};

const Container = styled.div.attrs({ className: 'interview-setting-container' })`
  min-height: calc(100vh - 80px);
  background-color: #3E3655;
  padding: ${({ theme }) => theme.spacing['4xl']} ${({ theme }) => theme.spacing.xl};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing['3xl']};
`;

const ContentWrapper = styled.div.attrs({ className: 'content-wrapper' })`
  display: flex;
  gap: ${({ theme }) => theme.spacing['4xl']};
  align-items: center;
  justify-content: center;
  max-width: 1400px;
  width: 100%;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    flex-direction: column;
  }
`;

const CharacterSection = styled.div.attrs({ className: 'character-section' })`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  grid-column: 1;
  grid-row: 1;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-column: 1;
    grid-row: 1;
  }
`;

const CharacterIcon = styled.div.attrs({ className: 'character-icon' })`
  width: 300px;
  height: 300px;
  background: linear-gradient(135deg, #9B8FF5 0%, #7C6FEE 100%);
  border-radius: ${({ theme }) => theme.borderRadius.full};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 150px;
  box-shadow: ${({ theme }) => theme.shadows.xl};

  img {
    width: 200px;
    height: 200px;
    object-fit: contain;
  }
`;

const Sparkle1 = styled.div.attrs({ className: 'sparkle-1' })`
  position: absolute;
  top: 80px;
  right: -30px;

  img {
    width: 40px;
    height: 40px;
    object-fit: contain;
  }
`;

const Sparkle2 = styled.div.attrs({ className: 'sparkle-2' })`
  position: absolute;
  top: 20px;
  right: 80px;

  img {
    width: 30px;
    height: 30px;
    object-fit: contain;
  }
`;

const Sparkle3 = styled.div.attrs({ className: 'sparkle-3' })`
  position: absolute;
  bottom: 100px;
  right: -40px;

  img {
    width: 50px;
    height: 50px;
    object-fit: contain;
  }
`;

const Sparkle4 = styled.div.attrs({ className: 'sparkle-4' })`
  position: absolute;
  bottom: 60px;
  right: -10px;

  img {
    width: 30px;
    height: 30px;
    object-fit: contain;
  }
`;

const SettingsSection = styled.div.attrs({ className: 'settings-section' })`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing.xl};
  flex: 1;
  align-items: start;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
  }
`;

const SettingCard = styled.div.attrs({ className: 'setting-card' })`
  background-color: #E8F4FD;
  border-radius: ${({ theme }) => theme.borderRadius['2xl']};
  padding: ${({ theme }) => theme.spacing['2xl']} ${({ theme }) => theme.spacing.xl};
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  min-height: 280px;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-column: 1 !important;
    grid-row: auto !important;
  }
`;

const TopSection = styled.div.attrs({ className: 'top-section' })`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.sm};
  width: 100%;
`;

const CardTitle = styled.h3.attrs({ className: 'card-title' })`
  font-size: ${({ theme }) => theme.fonts.size.lg};
  font-weight: ${({ theme }) => theme.fonts.weight.bold};
  color: ${({ theme }) => theme.colors.text.dark};
`;

const InfoButton = styled.div.attrs({ className: 'info-bubble' })`
  position: relative;
  background-color: #3B9EFF;
  color: white;
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  font-size: ${({ theme }) => theme.fonts.size.sm};
  font-weight: ${({ theme }) => theme.fonts.weight.medium};
  line-height: 1.5;
  text-align: center;
  align-self: flex-end;
  margin-right: ${({ theme }) => theme.spacing.xl};

  &::after {
    content: '';
    position: absolute;
    bottom: -10px;
    right: 20px;
    width: 0;
    height: 0;
    border-left: 12px solid transparent;
    border-right: 12px solid transparent;
    border-top: 12px solid #3B9EFF;
  }
`;

const SmallCharacter = styled.div.attrs({ className: 'small-character' })`
  align-self: flex-end;
  margin-right: ${({ theme }) => theme.spacing.xl};

  img {
    width: 80px;
    height: 80px;
    object-fit: contain;
  }
`;

const Select = styled.select.attrs({ className: 'setting-select' })`
  width: 100%;
  max-width: 180px;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  background-color: white;
  border: 1px solid ${({ theme }) => theme.colors.gray[300]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.fonts.size.base};
  font-weight: ${({ theme }) => theme.fonts.weight.medium};
  color: ${({ theme }) => theme.colors.text.dark};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const InterviewerOptions = styled.div.attrs({ className: 'interviewer-options' })`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  width: 100%;
  align-items: flex-end;
`;

const InterviewerOption = styled.button.attrs({ className: 'interviewer-option' })`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  background-color: ${({ active }) => (active ? '#E8E0FF' : 'white')};
  border: 2px solid ${({ active }) => (active ? '#9B8FF5' : '#E0E0E0')};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  min-height: 50px;
  width: 200px;

  &:hover {
    border-color: #9B8FF5;
    background-color: #F5F0FF;
  }
`;

const OptionIcon = styled.div.attrs({ className: 'option-icon' })`
  font-size: ${({ theme }) => theme.fonts.size.xl};

  img {
    width: 32px;
    height: 32px;
    object-fit: contain;
  }
`;

const OptionLabel = styled.span.attrs({ className: 'option-label' })`
  font-size: ${({ theme }) => theme.fonts.size.base};
  font-weight: ${({ theme }) => theme.fonts.weight.semibold};
  color: ${({ theme }) => theme.colors.text.dark};
`;

const StartButton = styled(Button).attrs({ className: 'start-button' })`
  background-color: #9B8FF5;
  width: 100%;
  max-width: 500px;
  padding: ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing['2xl']};
  font-size: ${({ theme }) => theme.fonts.size.xl};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  align-self: flex-end;
  margin-right: ${({ theme }) => theme.spacing.xl};

  &:hover {
    background-color: #8B7FE5;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    align-self: center;
    margin-right: 0;
  }
`;

export default InterviewSetting;
