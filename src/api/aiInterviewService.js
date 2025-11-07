/**
 * AI 면접 진행 서버 API (Phase 2)
 * Base URL: https://ddockterview-api-299282571203.us-central1.run.app
 */

import { playAudioFromBase64 } from '../utils/audioPlayer';

// 임시: 직접 호출로 프록시 문제 확인
// 개발 환경: 프록시 사용 (/ai-api)
// 프로덕션: 실제 서버 URL 사용
const AI_INTERVIEW_BASE_URL = 'https://ddockterview-api-299282571203.us-central1.run.app'; // 임시로 직접 호출
// const AI_INTERVIEW_BASE_URL = process.env.NODE_ENV === 'development'
//   ? '/ai-api'
//   : 'https://ddockterview-api-299282571203.us-central1.run.app';

/**
 * 면접 시작 - 첫 질문 받기
 * @param {string} sessionId - 자기소개서 업로드 시 받은 세션 ID (필수)
 * @returns {Promise} - 첫 질문 정보 (question, audioData 등)
 */
export const startInterview = async (sessionId) => {
  try {
    if (!sessionId) {
      throw new Error('sessionId가 필요합니다. 먼저 자기소개서를 업로드해주세요.');
    }

    const formData = new FormData();
    formData.append('sessionId', sessionId);

    const response = await fetch(`${AI_INTERVIEW_BASE_URL}/api/interview/start`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      let errorData;
      const contentType = response.headers.get('content-type');

      if (contentType && contentType.includes('application/json')) {
        errorData = await response.json();
      } else {
        const errorText = await response.text();
        errorData = { message: errorText };
      }

      console.error('❌ 면접 시작 실패:', errorData);
      throw new Error(errorData.message || errorData.error || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ 면접 시작 성공');
    console.log(`📝 질문 #${data.questionId}: ${data.question}`);
    console.log(`🎤 음성 데이터: ${data.audioData ? '있음' : '없음 (텍스트만)'}`);
    console.log(`📊 남은 질문 슬롯: ${data.remainingSlots}`);

    return data;
  } catch (error) {
    console.error('❌ 면접 시작 에러:', error.message);
    throw error;
  }
};

/**
 * 답변 영상 업로드 - 다음 질문 또는 종료
 * @param {string} sessionId - 면접 세션 ID
 * @param {number} questionNumber - 현재 질문 번호
 * @param {Blob} videoBlob - WebM 또는 MP4 비디오 파일
 * @returns {Promise} - 다음 질문 정보 또는 종료 메시지
 */
export const uploadAnswer = async (sessionId, questionNumber, videoBlob) => {
  try {
    console.log(`🎥 답변 업로드 - 질문 #${questionNumber} (${(videoBlob.size / 1024 / 1024).toFixed(2)}MB)`);

    const formData = new FormData();
    formData.append('sessionId', sessionId);
    formData.append('questionNumber', questionNumber);
    formData.append('videoFile', videoBlob, 'answer.webm');

    const response = await fetch(`${AI_INTERVIEW_BASE_URL}/api/interview/upload-answer`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      let errorData;
      const contentType = response.headers.get('content-type');

      if (contentType && contentType.includes('application/json')) {
        errorData = await response.json();
      } else {
        const errorText = await response.text();
        errorData = { message: errorText };
      }

      console.error('❌ 답변 업로드 실패:', errorData);
      throw new Error(errorData.message || errorData.error || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.status === 'continue') {
      console.log(`✅ 다음 질문 ${data.isTailQuestion ? '🔗(꼬리질문)' : '💬(일반질문)'}`);
      console.log(`📝 질문 #${data.questionId}: ${data.question}`);
      console.log(`🎤 음성 데이터: ${data.audioData ? '있음' : '없음 (텍스트만)'}`);
      console.log(`📊 남은 질문 슬롯: ${data.remainingSlots}`);
    } else if (data.status === 'completed') {
      console.log('✅ 면접 완료! 수고하셨습니다.');
    }

    return data;
  } catch (error) {
    console.error('❌ 답변 업로드 에러:', error.message);
    throw error;
  }
};

/**
 * 면접 진행 상태 조회
 * @param {string} sessionId - 면접 세션 ID
 * @returns {Promise} - 진행 상태 정보
 */
export const getInterviewStatus = async (sessionId) => {
  try {
    const response = await fetch(`${AI_INTERVIEW_BASE_URL}/api/interview/status/${sessionId}`, {
      method: 'GET',
    });

    if (!response.ok) {
      let errorData;
      const contentType = response.headers.get('content-type');

      if (contentType && contentType.includes('application/json')) {
        errorData = await response.json();
      } else {
        const errorText = await response.text();
        errorData = { message: errorText };
      }

      console.error('❌ 상태 조회 실패:', errorData);
      throw new Error(errorData.message || errorData.error || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('❌ 상태 조회 에러:', error.message);
    throw error;
  }
};

// audioPlayer 유틸리티 함수 export (편의성)
export { playAudioFromBase64 } from '../utils/audioPlayer';
