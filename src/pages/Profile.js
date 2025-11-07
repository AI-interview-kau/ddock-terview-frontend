import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Layout from '../components/common/Layout';
import Button from '../components/common/Button';
import { useAuth } from '../contexts/AuthContext';
import ddocksIcon from '../assets/icons/ddocks.png';
import { getUserProfile } from '../api/authService';
import { updateUserInfo } from '../api/userService';

const JOB_CATEGORIES = [
  '경영 기획', '회계 · 세무 · 재무', '인사', '행정 · 사무지원', '법무 · 감사',
  '설비 · 안전', '비서', '전기 · 전자 · 제어', '물류 · 자원관리',
  '디자인 · 고분석', '생산 · 의료 · 식품', '금융 · 자금기획',
  '안전', '기계 · 자동차 · 조선', '로봇', '에너지 · 환경',
  '순수 · 사회', '반도체·SW 기획', '기타연구 · 개발',
  '프론트엔드 개발', '백엔드 개발', 'iOS 개발', 'Android 개발', '인공지능 · 머신러닝',
  '플랫폼관리', '오픈라인 교육지원', '온라인 교육지원', '기타서비스',
  '빅데이터 엔지니어', '의료기가', '보건지원', '기타 · 자유 · 조선',
  '에너지·환경', '제조 ', '건축', '건설',
  '간호', '상담', '보험', '금융'
];

const STATUS_OPTIONS = [
  { label: '학생', value: 'STUDENT' },
  { label: '취업 준비중', value: 'PREPARING' }
];

const Profile = () => {
  const navigate = useNavigate();
  const { user, login } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    depart: '',
    status: '',
  });

  const [showJobModal, setShowJobModal] = useState(false);
  const [loading, setLoading] = useState(true);

  // 사용자 정보 조회
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const profile = await getUserProfile();
        setFormData({
          name: profile.name || '',
          depart: profile.depart || '',
          status: profile.status || '', // 이미 STUDENT, WORKER 등의 enum 값
        });
      } catch (error) {
        console.error('Failed to fetch user profile:', error);
        alert('사용자 정보를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDepartChange = (depart) => {
    setFormData((prev) => ({
      ...prev,
      depart: depart,
    }));
  };

  const handleStatusClick = (status) => {
    setFormData((prev) => ({
      ...prev,
      status: status,
    }));
  };

  const handleJobModalClose = () => {
    setShowJobModal(false);
  };

  const handleSubmit = async () => {
    // 유효성 검사
    if (!formData.name || !formData.depart || !formData.status) {
      alert('모든 정보를 입력해주세요.');
      return;
    }

    try {
      // 사용자 정보 수정 API 호출
      const response = await updateUserInfo({
        name: formData.name,
        depart: formData.depart,
        status: formData.status,
      });

      alert('정보가 수정되었습니다.');

      // AuthContext 업데이트
      login({
        ...user,
        name: response.name,
        depart: response.depart,
        status: response.status,
      });

      navigate('/');
    } catch (error) {
      console.error('Failed to update user info:', error);
      alert('정보 수정에 실패했습니다. 다시 시도해주세요.');
    }
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

  return (
    <Layout>
      <Container>
        <ContentCard>
          <ProfileSection>
            <ProfileImageWrapper>
              <ProfileImage src={ddocksIcon} alt="Profile" />
            </ProfileImageWrapper>
          </ProfileSection>

          <FormSection>
            <FormGroup>
              <Label>이름:</Label>
              <Input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="이름을 입력하세요"
              />
            </FormGroup>

            <FormGroup>
              <Label>희망 직군:</Label>
              <Input
                type="text"
                value={formData.depart}
                onClick={() => setShowJobModal(true)}
                readOnly
                placeholder="희망하는 직군을 선택해주세요"
              />
            </FormGroup>

            <FormGroup>
              <Label>현재 상태:</Label>
              <StatusButtonGroup>
                {STATUS_OPTIONS.map((statusOption) => (
                  <StatusButton
                    key={statusOption.value}
                    type="button"
                    $active={formData.status === statusOption.value}
                    onClick={() => handleStatusClick(statusOption.value)}
                  >
                    {statusOption.label}
                  </StatusButton>
                ))}
              </StatusButtonGroup>
            </FormGroup>

            <SubmitButton onClick={handleSubmit}>
              정보 수정하기
            </SubmitButton>
          </FormSection>
        </ContentCard>

        {/* 직군 선택 모달 */}
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
                        type="radio"
                        name="depart"
                        checked={formData.depart === category}
                        onChange={() => handleDepartChange(category)}
                      />
                      <span>{category}</span>
                    </JobCheckbox>
                  ))}
                </JobGrid>
              </JobSection>

              <ModalFooter>
                <ModalButton onClick={handleJobModalClose}>완료</ModalButton>
              </ModalFooter>
            </ModalContent>
          </Modal>
        )}
      </Container>
    </Layout>
  );
};

const Container = styled.div`
  min-height: calc(100vh - 80px);
  background-color: ${({ theme }) => theme.colors.background};
  padding: ${({ theme }) => theme.spacing['4xl']} ${({ theme }) => theme.spacing.xl};
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ContentCard = styled.div`
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.borderRadius['2xl']};
  padding: ${({ theme }) => theme.spacing['4xl']};
  max-width: 1000px;
  width: 100%;
  display: flex;
  gap: ${({ theme }) => theme.spacing['4xl']};
  align-items: center;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    flex-direction: column;
  }
`;

const ProfileSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const ProfileImageWrapper = styled.div`
  width: 280px;
  height: 280px;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  overflow: hidden;
  background: linear-gradient(135deg, #E8E0FF 0%, #D1C4E9 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: ${({ theme }) => theme.shadows.xl};
`;

const ProfileImage = styled.img`
  width: 200px;
  height: 200px;
  object-fit: contain;
`;

const FormSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xl};
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const Label = styled.label`
  font-size: ${({ theme }) => theme.fonts.size.lg};
  font-weight: ${({ theme }) => theme.fonts.weight.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const Input = styled.input`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  background-color: white;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.fonts.size.base};
  color: ${({ theme }) => theme.colors.text.dark};
  transition: border-color ${({ theme }) => theme.transitions.fast};

  &::placeholder {
    color: ${({ theme }) => theme.colors.gray[400]};
  }

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
    outline: none;
  }

  &:read-only {
    cursor: pointer;
    background-color: ${({ theme }) => theme.colors.gray[50]};
  }
`;

const StatusButtonGroup = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.sm};
`;

const StatusButton = styled.button`
  flex: 1;
  padding: ${({ theme }) => theme.spacing.md};
  background-color: ${({ $active }) => ($active ? '#7C6FEE' : 'white')};
  color: ${({ $active }) => ($active ? 'white' : '#7C6FEE')};
  border: 2px solid #7C6FEE;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.fonts.size.base};
  font-weight: ${({ theme }) => theme.fonts.weight.semibold};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    background-color: ${({ $active }) => ($active ? '#6B5FDD' : '#F3F1FF')};
  }
`;

const SubmitButton = styled(Button)`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.lg};
  background: linear-gradient(90deg, #8973FF 0%, #7BA3FF 100%);
  font-size: ${({ theme }) => theme.fonts.size.lg};
  font-weight: ${({ theme }) => theme.fonts.weight.semibold};
  margin-top: ${({ theme }) => theme.spacing.xl};

  &:hover {
    background: linear-gradient(90deg, #7A64EE 0%, #6A92EE 100%);
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
  z-index: 2;
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

export default Profile;
