import axios from 'axios';

// API base URL 설정
// 개발 환경: 프록시 사용 (/api)
// 프로덕션: 실제 서버 URL 사용
const BASE_URL = process.env.NODE_ENV === 'development'
  ? '/api'  // 개발 환경에서는 프록시 사용
  : (process.env.REACT_APP_API_URL || 'https://ddock-terview.ap-northeast-2.elasticbeanstalk.com');

// axios 인스턴스 생성
const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request 인터셉터: JWT 토큰 자동 추가 + 요청 로깅
apiClient.interceptors.request.use(
  (config) => {
    // 요청 시작 시간 기록
    config.metadata = { startTime: new Date() };

    console.log('🚀 [API Request]', config.method.toUpperCase(), config.url);
    console.log('📦 Request Data:', config.data || 'No data');
    console.log('🔑 Headers:', config.headers);

    // localStorage에서 사용자 정보 가져오기
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        // JWT 토큰이 있으면 Authorization 헤더에 추가
        if (user.token) {
          config.headers.Authorization = `Bearer ${user.token}`;
        }
      } catch (error) {
        console.error('Failed to parse user data:', error);
      }
    }
    return config;
  },
  (error) => {
    console.error('❌ [API Request Error]', error);
    return Promise.reject(error);
  }
);

// Response 인터셉터: 에러 처리 + 응답 로깅
apiClient.interceptors.response.use(
  (response) => {
    // 응답 시간 계산
    const endTime = new Date();
    const duration = response.config.metadata?.startTime
      ? endTime - response.config.metadata.startTime
      : 0;

    console.log('✅ [API Response]', response.config.method.toUpperCase(), response.config.url);
    console.log('📊 Status:', response.status, response.statusText);
    console.log('⏱️ Duration:', duration + 'ms');
    console.log('📦 Response Data:', response.data);
    console.log('─────────────────────────────────────');

    return response;
  },
  (error) => {
    // 응답 시간 계산
    const endTime = new Date();
    const duration = error.config?.metadata?.startTime
      ? endTime - error.config.metadata.startTime
      : 0;

    console.error('❌ [API Error]', error.config?.method?.toUpperCase(), error.config?.url);
    console.error('📊 Status:', error.response?.status, error.response?.statusText);
    console.error('⏱️ Duration:', duration + 'ms');
    console.error('📦 Error Data:', error.response?.data);
    console.error('─────────────────────────────────────');

    // 401 에러 (인증 실패) 처리
    if (error.response?.status === 401) {
      // 로그인 페이지로 리다이렉트
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
