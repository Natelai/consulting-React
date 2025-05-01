import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './ResetPasswordPage.css'; // Використаємо єдиний стиль для auth

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [userId, setUserId] = useState('');
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    setUserId(queryParams.get('userId') || '');
    setToken(queryParams.get('token') || '');
  }, [location.search]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    try {
      const response = await fetch('https://localhost:7100/confirm-reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          UserId: userId,
          Token: token,
          NewPassword: password
        }),
      });

      const redirectUrl = await response.json();

      if (redirectUrl) {
        window.location.href = redirectUrl;
      } else {
        setErrorMessage('Reset failed. Try again later.');
      }
    } catch (error) {
      setErrorMessage('Server error. Try again later.');
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit} className="auth-card">
        <h2>Reset password</h2>

        <label>New password</label>
        <input
          className="input"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
        />

        <label>Confirm Password</label>
        <input
          className="input"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm your password"
        />

        <button type="submit">Reset</button>

        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </form>
    </div>
  );
};

export default ResetPasswordPage;
