import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../AuthContext';
import './HomePage.css';

const HomePage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth(); // беремо напряму із контексту

  const handleTileClick = (destination) => {
    if (isAuthenticated) {
      navigate(destination);
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="home-page">
      <section className="hero">
        <h1>Ласкаво просимо на <span className="highlight">Consulting Platform</span></h1>
        <p style={{ fontStyle: 'italic' }}>
          Зробіть впевнений крок до кар'єри вашої мрії! </p>
        <br></br>
        <p>Наша платформа створена, щоб допомогти вам краще зрозуміти свої сильні сторони, визначити професійні схильності та знайти ідеальні вакансії, що відповідають вашим унікальним навичкам та інтересам.
        </p>
      </section>

      <section className="tiles-section">
        <div className="tile tile-blue">
          <h2>Тест Дрейфус</h2>
          <p>Оцініть рівень професіоналізму за моделлю братів Дрейфус.</p>
          <button className="tile-button" onClick={() => handleTileClick('/dreyfus-info')}>Перейти</button>
        </div>

        <div className="tile tile-green">
          <h2>Тест психофізіологічних характеристик</h2>
          <p>Визначте свої сильні сторони, особистісні риси та психофізіологічні якості.</p>
          <button className="tile-button" onClick={() => handleTileClick('/professional-characteristics')}>Перейти</button>
        </div>

        <div className="tile tile-purple">
          <h2>Система рекомендацій</h2>
          <p>Отримайте персоналізовані рекомендації професій та вакансій на основі результатів тестів.</p>
          <button className="tile-button" onClick={() => handleTileClick('/recommendations')}>Перейти</button>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
