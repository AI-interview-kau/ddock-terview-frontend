import apiClient from './axios';

/**
 * 면접 세션 관련 API
 */

/**
 * 면접 유형 선택 (실전 / 맞춤)
 * @param {string} interviewType - "CUSTOMIZED" 또는 "RESUME-BASED"
 * @returns {Promise} - 세션 정보
 */
export const createInterviewSession = async (interviewType) => {
  try {
    const response = await apiClient.post('/session', {
      interviewType: interviewType,
    });
    return response.data;
  } catch (error) {
    console.error('Failed to create interview session:', error);
    throw error;
  }
};

/**
 * 면접 세션 조회
 * @param {number} sessionId - 세션 ID
 * @returns {Promise} - 세션 정보
 */
export const getInterviewSession = async (sessionId) => {
  try {
    const response = await apiClient.get(`/session/${sessionId}`);
    return response.data;
  } catch (error) {
    console.error('Failed to get interview session:', error);
    throw error;
  }
};

/**
 * 면접 세션 목록 조회
 * @returns {Promise} - 세션 목록
 */
export const getInterviewSessions = async () => {
  try {
    const response = await apiClient.get('/session');
    return response.data;
  } catch (error) {
    console.error('Failed to get interview sessions:', error);
    throw error;
  }
};

/**
 * 질문 리스트 조회 (맞춤형 면접용)
 * @returns {Promise} - 카테고리별 질문 목록
 */
export const getQuestionList = async () => {
  try {
    const response = await apiClient.get('/questionlist');
    return response.data;
  } catch (error) {
    console.error('Failed to get question list:', error);
    throw error;
  }
};

/**
 * 질문 생성 (사용자 정의 질문)
 * @param {string} content - 질문 내용
 * @returns {Promise} - 생성된 질문 정보
 */
export const createQuestion = async (content) => {
  try {
    const response = await apiClient.post('/questions', {
      content: content,
    });
    return response.data;
  } catch (error) {
    console.error('Failed to create question:', error);
    throw error;
  }
};

/**
 * 질문 삭제 (내가 만든 질문)
 * @param {number} bqId - 질문 ID
 * @returns {Promise} - 삭제 결과
 */
export const deleteQuestion = async (bqId) => {
  try {
    const response = await apiClient.delete(`/questions/${bqId}`);
    return response.data;
  } catch (error) {
    console.error('Failed to delete question:', error);
    throw error;
  }
};

/**
 * 질문 찜하기
 * @param {Object} params - 찜할 질문 정보
 * @param {number|null} params.bqId - BaseQuestion ID (기본 질문 또는 내가 만든 질문)
 * @param {number|null} params.inqId - InterviewQuestion ID (면접 중 생성된 질문)
 * @returns {Promise} - 찜하기 결과
 */
export const saveQuestion = async ({ bqId = null, inqId = null }) => {
  try {
    const response = await apiClient.post('/savedQ', {
      bqId: bqId,
      inqId: inqId,
    });
    return response.data;
  } catch (error) {
    console.error('Failed to save question:', error);
    throw error;
  }
};

/**
 * 질문 찜 취소
 * @param {Object} params - 찜 해제할 질문 정보
 * @param {string} params.userId - 사용자 ID
 * @param {number|null} params.bqId - BaseQuestion ID
 * @param {number|null} params.inqId - InterviewQuestion ID
 * @returns {Promise} - 찜 취소 결과
 */
export const unsaveQuestion = async ({ userId, bqId = null, inqId = null }) => {
  try {
    const params = new URLSearchParams();
    params.append('userId', userId);
    if (bqId) params.append('bqId', bqId);
    if (inqId) params.append('inqId', inqId);

    const response = await apiClient.delete(`/savedQ?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error('Failed to unsave question:', error);
    throw error;
  }
};

/**
 * 찜한 질문 목록 조회
 * @returns {Promise} - 찜한 질문 목록
 */
export const getSavedQuestions = async () => {
  try {
    const response = await apiClient.get('/question/saved');
    return response.data;
  } catch (error) {
    console.error('Failed to get saved questions:', error);
    throw error;
  }
};

/**
 * 면접 답변 제출
 * @param {number} sessionId - 세션 ID
 * @param {number} questionId - 질문 ID
 * @param {string} answer - 답변 내용
 * @param {File} audioFile - 음성 파일 (선택)
 * @returns {Promise} - 제출 결과
 */
export const submitAnswer = async (sessionId, questionId, answer, audioFile = null) => {
  try {
    const formData = new FormData();
    formData.append('sessionId', sessionId);
    formData.append('questionId', questionId);
    formData.append('answer', answer);
    if (audioFile) {
      formData.append('audio', audioFile);
    }

    const response = await apiClient.post('/answer', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Failed to submit answer:', error);
    throw error;
  }
};

/**
 * 면접 피드백 조회
 * @param {number} sessionId - 세션 ID
 * @returns {Promise} - 피드백 정보
 */
export const getInterviewFeedback = async (sessionId) => {
  try {
    const response = await apiClient.get(`/feedback/${sessionId}`);
    return response.data;
  } catch (error) {
    console.error('Failed to get interview feedback:', error);
    throw error;
  }
};

/**
 * 자소서 업로드 및 분석
 * @param {File} file - 자소서 파일
 * @returns {Promise} - 분석 결과
 */
export const uploadResume = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post('/resume/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Failed to upload resume:', error);
    throw error;
  }
};

/**
 * 저장된 자소서 목록 조회
 * @returns {Promise} - 자소서 목록
 */
export const getResumes = async () => {
  try {
    const response = await apiClient.get('/resume');
    return response.data;
  } catch (error) {
    console.error('Failed to get resumes:', error);
    throw error;
  }
};

/**
 * 특정 자소서 조회
 * @param {number} resumeId - 자소서 ID
 * @returns {Promise} - 자소서 정보
 */
export const getResume = async (resumeId) => {
  try {
    const response = await apiClient.get(`/resume/${resumeId}`);
    return response.data;
  } catch (error) {
    console.error('Failed to get resume:', error);
    throw error;
  }
};

/**
 * 면접 시작 전 질문 선택 (맞춤형 - 자소서 없이)
 * @param {number} sessionId - 세션 ID
 * @param {Array<string>} questions - 선택한 질문 내용 배열
 * @returns {Promise} - 질문 등록 결과
 */
export const submitSelectedQuestions = async (sessionId, questions) => {
  try {
    const response = await apiClient.post(`/session/${sessionId}/questions`, {
      items: questions.map(content => ({ content }))
    });
    return response.data;
  } catch (error) {
    console.error('Failed to submit selected questions:', error);
    throw error;
  }
};

/**
 * STT 답변 저장
 * @param {number} inqId - 질문 ID (inq_id)
 * @param {string} answer - STT로 변환된 답변 텍스트
 * @returns {Promise} - 저장된 답변 정보
 */
export const saveAnswer = async (inqId, answer) => {
  try {
    const response = await apiClient.put(`/questionAfter/${inqId}`, {
      answer: answer,
    });
    return response.data;
  } catch (error) {
    console.error('Failed to save answer:', error);
    throw error;
  }
};

/**
 * 면접 중단 (세션 삭제)
 * @param {number} sessionId - 세션 ID
 * @returns {Promise} - 삭제 결과
 */
export const cancelInterview = async (sessionId) => {
  try {
    const response = await apiClient.delete(`/session/${sessionId}`);
    return response.data;
  } catch (error) {
    console.error('Failed to cancel interview:', error);
    throw error;
  }
};

/**
 * 질문 메모 조회
 * @param {string} questionId - 질문 ID (예: "B:12")
 * @returns {Promise} - 메모 정보
 */
export const getQuestionNote = async (questionId) => {
  try {
    const response = await apiClient.get(`/note/${questionId}`);
    return response.data;
  } catch (error) {
    console.error('Failed to get question note:', error);
    throw error;
  }
};

/**
 * 질문 메모 생성 및 수정
 * @param {string} questionId - 질문 ID (예: "B:12")
 * @param {string} content - 메모 내용
 * @returns {Promise} - 저장된 메모 정보
 */
export const updateQuestionNote = async (questionId, content) => {
  try {
    const response = await apiClient.put(`/note/${questionId}`, {
      content: content,
    });
    return response.data;
  } catch (error) {
    console.error('Failed to update question note:', error);
    throw error;
  }
};

/**
 * 질문별 피드백 상세 조회 (영상 + 행동별/언어별 피드백)
 * @param {number} sessionId - 세션 ID
 * @param {number} inqId - 질문 ID (QuestionAfter의 inq_id)
 * @returns {Promise} - 질문별 상세 피드백
 */
export const getQuestionFeedback = async (sessionId, inqId) => {
  try {
    const response = await apiClient.get(`/mylog/${sessionId}/question/${inqId}`);
    return response.data;
  } catch (error) {
    console.error('Failed to get question feedback:', error);
    throw error;
  }
};
