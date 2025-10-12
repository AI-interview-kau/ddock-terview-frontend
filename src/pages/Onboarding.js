import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Layout from '../components/common/Layout';
import Button from '../components/common/Button';

const JOB_CATEGORIES = [
  '경영 기획', '회계 · 세무 · 재무', '인사', '행정 · 사무지원', '법무 · 감사',
  '설비 · 안전', '비서', '전기 · 전자 · 제어', '물류 · 자원관리',
  '디자인 · 고분석', '생산 · 의료 · 식품', '금융 · 자금기획',
  '안전', '기계 · 자동차 · 조선', '로봇', '에너지 · 환경',
  '순수 · 사회', '반도체·SW 기획', '기타연구 · 개발',
  '프론트엔드 개발', '백엔드 개발', 'iOS 개발', 'Android 개발', '인공지능 · 머신러닝',
  '플랫폼관리', '오픈라인 교육지원', '온라인 교육지원', '기타서비스',
  '빅데이터 엔지니어', '의료기가', '보건지원',  '기타 · 자유 · 조선',
  '에너지·환경', '제조 ', '건축', '건설',
  '간호', '상담', '보험', '금융'
];

const Onboarding = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [showJobModal, setShowJobModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    jobCategories: [],
    currentStatus: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleJobCategoryToggle = (category) => {
    setFormData((prev) => ({
      ...prev,
      jobCategories: prev.jobCategories.includes(category)
        ? prev.jobCategories.filter((c) => c !== category)
        : [...prev.jobCategories, category],
    }));
  };

  const handleStatusClick = (status) => {
    setFormData((prev) => ({
      ...prev,
      currentStatus: status,
    }));
  };

  const handleJobModalClose = () => {
    setShowJobModal(false);
  };

  const handleSubmit = () => {
    // 온보딩 완료
    navigate('/');
  };

  return (
    <Layout showHeader={false}>
      <Container>
        <Logo>
          <LogoIcon>😊</LogoIcon>
          <LogoText>똑터뷰</LogoText>
        </Logo>

        <OnboardingBox>
          <Character>
            <CharacterIcon>🤖</CharacterIcon>
            <SpeechBubble>
              희망 직군에 따른
              <br />
              기출 질문이
              <br />
              제공됩니다!
            </SpeechBubble>
          </Character>

          <FormSection>
            <Title>똑터뷰 가입을 환영합니다!</Title>

            <FormGroup>
              <Label>이름</Label>
              <Input
                type="text"
                name="name"
                placeholder="이루피"
                value={formData.name}
                onChange={handleChange}
              />
            </FormGroup>

            <FormGroup>
              <Label>희망 직군</Label>
              <JobInput
                type="text"
                placeholder="희망하는 직군을 선택해세요 !"
                value={formData.jobCategories.join(', ')}
                onClick={() => setShowJobModal(true)}
                readOnly
              />
            </FormGroup>

            <FormGroup>
              <Label>현재 상태</Label>
              <StatusGroup>
                <StatusButton
                  type="button"
                  active={formData.currentStatus === '실무자'}
                  onClick={() => handleStatusClick('실무자')}
                >
                  실무자
                </StatusButton>
                <StatusButton
                  type="button"
                  active={formData.currentStatus === '학생'}
                  onClick={() => handleStatusClick('학생')}
                >
                  학생
                </StatusButton>
                <StatusButton
                  type="button"
                  active={formData.currentStatus === '무직'}
                  onClick={() => handleStatusClick('무직')}
                >
                  무직
                </StatusButton>
              </StatusGroup>
            </FormGroup>

            <SubmitButton fullWidth onClick={handleSubmit}>
              똑터뷰 시작하기
            </SubmitButton>
          </FormSection>
        </OnboardingBox>

        {/* 직군 선택 모달 */}
        {showJobModal && (
          <Modal>
            <ModalOverlay onClick={handleJobModalClose} />
            <ModalContent>
              <ModalHeader>
                <ModalTitle>희망 직군을 선택해주세요</ModalTitle>
                <CloseButton onClick={handleJobModalClose}>×</CloseButton>
              </ModalHeader>

              <JobGrid>
                {JOB_CATEGORIES.map((category) => (
                  <JobCheckbox key={category}>
                    <input
                      type="checkbox"
                      checked={formData.jobCategories.includes(category)}
                      onChange={() => handleJobCategoryToggle(category)}
                    />
                    <span>{category}</span>
                  </JobCheckbox>
                ))}
              </JobGrid>

              <ModalFooter>
                <ModalButton onClick={handleJobModalClose}>완료</ModalButton>
                <SkipText>필수 입력 항목입니다</SkipText>
              </ModalFooter>
            </ModalContent>
          </Modal>
        )}
      </Container>
    </Layout>
  );
};

const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  background-color: ${({ theme }) => theme.colors.background};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.xl};
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing['2xl']};
`;

const LogoIcon = styled.div`
  width: 64px;
  height: 64px;
  background-color: ${({ theme }) => theme.colors.secondary};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${({ theme }) => theme.fonts.size['3xl']};
`;

const LogoText = styled.span`
  font-size: ${({ theme }) => theme.fonts.size['3xl']};
  font-weight: ${({ theme }) => theme.fonts.weight.bold};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const OnboardingBox = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing['3xl']};
  align-items: center;
  max-width: 1000px;
`;

const Character = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const CharacterIcon = styled.div`
  width: 200px;
  height: 200px;
  background: linear-gradient(135deg, #9B8FF5 0%, #7C6FEE 100%);
  border-radius: ${({ theme }) => theme.borderRadius.full};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 100px;
  box-shadow: ${({ theme }) => theme.shadows.xl};
`;

const SpeechBubble = styled.div`
  position: absolute;
  top: -40px;
  left: 220px;
  background-color: white;
  padding: ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  color: ${({ theme }) => theme.colors.text.dark};
  font-size: ${({ theme }) => theme.fonts.size.base};
  font-weight: ${({ theme }) => theme.fonts.weight.medium};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  white-space: nowrap;

  &::before {
    content: '';
    position: absolute;
    left: -10px;
    top: 50%;
    transform: translateY(-50%);
    width: 0;
    height: 0;
    border-top: 10px solid transparent;
    border-bottom: 10px solid transparent;
    border-right: 10px solid white;
  }
`;

const FormSection = styled.div`
  background-color: white;
  padding: ${({ theme }) => theme.spacing['3xl']};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  min-width: 500px;
  box-shadow: ${({ theme }) => theme.shadows.lg};
`;

const Title = styled.h2`
  font-size: ${({ theme }) => theme.fonts.size['2xl']};
  font-weight: ${({ theme }) => theme.fonts.weight.bold};
  color: ${({ theme }) => theme.colors.primary};
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing['2xl']};
`;

const FormGroup = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const Label = styled.label`
  display: block;
  font-size: ${({ theme }) => theme.fonts.size.base};
  font-weight: ${({ theme }) => theme.fonts.weight.semibold};
  color: ${({ theme }) => theme.colors.text.dark};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const Input = styled.input`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  background-color: white;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.fonts.size.base};
  color: ${({ theme }) => theme.colors.text.dark};

  &::placeholder {
    color: ${({ theme }) => theme.colors.gray[400]};
  }

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const JobInput = styled(Input)`
  cursor: pointer;
  background-color: ${({ theme }) => theme.colors.gray[50]};
`;

const StatusGroup = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
`;

const StatusButton = styled.button`
  flex: 1;
  padding: ${({ theme }) => theme.spacing.md};
  background-color: ${({ active, theme }) =>
    active ? theme.colors.primary : 'white'};
  color: ${({ active, theme }) =>
    active ? 'white' : theme.colors.text.dark};
  border: 2px solid ${({ active, theme }) =>
    active ? theme.colors.primary : theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.fonts.size.base};
  font-weight: ${({ theme }) => theme.fonts.weight.medium};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const SubmitButton = styled(Button)`
  margin-top: ${({ theme }) => theme.spacing.xl};
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

const ModalContent = styled.div`
  position: relative;
  background-color: white;
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  padding: ${({ theme }) => theme.spacing['2xl']};
  max-width: 800px;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: ${({ theme }) => theme.shadows.xl};
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const ModalTitle = styled.h3`
  font-size: ${({ theme }) => theme.fonts.size.xl};
  font-weight: ${({ theme }) => theme.fonts.weight.bold};
  color: ${({ theme }) => theme.colors.primary};
`;

const CloseButton = styled.button`
  font-size: ${({ theme }) => theme.fonts.size['3xl']};
  color: ${({ theme }) => theme.colors.gray[600]};
  background: none;
  border: none;
  cursor: pointer;
  line-height: 1;

  &:hover {
    color: ${({ theme }) => theme.colors.gray[800]};
  }
`;

const JobGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const JobCheckbox = styled.label`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  cursor: pointer;

  input[type='checkbox'] {
    width: 18px;
    height: 18px;
    cursor: pointer;
    accent-color: ${({ theme }) => theme.colors.primary};
  }

  span {
    font-size: ${({ theme }) => theme.fonts.size.sm};
    color: ${({ theme }) => theme.colors.text.dark};
  }
`;

const ModalFooter = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

const ModalButton = styled(Button)`
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing['3xl']};
`;

const SkipText = styled.p`
  font-size: ${({ theme }) => theme.fonts.size.sm};
  color: ${({ theme }) => theme.colors.gray[500]};
`;

export default Onboarding;
