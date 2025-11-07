import apiClient from './axios';

/**
 * 사용자 활동 관련 API
 */

/**
 * 면접 기록 목록 + 성장 리포트 조회 (마이로그)
 * @returns {Promise} - 면접 기록 목록 및 성장 리포트
 */
export const getMyLog = async () => {
  try {
    console.log('🚀 [API Request] GET /mylog');

    const response = await apiClient.get('/mylog');

    console.log('✅ [API Response] My log retrieved successfully');
    console.log('📦 Response Data:', response.data);
    console.log('📊 Status Code:', response.status);
    console.log('📈 Growth Report Labels:', response.data?.growthReport?.labels);
    console.log('📈 Growth Report Scores:', response.data?.growthReport?.scores);
    console.log('📋 Sessions Count:', response.data?.sessions?.length);

    return response.data;
  } catch (error) {
    console.error('❌ [API Error] Failed to get my log');
    console.error('📋 Error Details:', {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      url: error.config?.url,
      method: error.config?.method,
    });
    throw error;
  }
};

/**
 * 면접 기록 목록 조회 (구버전 - 호환용)
 * @param {Object} params - 조회 파라미터
 * @param {number} params.page - 페이지 번호
 * @param {number} params.size - 페이지 크기
 * @returns {Promise} - 면접 기록 목록
 */
export const getInterviewHistory = async (params = { page: 0, size: 20 }) => {
  try {
    const response = await apiClient.get('/user/interview-history', {
      params: params,
    });
    return response.data;
  } catch (error) {
    console.error('Failed to get interview history:', error);
    throw error;
  }
};

/**
 * 특정 면접 기록 상세 조회 (최종 피드백 + 질문 리스트)
 * @param {number} sessionId - 세션 ID
 * @returns {Promise} - 면접 기록 상세 (feedback, questions)
 */
export const getInterviewDetail = async (sessionId) => {
  try {
    console.log('🚀 [API Request] GET /mylog/' + sessionId);

    const response = await apiClient.get(`/mylog/${sessionId}`);

    console.log('✅ [API Response] Interview detail retrieved successfully');
    console.log('📦 Response Data:', response.data);
    console.log('📊 Status Code:', response.status);
    console.log('🎯 Session ID:', sessionId);
    console.log('📝 Questions Count:', response.data?.questions?.length);

    return response.data;
  } catch (error) {
    console.error('❌ [API Error] Failed to get interview detail');
    console.error('📋 Error Details:', {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      url: error.config?.url,
      method: error.config?.method,
      sessionId: sessionId,
    });
    throw error;
  }
};

/**
 * 통계 정보 조회
 * @returns {Promise} - 사용자 통계 정보
 */
export const getUserStatistics = async () => {
  try {
    const response = await apiClient.get('/user/statistics');
    return response.data;
  } catch (error) {
    console.error('Failed to get user statistics:', error);
    throw error;
  }
};

/**
 * 이용권 정보 조회
 * @returns {Promise} - 이용권 정보
 */
export const getSubscriptionInfo = async () => {
  try {
    const response = await apiClient.get('/user/subscription');
    return response.data;
  } catch (error) {
    console.error('Failed to get subscription info:', error);
    throw error;
  }
};

/**
 * 이용권 구매
 * @param {Object} subscriptionData - 구매 정보
 * @param {string} subscriptionData.planId - 플랜 ID
 * @param {string} subscriptionData.paymentMethod - 결제 방법
 * @returns {Promise} - 구매 결과
 */
export const purchaseSubscription = async (subscriptionData) => {
  try {
    const response = await apiClient.post('/user/subscription/purchase', {
      planId: subscriptionData.planId,
      paymentMethod: subscriptionData.paymentMethod,
    });
    return response.data;
  } catch (error) {
    console.error('Failed to purchase subscription:', error);
    throw error;
  }
};

/**
 * 질문 메모 저장
 * @param {number} questionId - 질문 ID
 * @param {string} memo - 메모 내용
 * @returns {Promise} - 저장 결과
 */
export const saveQuestionMemo = async (questionId, memo) => {
  try {
    const response = await apiClient.post(`/user/question/${questionId}/memo`, {
      memo: memo,
    });
    return response.data;
  } catch (error) {
    console.error('Failed to save question memo:', error);
    throw error;
  }
};

/**
 * 질문 메모 조회
 * @param {number} questionId - 질문 ID
 * @returns {Promise} - 메모 내용
 */
export const getQuestionMemo = async (questionId) => {
  try {
    const response = await apiClient.get(`/user/question/${questionId}/memo`);
    return response.data;
  } catch (error) {
    console.error('Failed to get question memo:', error);
    throw error;
  }
};

/**
 * 알림 목록 조회
 * @returns {Promise} - 알림 목록
 */
export const getNotifications = async () => {
  try {
    const response = await apiClient.get('/user/notifications');
    return response.data;
  } catch (error) {
    console.error('Failed to get notifications:', error);
    throw error;
  }
};

/**
 * 알림 읽음 처리
 * @param {number} notificationId - 알림 ID
 * @returns {Promise} - 처리 결과
 */
export const markNotificationAsRead = async (notificationId) => {
  try {
    const response = await apiClient.put(`/user/notifications/${notificationId}/read`);
    return response.data;
  } catch (error) {
    console.error('Failed to mark notification as read:', error);
    throw error;
  }
};

/**
 * 내 정보 수정하기
 * @param {Object} userData - 수정할 사용자 정보
 * @param {string} userData.name - 수정된 이름
 * @param {string} userData.depart - 수정된 희망직군
 * @param {string} userData.status - 수정된 상태
 * @returns {Promise} - 수정된 사용자 정보
 */
export const updateUserInfo = async (userData) => {
  try {
    const requestBody = {
      name: userData.name,
      depart: userData.depart,
      status: userData.status,
    };

    console.log('🚀 [API Request] PUT /user');
    console.log('📝 Request Body:', requestBody);

    const response = await apiClient.put('/user', requestBody);

    console.log('✅ [API Response] User info updated successfully');
    console.log('📦 Response Data:', response.data);
    console.log('📊 Status Code:', response.status);

    return response.data;
  } catch (error) {
    console.error('❌ [API Error] Failed to update user info');
    console.error('📋 Error Details:', {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      url: error.config?.url,
      method: error.config?.method,
    });
    throw error;
  }
};
