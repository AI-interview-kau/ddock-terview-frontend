import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Header from '../components/common/Header';
import Button from '../components/common/Button';
import { ReactComponent as Logo } from '../assets/icons/logo.svg';
import ddockTerview from '../assets/icons/ddock-terview.png';
import ddocksCharacter from '../assets/icons/ddocks.png';
import { useAuth } from '../contexts/AuthContext';
import { signup } from '../api/authService';

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
  const { login, user } = useAuth();
  const [showJobModal, setShowJobModal] = useState(false);
  const [formData, setFormData] = useState({
    id: '',
    password: '',
    confirmPassword: '',
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

  const handleSubmit = async () => {
    // 유효성 검사
    if (!formData.id || !formData.password || !formData.confirmPassword ||
        !formData.name || formData.jobCategories.length === 0 || !formData.currentStatus) {
      alert('모든 정보를 입력해주세요.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      // 회원가입 API 호출
      const response = await signup({
        id: formData.id,
        password: formData.password,
        name: formData.name,
        jobCategories: formData.jobCategories,
        currentStatus: formData.currentStatus,
      });

      alert('회원가입이 완료되었습니다!');
      // 회원가입 후 로그인 페이지로 이동
      navigate('/login');
    } catch (error) {
      console.error('Signup failed:', error);
      if (error.response?.status === 409) {
        alert('이미 존재하는 아이디입니다.');
      } else {
        alert('회원가입에 실패했습니다. 다시 시도해주세요.');
      }
    }
  };

  return (
    <Container>
      <Header />

      <CharacterSection>
        <CharacterImage src={ddocksCharacter} alt="똑터뷰 캐릭터" />
        <SpeechBubble>
          희망 직군에 따른
          <br />
          기출 질문이
          <br />
          제공됩니다!
        </SpeechBubble>
      </CharacterSection>

      <ContentWrapper>
        <FormWrapper>
            <CenterLogo>
              <CenterLogoIcon>
                <Logo />
              </CenterLogoIcon>
              <CenterDdockTerviewIcon src={ddockTerview} alt="똑터뷰" />
            </CenterLogo>

            <WelcomeText>똑터뷰 가입을 환영합니다!</WelcomeText>
            <Divider />

            <FormSection>
              <FormGroup>
                <Label>ID</Label>
                <Input
                  type="text"
                  name="id"
                  placeholder="아이디를 입력하세요"
                  value={formData.id}
                  onChange={handleChange}
                />
              </FormGroup>

              <FormGroup>
                <Label>비밀번호</Label>
                <Input
                  type="password"
                  name="password"
                  placeholder="비밀번호를 입력하세요"
                  value={formData.password}
                  onChange={handleChange}
                />
              </FormGroup>

              <FormGroup>
                <Label>비밀번호 확인</Label>
                <Input
                  type="password"
                  name="confirmPassword"
                  placeholder="비밀번호를 다시 입력하세요"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </FormGroup>

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
                <Input
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
                    $active={formData.currentStatus === '실무자'}
                    onClick={() => handleStatusClick('실무자')}
                  >
                    실무자
                  </StatusButton>
                  <StatusButton
                    type="button"
                    $active={formData.currentStatus === '학생'}
                    onClick={() => handleStatusClick('학생')}
                  >
                    학생
                  </StatusButton>
                  <StatusButton
                    type="button"
                    $active={formData.currentStatus === '무직'}
                    onClick={() => handleStatusClick('무직')}
                  >
                    무직
                  </StatusButton>
                </StatusGroup>
              </FormGroup>

              <SubmitButton onClick={handleSubmit}>
                똑터뷰 시작하기
              </SubmitButton>
            </FormSection>
          </FormWrapper>
        </ContentWrapper>

        {showJobModal && (
          <Modal>
            <ModalOverlay onClick={handleJobModalClose} />
            <ModalContent>
              <ModalTitle>희망 직군을 선택해주세요</ModalTitle>

              <JobSection>
                <JobSectionLabel>직군</JobSectionLabel>
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
              </JobSection>

              <ModalFooter>
                <ModalButton onClick={handleJobModalClose}>완료</ModalButton>
                <SkipText>필수 입력 항목입니다</SkipText>
              </ModalFooter>
            </ModalContent>
          </Modal>
        )}
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  background-color: ${({ theme }) => theme.colors.background};
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
`;

const ContentWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  width: 100%;
  padding: ${({ theme }) => theme.spacing['2xl']};
`;

const CharacterSection = styled.div`
  position: fixed;
  bottom: 100px;
  left: 50px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const CharacterImage = styled.img`
  width: 280px;
  height: auto;
`;

const SpeechBubble = styled.div`
  position: absolute;
  top: 40px;
  right: -220px;
  background-color: white;
  padding: ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing.xl};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  color: ${({ theme }) => theme.colors.text.dark};
  font-size: ${({ theme }) => theme.fonts.size.base};
  font-weight: ${({ theme }) => theme.fonts.weight.medium};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  white-space: nowrap;
  line-height: 1.6;

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

const FormWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.lg};
  max-width: 450px;
  width: 100%;
`;

const CenterLogo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

const CenterLogoIcon = styled.div`
  width: 120px;
  height: auto;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 100%;
    height: auto;
  }
`;

const CenterDdockTerviewIcon = styled.img`
  width: 140px;
  height: auto;
  object-fit: contain;
`;

const WelcomeText = styled.p`
  font-size: ${({ theme }) => theme.fonts.size.lg};
  font-weight: ${({ theme }) => theme.fonts.weight.medium};
  color: white;
  text-align: center;
`;

const Divider = styled.div`
  width: 120%;
  max-width: 600px;
  height: 1px;
  background-color: rgba(255, 255, 255, 0.8);
  margin: ${({ theme }) => theme.spacing.sm} 0 ${({ theme }) => theme.spacing.lg} 0;
`;

const FormSection = styled.div`
  width: 100%;
  max-width: 450px;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const Label = styled.label`
  font-size: ${({ theme }) => theme.fonts.size.base};
  font-weight: ${({ theme }) => theme.fonts.weight.medium};
  color: white;
`;

const Input = styled.input`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  background-color: white;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.fonts.size.base};
  color: ${({ theme }) => theme.colors.text.dark};

  &::placeholder {
    color: ${({ theme }) => theme.colors.gray[400]};
  }

  &:focus {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
  }
`;

const StatusGroup = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  background-color: white;
  padding: ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.md};
`;

const StatusButton = styled.button`
  flex: 1;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  background-color: transparent;
  color: #7C6FEE;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: ${({ theme }) => theme.fonts.size.base};
  font-weight: ${({ theme }) => theme.fonts.weight.medium};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};

  ${({ $active }) =>
    $active &&
    `
    background-color: #7C6FEE;
    color: white;
  `}

  &:hover {
    background-color: ${({ $active }) => ($active ? '#6B5FDD' : '#F3F1FF')};
  }
`;

const SubmitButton = styled.button`
  width: auto;
  min-width: 200px;
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing['2xl']};
  background: linear-gradient(90deg, #8973FF 0%, #7BA3FF 100%);
  color: white;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: ${({ theme }) => theme.fonts.size.lg};
  font-weight: ${({ theme }) => theme.fonts.weight.semibold};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  margin: ${({ theme }) => theme.spacing.xl} auto 0;
  display: block;

  &:hover {
    background: linear-gradient(90deg, #7A64EE 0%, #6A92EE 100%);
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.lg};
  }
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
  background-color: rgba(0, 0, 0, 0.7);
`;

const ModalContent = styled.div`
  position: relative;
  background-color: white;
  border-radius: ${({ theme }) => theme.borderRadius['2xl']};
  padding: ${({ theme }) => theme.spacing['3xl']};
  max-width: 700px;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: ${({ theme }) => theme.shadows.xl};
`;

const ModalTitle = styled.h3`
  font-size: ${({ theme }) => theme.fonts.size['2xl']};
  font-weight: ${({ theme }) => theme.fonts.weight.bold};
  color: #7C6FEE;
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing['2xl']};
`;

const JobSection = styled.div`
  background-color: ${({ theme }) => theme.colors.gray[50]};
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.xl};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const JobSectionLabel = styled.div`
  font-size: ${({ theme }) => theme.fonts.size.base};
  font-weight: ${({ theme }) => theme.fonts.weight.medium};
  color: ${({ theme }) => theme.colors.text.dark};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const JobGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
`;

const JobCheckbox = styled.label`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  cursor: pointer;

  input[type='checkbox'] {
    width: 16px;
    height: 16px;
    cursor: pointer;
    accent-color: #7C6FEE;
  }

  span {
    font-size: ${({ theme }) => theme.fonts.size.sm};
    color: ${({ theme }) => theme.colors.text.dark};
    white-space: nowrap;
  }
`;

const ModalFooter = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.lg};
`;

const ModalButton = styled.button`
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing['3xl']};
  background-color: #7C6FEE;
  color: white;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: ${({ theme }) => theme.fonts.size.base};
  font-weight: ${({ theme }) => theme.fonts.weight.semibold};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  min-width: 150px;

  &:hover {
    background-color: #6B5FDD;
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.lg};
  }
`;

const SkipText = styled.p`
  font-size: ${({ theme }) => theme.fonts.size.sm};
  color: ${({ theme }) => theme.colors.gray[400]};
`;

export default Onboarding;
