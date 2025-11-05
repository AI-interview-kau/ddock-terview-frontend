/**
 * API Services Index
 * 모든 API 서비스를 한 곳에서 import할 수 있도록 export
 */

// 인증 관련
export {
  login,
  socialLogin,
  signup,
  logout,
  getUserProfile,
  updateUserProfile,
  changePassword,
  refreshToken,
  checkIdAvailability,
} from './authService';

// 면접 관련
export {
  createInterviewSession,
  getInterviewSession,
  getInterviewSessions,
  getQuestionList,
  createQuestion,
  deleteQuestion,
  saveQuestion,
  unsaveQuestion,
  getSavedQuestions,
  submitSelectedQuestions,
  submitAnswer,
  saveAnswer,
  cancelInterview,
  getInterviewFeedback,
  uploadResume,
  getResumes,
  getResume,
  getQuestionNote,
  updateQuestionNote,
  getQuestionFeedback,
} from './interviewService';

// 사용자 활동 관련
export {
  getMyLog,
  getInterviewHistory,
  getInterviewDetail,
  getUserStatistics,
  getSubscriptionInfo,
  purchaseSubscription,
  saveQuestionMemo,
  getQuestionMemo,
  getNotifications,
  markNotificationAsRead,
} from './userService';

// axios 인스턴스도 export (필요시 직접 사용)
export { default as apiClient } from './axios';
