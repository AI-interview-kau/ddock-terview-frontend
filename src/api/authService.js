import apiClient from './axios';

/**
 * 인증 관련 API
 */

/**
 * 로그인
 * @param {string} userId - 사용자 ID
 * @param {string} password - 비밀번호
 * @returns {Promise} - 로그인 결과 (grante, accessToken, refresh)
 */
export const login = async (userId, password) => {
  try {
    const response = await apiClient.post('/user/login', {
      userId: userId,
      password: password,
    });
    return response.data;
  } catch (error) {
    console.error('Failed to login:', error);
    throw error;
  }
};

/**
 * 소셜 로그인
 * @param {string} provider - 소셜 로그인 제공자 (kakao, google, apple)
 * @param {string} token - 소셜 로그인 토큰
 * @returns {Promise} - 로그인 결과
 */
export const socialLogin = async (provider, token) => {
  try {
    const response = await apiClient.post(`/auth/social/${provider}`, {
      token: token,
    });
    return response.data;
  } catch (error) {
    console.error('Failed to social login:', error);
    throw error;
  }
};

/**
 * 회원가입
 * @param {Object} userData - 사용자 정보
 * @param {string} userData.id - 사용자 ID
 * @param {string} userData.password - 비밀번호
 * @param {string} userData.name - 이름
 * @param {Array<string>} userData.jobCategories - 직군 목록
 * @param {string} userData.currentStatus - 현재 상태
 * @returns {Promise} - 회원가입 결과
 */
export const signup = async (userData) => {
  try {
    const response = await apiClient.post('/auth/signup', {
      id: userData.id,
      password: userData.password,
      name: userData.name,
      jobCategories: userData.jobCategories,
      currentStatus: userData.currentStatus,
    });
    return response.data;
  } catch (error) {
    console.error('Failed to signup:', error);
    throw error;
  }
};

/**
 * 로그아웃
 * @returns {Promise} - 로그아웃 결과
 */
export const logout = async () => {
  try {
    const response = await apiClient.post('/auth/logout');
    return response.data;
  } catch (error) {
    console.error('Failed to logout:', error);
    throw error;
  }
};

/**
 * 사용자 정보 조회
 * @returns {Promise} - 사용자 정보 (name, depart, status)
 */
export const getUserProfile = async () => {
  try {
    const response = await apiClient.get('/user');
    return response.data;
  } catch (error) {
    console.error('Failed to get user profile:', error);
    throw error;
  }
};

/**
 * 사용자 정보 수정
 * @param {Object} userData - 수정할 사용자 정보
 * @param {string} userData.name - 이름
 * @param {Array<string>} userData.jobCategories - 직군 목록
 * @param {string} userData.currentStatus - 현재 상태
 * @returns {Promise} - 수정 결과
 */
export const updateUserProfile = async (userData) => {
  try {
    const response = await apiClient.put('/user/profile', {
      name: userData.name,
      jobCategories: userData.jobCategories,
      currentStatus: userData.currentStatus,
    });
    return response.data;
  } catch (error) {
    console.error('Failed to update user profile:', error);
    throw error;
  }
};

/**
 * 비밀번호 변경
 * @param {string} currentPassword - 현재 비밀번호
 * @param {string} newPassword - 새 비밀번호
 * @returns {Promise} - 변경 결과
 */
export const changePassword = async (currentPassword, newPassword) => {
  try {
    const response = await apiClient.put('/user/password', {
      currentPassword: currentPassword,
      newPassword: newPassword,
    });
    return response.data;
  } catch (error) {
    console.error('Failed to change password:', error);
    throw error;
  }
};

/**
 * 토큰 갱신
 * @param {string} refreshToken - 리프레시 토큰
 * @returns {Promise} - 새로운 액세스 토큰
 */
export const refreshToken = async (refreshToken) => {
  try {
    const response = await apiClient.post('/auth/refresh', {
      refreshToken: refreshToken,
    });
    return response.data;
  } catch (error) {
    console.error('Failed to refresh token:', error);
    throw error;
  }
};

/**
 * 아이디 중복 확인
 * @param {string} id - 확인할 ID
 * @returns {Promise} - 중복 여부
 */
export const checkIdAvailability = async (id) => {
  try {
    const response = await apiClient.get(`/auth/check-id/${id}`);
    return response.data;
  } catch (error) {
    console.error('Failed to check id availability:', error);
    throw error;
  }
};
