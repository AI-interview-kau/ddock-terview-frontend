/**
 * AI 질문 생성 서버 API V2
 * Base URL: https://ddockterview-api-v2-299282571203.us-central1.run.app
 */

// AI API Server V2 URL
const AI_API_BASE_URL = 'https://ddockterview-api-v2-299282571203.us-central1.run.app';

/**
 * AI 서버 헬스 체크
 * @returns {Promise} - 서버 상태 정보
 */
export const checkAIHealth = async () => {
  try {
    const response = await fetch(`${AI_API_BASE_URL}/api/health`, {
      method: 'GET',
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('❌ AI 서버 상태 확인 실패:', error.message);
    throw error;
  }
};

/**
 * 자기소개서 PDF 업로드 후 AI 질문 생성
 * @param {File} pdfFile - 자기소개서 PDF 파일
 * @param {string} userId - 로그인된 사용자 ID (필수)
 * @returns {Promise} - sessionId 및 분석 결과
 * @returns {Object} result
 * @returns {string} result.status - 처리 상태 ("success")
 * @returns {string} result.sessionId - 면접 세션 ID (반드시 저장 필요!)
 * @returns {string} result.company_name - 지원 기업명
 * @returns {string} result.gcs_uri - GCS 저장 경로
 * @returns {string} result.timestamp - 업로드 시각
 */
export const generateQuestionsFromResume = async (pdfFile, userId) => {
  try {
    console.log(`📤 자소서 업로드 시작`);
    console.log(`📄 파일명: ${pdfFile.name}`);
    console.log(`📦 파일 크기: ${(pdfFile.size / 1024).toFixed(1)}KB`);
    console.log(`🏷️  파일 타입: ${pdfFile.type}`);
    console.log(`👤 사용자 ID: ${userId}`);

    // userId 검증
    if (!userId) {
      throw new Error('사용자 ID가 필요합니다. 로그인 후 다시 시도해주세요.');
    }

    // PDF 파일 검증 (더 엄격하게)
    if (!pdfFile.type || pdfFile.type !== 'application/pdf') {
      console.error('❌ 파일 타입 오류:', pdfFile.type);
      throw new Error('PDF 파일만 업로드 가능합니다. (확장자: .pdf)');
    }

    // 파일 크기 검증 (5MB 제한)
    const maxSizeInBytes = 5 * 1024 * 1024; // 5MB
    if (pdfFile.size > maxSizeInBytes) {
      throw new Error('파일 크기는 5MB 이하여야 합니다.');
    }

    // FormData 생성 (서버가 요구하는 'resume_file'과 'userId' 추가)
    const formData = new FormData();
    formData.append('resume_file', pdfFile, pdfFile.name); // 서버 요구사항: resume_file
    formData.append('userId', userId); // 서버 요구사항: userId

    console.log('📤 FormData 생성 완료 (키: resume_file, userId), 서버로 전송 중...');

    const response = await fetch(`${AI_API_BASE_URL}/api/generate-questions`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      // 에러 응답의 상세 내용 확인
      let errorData;
      const contentType = response.headers.get('content-type');

      if (contentType && contentType.includes('application/json')) {
        errorData = await response.json();
      } else {
        const errorText = await response.text();
        errorData = { message: errorText };
      }

      console.error('❌ 질문 생성 실패:', errorData);

      // 422 에러의 경우 상세 정보 출력
      if (response.status === 422 && errorData.detail) {
        console.error('📋 검증 에러 상세:', errorData.detail);
        const detailMessage = errorData.detail.map(d => d.msg || JSON.stringify(d)).join(', ');
        throw new Error(`요청 검증 실패: ${detailMessage}`);
      }

      throw new Error(errorData.message || errorData.error || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log(`✅ AI 질문 생성 완료`);
    console.log(`🆔 Session ID: ${data.sessionId}`);
    console.log(`🏢 지원 기업: ${data.company_name || 'N/A'}`);
    console.log(`⏱️ 처리 시간: ${data.timestamp}`);
    console.log(`⚠️  sessionId를 반드시 저장하세요!`);

    // localStorage에 sessionId 저장
    if (data.sessionId) {
      localStorage.setItem('currentSession', JSON.stringify({
        sessionId: data.sessionId,
        company_name: data.company_name,
        timestamp: data.timestamp
      }));
      console.log('💾 sessionId를 localStorage에 저장했습니다.');
    }

    return data;
  } catch (error) {
    console.error('❌ 질문 생성 에러:', error.message);
    throw error;
  }
};
