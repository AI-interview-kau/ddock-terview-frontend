import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { GlobalStyles } from './styles/GlobalStyles';
import { theme } from './styles/theme';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/common/PrivateRoute';
import ScrollToTop from './components/common/ScrollToTop';

// Pages
import Login from './pages/Login';
import Onboarding from './pages/Onboarding';
import Main from './pages/Main';
import Profile from './pages/Profile';
import InterviewPrepare from './pages/Interview/InterviewPrepare';
import QuestionSelection from './pages/Interview/QuestionSelection';
import InterviewCameraTest from './pages/Interview/InterviewCameraTest';
import InterviewMicTest from './pages/Interview/InterviewMicTest';
import InterviewReady from './pages/Interview/InterviewReady';
import InterviewProgress from './pages/Interview/InterviewProgress';
import InterviewFeedback from './pages/Interview/InterviewFeedback';
import QuestionDetailFeedback from './pages/Interview/QuestionDetailFeedback';
import QuestionBank from './pages/QuestionBank';
import Subscription from './pages/Subscription';
import MyLog from './pages/MyLog';
import MyDocuments from './pages/MyDocuments';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <AuthProvider>
        <Router>
          <ScrollToTop />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Main />} />

            {/* 온보딩은 회원가입 시 접근 (로그인 불필요) */}
            <Route path="/onboarding" element={<Onboarding />} />

            {/* Interview Routes - 로그인 필요 */}
            <Route
              path="/interview"
              element={
                <PrivateRoute>
                  <InterviewPrepare />
                </PrivateRoute>
              }
            />
            <Route
              path="/interview/question-selection"
              element={
                <PrivateRoute>
                  <QuestionSelection />
                </PrivateRoute>
              }
            />
            <Route
              path="/interview/camera-test"
              element={
                <PrivateRoute>
                  <InterviewCameraTest />
                </PrivateRoute>
              }
            />
            <Route
              path="/interview/mic-test"
              element={
                <PrivateRoute>
                  <InterviewMicTest />
                </PrivateRoute>
              }
            />
            <Route
              path="/interview/ready"
              element={
                <PrivateRoute>
                  <InterviewReady />
                </PrivateRoute>
              }
            />
            <Route
              path="/interview/progress"
              element={
                <PrivateRoute>
                  <InterviewProgress />
                </PrivateRoute>
              }
            />
            <Route
              path="/interview/feedback"
              element={
                <PrivateRoute>
                  <InterviewFeedback />
                </PrivateRoute>
              }
            />

            {/* Other Routes */}
            {/* 이용권은 로그인 없이도 접근 가능 */}
            <Route path="/subscription" element={<Subscription />} />

            {/* 로그인 필요한 페이지들 */}
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              }
            />
            <Route
              path="/question-bank"
              element={
                <PrivateRoute>
                  <QuestionBank />
                </PrivateRoute>
              }
            />
            <Route
              path="/my-log"
              element={
                <PrivateRoute>
                  <MyLog />
                </PrivateRoute>
              }
            />
            <Route
              path="/my-log/:sessionId"
              element={
                <PrivateRoute>
                  <InterviewFeedback />
                </PrivateRoute>
              }
            />
            <Route
              path="/my-log/:sessionId/question/:inqId"
              element={
                <PrivateRoute>
                  <QuestionDetailFeedback />
                </PrivateRoute>
              }
            />
            <Route
              path="/my-log/documents"
              element={
                <PrivateRoute>
                  <MyDocuments />
                </PrivateRoute>
              }
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
