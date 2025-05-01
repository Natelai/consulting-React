import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './RegisterPage.css';

const RegisterPage = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    try {
      const response = await fetch('https://localhost:7100/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ Email: email, Password: password })
      });

      if (response.ok) {
        navigate(`/email-confirmation?status=waiting&email=${encodeURIComponent(email)}`);
      } else {
        setErrorMessage('Registration failed. Please try again.');
      }
    } catch (error) {
      setErrorMessage('Server error. Please try again later.');
    }
  };

  return (
    <div className="register-page">
      <div className="register-card">
        <h2>Реєстрація</h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="Підтвердіть пароль"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        {errorMessage && <div className="error-message">{errorMessage}</div>}

        <button onClick={handleRegister}>Зареєструватись</button>

        <div className="login-link">
          <p>Вже маєте акаунт? <button onClick={() => navigate('/login')} className="link-button">Увійти</button></p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
