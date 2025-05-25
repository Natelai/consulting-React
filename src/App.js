import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext';
import ProtectedRoute from './ProtectedRoute';
import PageHeader from './components/shared/PageHeader/PageHeader';
import HomePage from './components/shared/HomePage/HomePage';
import LoginPage from './components/Public/LoginPage';
import RegisterPage from './components/Public/RegisterPage';
import EmailConfirmationPage from './components/Public/EmailConfirmation/EmailConfirmation';
import ResetPasswordPage from './components/Public/ResetPassword/ResetPasswordPage';
import ResetRequestPage from './components/Public/ResetRequestPage/ResetRequestPage';
import DreyfusTestPage from './components/DreyfusTest';
import CareerTestPage from './components/MaxMinTest/CareerTest';
import VacancyPage from './components/Vacancy/VacancyPage';
import UserProfile from './components/UserProfile/UserProfile';
import DreyfusTestInfoPage from './components/DreyfusTest/DreyfusTestInfoPage';

import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <MainApp />
      </Router>
    </AuthProvider>
  );
}

function MainApp() {
  const { isAuthenticated, logout, login } = useAuth();

  return (
    <div className="App">
      <PageHeader isAuthenticated={isAuthenticated} onLogout={logout} />

      <Routes>
  {/* Публічні сторінки */}
  <Route path="/" element={      <HomePage />  } />
  <Route path="/login" element={<LoginPage />} />
  <Route path="/register" element={<RegisterPage />} />
  <Route path="/email-confirmation" element={<EmailConfirmationPage />} />
  <Route path="/resetRequest" element={<ResetRequestPage />} />
  <Route path="/reset" element={<ResetPasswordPage />} />

  {/* Приватні сторінки */}
  <Route path="/professional-characteristics" element={<ProtectedRoute><CareerTestPage /></ProtectedRoute>} />
  <Route path="/recommendations" element={<ProtectedRoute><VacancyPage/></ProtectedRoute>}/>
  <Route path="/profile" element={<UserProfile/>}/>
  <Route
  path="/dreyfus-info"
  element={
    <ProtectedRoute>
      <DreyfusTestInfoPage />
    </ProtectedRoute>
  }
/>
<Route
  path="/dreyfus"
  element={
    <ProtectedRoute>
      <DreyfusTestPage />
    </ProtectedRoute>
  }
/>
</Routes>
    </div>
  );
}

export default App;
