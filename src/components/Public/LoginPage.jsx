import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../AuthContext'; // додаємо!
import './LoginPage.css';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth(); // підключаємо login() з контексту

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      const response = await fetch('https://localhost:7100/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (response.ok) {
        const result = await response.json();

        if (result?.isSuccess && result?.token) {
          login(result.token);  // Викликаємо login(), а не просто записуємо в localStorage
          navigate('/');        // Плавно переходимо на головну
        } else {
          setErrorMessage('Невірна пошта або пароль.');
        }
      } else {
        setErrorMessage('Помилка сервера. Спробуйте пізніше.');
      }
    } catch (err) {
      setErrorMessage('Невідома помилка.');
    }

    setIsLoading(false);
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h2>Вхід до системи</h2>

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

        {errorMessage && <div className="error-message">{errorMessage}</div>}

        <button onClick={handleLogin} disabled={isLoading}>
          {isLoading ? 'Завантаження...' : 'Увійти'}
        </button>

        <div className="login-links">
          <button
            type="button"
            className="link-button"
            onClick={() => navigate('/resetRequest')}
          >
            Забули пароль?
          </button>

          <button
            type="button"
            className="link-button"
            onClick={() => navigate('/register')}
          >
            Зареєструватись
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
