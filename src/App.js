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
  <Route path="/login" element={<LoginPage />} />
  <Route path="/register" element={<RegisterPage />} />
  <Route path="/email-confirmation" element={<EmailConfirmationPage />} />
  <Route path="/resetRequest" element={<ResetRequestPage />} />
  <Route path="/reset" element={<ResetPasswordPage />} />
  <Route path="/professional-characteristics" element={<CareerTestPage />} />
  <Route path="/recommendations" element={<VacancyPage/>}/>
  <Route path="/profile" element={<UserProfile/>}/>
  {/* Приватні сторінки */}
  <Route path="/" element={
    <ProtectedRoute>
      <HomePage />
    </ProtectedRoute>
  } />
  <Route
  path="/drayfus"
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
