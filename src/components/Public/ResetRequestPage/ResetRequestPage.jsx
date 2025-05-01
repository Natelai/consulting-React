import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AuthPage.css'; // використаємо той самий стиль

const ResetRequestPage = () => {
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    // проста валідація
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      setErrorMessage('Invalid email format.');
      return;
    }

    try {
      const response = await fetch(`https://localhost:7100/reset-password?email=${encodeURIComponent(email)}`);
      const redirectUrl = await response.json();

      if (redirectUrl) {
        window.location.href = redirectUrl;
      } else {
        setErrorMessage('Request failed. Please try again.');
      }
    } catch (error) {
      setErrorMessage('Server error. Please try again later.');
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit} className="auth-card">
        <h2>Reset password</h2>

        <label>Email</label>
        <input
          type="email"
          className="input"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button type="submit">Confirm</button>

        <p>Remember your password? <a href="/login">Login now!</a></p>

        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </form>
    </div>
  );
};

export default ResetRequestPage;
