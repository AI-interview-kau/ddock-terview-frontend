import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { GlobalStyles } from './styles/GlobalStyles';
import { theme } from './styles/theme';

// Pages
import Login from './pages/Login';
import Onboarding from './pages/Onboarding';
import Main from './pages/Main';
import InterviewPrepare from './pages/Interview/InterviewPrepare';
import QuestionSelection from './pages/Interview/QuestionSelection';
import InterviewSetting from './pages/Interview/InterviewSetting';
import InterviewProgress from './pages/Interview/InterviewProgress';
import InterviewFeedback from './pages/Interview/InterviewFeedback';
import QuestionDetailFeedback from './pages/Interview/QuestionDetailFeedback';
import QuestionBank from './pages/QuestionBank';
import Subscription from './pages/Subscription';
import MyLog from './pages/MyLog';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/" element={<Main />} />

          {/* Interview Routes */}
          <Route path="/interview" element={<InterviewPrepare />} />
          <Route path="/interview/question-selection" element={<QuestionSelection />} />
          <Route path="/interview/setting" element={<InterviewSetting />} />
          <Route path="/interview/progress" element={<InterviewProgress />} />
          <Route path="/interview/feedback" element={<InterviewFeedback />} />
          <Route path="/interview/feedback/:questionId" element={<QuestionDetailFeedback />} />

          {/* Other Routes */}
          <Route path="/question-bank" element={<QuestionBank />} />
          <Route path="/subscription" element={<Subscription />} />
          <Route path="/my-log" element={<MyLog />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
