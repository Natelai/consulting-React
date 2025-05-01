import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './EmailConfirmation.css';

const EmailConfirmationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [status, setStatus] = useState('invalid');
  const [email, setEmail] = useState('');
  const [isWaiting, setIsWaiting] = useState(false);
  const [timer, setTimer] = useState(60);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const statusParam = queryParams.get('status') || 'invalid';
    const emailParam = queryParams.get('email') || '';

    setStatus(statusParam);
    setEmail(emailParam);
  }, [location.search]);

  const handleRedirectToLogin = () => {
    navigate('/login');
  };

  const handleResendConfirmationEmail = async () => {
    if (!email) return;

    try {
      const response = await fetch('https://localhost:7100/resend-confirmation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ Email: email }),
      });

      if (response.ok) {
        setIsWaiting(true);
        let timeLeft = 60;
        const interval = setInterval(() => {
          timeLeft -= 1;
          setTimer(timeLeft);
          if (timeLeft === 0) {
            clearInterval(interval);
            setIsWaiting(false);
          }
        }, 1000);
      } else {
        alert('Не вдалося надіслати лист повторно. Спробуйте пізніше.');
      }
    } catch (error) {
      alert('Сталася помилка. Спробуйте пізніше.');
    }
  };

  return (
    <div className="confirmation-container">
      <div className="confirmation-card">
        {status === 'success' && (
          <>
            <h2>Вітаємо!</h2>
            <p>Ваш email було підтверджено. Ви можете увійти в додаток!</p>
            <img src="/assets/success-icon.png" className="confirmation-icon" alt="Success" />
            <button onClick={handleRedirectToLogin} className="resend-button">Увійти в додаток</button>
          </>
        )}
        {status === 'failure' && (
          <>
            <h2>Упс!</h2>
            <p>Щось пішло не так під час підтвердження Вашого Email. Спробуйте ще раз пізніше.</p>
            <img src="/assets/error-icon.png" className="confirmation-icon" alt="Error" />
          </>
        )}
        {status === 'invalid' && (
          <>
            <h2>Неправильне посилання</h2>
            <p>Посилання неправильне, або його термін вичерпано.</p>
            <img src="/assets/error-icon.png" className="confirmation-icon" alt="Error" />
            {!isWaiting ? (
              <button onClick={handleResendConfirmationEmail} className="resend-button">Надіслати лист повторно</button>
            ) : (
              <p className="timer-message">Спробуйте ще раз через {timer} сек.</p>
            )}
          </>
        )}
        {status === 'waiting' && (
          <>
            <h2>Перевірте скриньку</h2>
            <p>Лист для активації акаунту було надіслано на пошту:</p>
            <p><strong>{email}</strong></p>
            <img src="/assets/waiting-icon.png" className="confirmation-icon" alt="Waiting" />
            {!isWaiting ? (
              <button onClick={handleResendConfirmationEmail} className="resend-button">Надіслати лист повторно</button>
            ) : (
              <p className="timer-message">Спробуйте ще раз через {timer} сек.</p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default EmailConfirmationPage;
