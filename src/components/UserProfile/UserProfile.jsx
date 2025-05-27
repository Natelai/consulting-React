import React, { useEffect, useState } from 'react';
import './UserProfile.css'; // Переконайтесь, що CSS підключено
import icon from './icon.jpeg'; // Ваш шлях до іконки
import Chart from '../DreyfusTest/Chart'; // Припускаємо, що Chart знаходиться тут або в іншому доступному місці
import { getUserIdFromToken } from '../../actions/auth.js';

// Функції та константи, які потрібні для відображення результатів Дрейфус
// (можна винести в окремий utils файл, якщо вони використовуються в декількох місцях)
const blockTitles = {
  Novice: 'Новачок',
  AdvancedBeginner: 'Твердий початківець',
  Competent: 'Компетентний',
  Proficient: 'Досвідчений',
  Expert: 'Експерт'
};

const getLevelDescription = (score) => {
  if (score <= 16) {
    return {
      title: "Новачок",
      description:
        "Ви перебуваєте на початковому етапі опанування навичок. Як Новачок, ви зазвичай дієте за чіткими інструкціями та правилами, адже ваш досвід ще обмежений, і вам може бути складно бачити загальний контекст ситуації без сторонньої допомоги. Це чудовий старт! Зараз важливо зосередитися на отриманні базових знань та практичного досвіду."
    };
  }
  if (score <= 32) {
    return {
      title: "Твердий початківець",
      description:
        "Ви вже зробили значний крок вперед! Як Твердий початківець, ви починаєте помічати контекстуальні особливості та застосовувати отриманий досвід, хоча все ще значною мірою покладаєтеся на встановлені правила та інструкції для прийняття рішень. Продовжуйте практикуватися та аналізувати різні робочі ситуації – це допоможе вам розвиватися далі."
    };
  }
  if (score <= 48) {
    return {
      title: "Компетентний",
      description:
        "Вітаємо, ви досягли рівня Компетентного фахівця! На цьому етапі ви вже маєте достатньо досвіду для самостійної роботи з різними ситуаціями та здатні приймати більш складні рішення, планувати свої дії та аналізувати можливі наслідки. Це свідчить про вашу здатність ефективно вирішувати завдання. Чудовий час для того, щоб брати на себе більше відповідальності."
    };
  }
  if (score <= 64) {
    return {
      title: "Досвідчений",
      description:
        "Ваш рівень – Досвідчений фахівець. Ви бачите ситуацію комплексно, розумієте загальну картину та можете інтуїтивно оцінювати різні аспекти проблеми, прогнозуючи можливі результати своїх рішень. Ви здатні ефективно діяти навіть у нестандартних умовах, спираючись на свій багатий досвід. Ваші навички дозволяють вам бути наставником для менш досвідчених колег."
    };
  }
  return {
    title: "Експерт",
    description:
      "Ви – Експерт у своїй сфері! На цьому найвищому етапі ви володієте глибоким, майже інтуїтивним розумінням предметної області. Ви працюєте ефективно без чітких інструкцій, легко адаптуєтесь до будь-яких змін та здатні знаходити інноваційні рішення навіть у найскладніших та неоднозначних ситуаціях. Ваші знання та досвід є надзвичайно цінними, і ви можете виступати в ролі провідного фахівця та стратегічного консультанта."
  };
};

const levelImageMap = {
  'Новачок': 'Beginner.png',
  'Твердий початківець': 'AdvancedBeginner.png',
  'Компетентний': 'Competent.png',
  'Досвідчений': 'Proficient.png',
  'Експерт': 'Expert.png'
};
// Кінець допоміжних функцій та констант

export default function UserProfile() {
  const [photoUrl, setPhotoUrl] = useState(null); // Не використовується у вашому коді, але залишаю
  const [dob, setDob] = useState('');
  const [isEditingDob, setIsEditingDob] = useState(false);
  const [fullName, setFullName] = useState({
    lastName: '',
    firstName: '',
    middleName: '',
  });
  const [editingField, setEditingField] = useState(null);

  // Нові стани для модального вікна та результатів
  const [showDreyfusModal, setShowDreyfusModal] = useState(false);
  const [dreyfusResults, setDreyfusResults] = useState(null);
  const [isLoadingResults, setIsLoadingResults] = useState(false);

  const defaultPhoto = '/default-user.png'; // Переконайтесь, що цей файл є в папці public

  useEffect(() => {
    // Завантаження основних даних профілю
    fetch('https://localhost:7100/profile', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        'Content-Type': 'application/json'
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setFullName({
          lastName: data.lastName || '',
          firstName: data.firstName || '',
          middleName: data.secondName || '', // У вас було secondName
        });
        setDob(data.birthDate ? data.birthDate.split('T')[0] : ''); // Форматуємо дату для input type="date"
      })
      .catch((err) => console.error('Помилка завантаження профілю:', err));
  }, []);

  const saveNameField = async (key) => {
    const map = {
      lastName: 'lastName',
      firstName: 'firstName',
      middleName: 'secondName',
    };
    const value = fullName[key];
    // ... (ваш код для fetch PUT) ...
    try {
      await fetch(`https://localhost:7100/profile/${map[key]}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(value),
      });
      setEditingField(null);
    } catch (error) {
      console.error(`Помилка збереження ${map[key]}:`, error);
    }
  };

  const saveDob = async () => {
    // ... (ваш код для fetch PUT) ...
    try {
      await fetch(`https://localhost:7100/profile/birth`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dob), // Переконайтесь, що формат дати коректний для бекенду
      });
      setIsEditingDob(false);
    } catch (error) {
      console.error('Помилка збереження дати народження:', error);
    }
  };

  const handleNameChange = (key, value) => {
    setFullName((prev) => ({ ...prev, [key]: value }));
  };

  // Функція для завантаження та показу результатів тесту Дрейфус
  const handleViewDreyfusResults = async () => {
    setIsLoadingResults(true);
    setShowDreyfusModal(true); // Показуємо модалку одразу, поки дані вантажаться
    setDreyfusResults(null); // Скидаємо попередні результати

    const userId = getUserIdFromToken(); // Припускаємо, що ця функція повертає ID користувача
    if (!userId) {
      console.error("User ID not found");
      setIsLoadingResults(false);
      // Можна показати помилку в модалці
      setDreyfusResults({ error: "Не вдалося визначити користувача." });
      return;
    }

    try {
      const res = await fetch(`https://localhost:7100/test-results/user/${userId}`, { // Припускаємо такий ендпоінт
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
      });
      if (!res.ok) {
        if (res.status === 404) {
          throw new Error("Результати тесту Дрейфус ще не знайдено. Можливо, ви його не проходили.");
        }
        throw new Error(`Помилка завантаження результатів: ${res.status}`);
      }
      const data = await res.json();
      setDreyfusResults(data);
    } catch (err) {
      console.error('Помилка завантаження результатів Дрейфус:', err);
      setDreyfusResults({ error: err.message }); // Показуємо помилку в модалці
    }
    setIsLoadingResults(false);
  };

  // Компонент для відображення вмісту модального вікна
  const DreyfusResultsModalContent = () => {
    if (isLoadingResults) {
      return <p>Завантаження результатів...</p>;
    }
    if (!dreyfusResults || dreyfusResults.error) {
      return <p>{dreyfusResults?.error || "Не вдалося завантажити результати."}</p>;
    }
    if (!dreyfusResults.dreyfusScore && dreyfusResults.dreyfusScore !== 0) { // Перевірка на наявність результатів
      return <p>Результати тесту Дрейфус ще не знайдено. Можливо, ви його не проходили.</p>;
    }


    const overallScore = dreyfusResults.dreyfusScore;
    const scoresByBlock = dreyfusResults.scoresByBlock;

    const percentage = (overallScore / 80) * 100; // Припускаємо max 80 балів
    const level = getLevelDescription(overallScore);
    let imageSrc = '';
    try {
      imageSrc = require(`../DreyfusTest/${levelImageMap[level.title]}`);
    } catch (e) {
      console.warn(`Image not found for level: ${level.title}`);
    }

    const chartData = scoresByBlock
      ? Object.entries(scoresByBlock).map(([blockKey, score]) => ({
        Block: blockTitles[blockKey] || blockKey,
        Score: score
      }))
      : [];

    return (
      <div className="results-modal-container"> {/* Класи для стилізації модалки */}
        <div className="results-image">
          {imageSrc && <img src={imageSrc} alt={level.title} />}
        </div>
        <div className="results-content">
          <h2>{level.title}</h2>
          <p>Ваш рівень вищий, ніж у {percentage.toFixed(1)}% шукачів роботи.</p>
          <p className="level-description">{level.description}</p>
          {chartData.length > 0 && (
            <div className="chart-container">
              <Chart answers={chartData} /> {/* Переконайтесь, що Chart приймає такий формат */}
            </div>
          )}
          {/* Кнопку "Пройти знову" можна замінити на "Закрити" або прибрати */}
        </div>
      </div>
    );
  };


  return (
    <div className="profile-full">
      <div className="profile-header">
        <img
          src={icon || defaultPhoto} // Використовуємо icon, якщо є, інакше defaultPhoto
          alt="User"
          className="user-photo"
        />
        <div className="fields">
          {Object.entries(fullName).map(([key, value]) => (
            <div className="editable-field" key={key}>
              {editingField === key ? (
                <>
                  <input
                    type="text" // Додав тип для інпутів ПІБ
                    value={value}
                    onChange={(e) => handleNameChange(key, e.target.value)}
                    onBlur={() => saveNameField(key)} // Збереження при втраті фокусу
                    onKeyDown={(e) => e.key === 'Enter' && saveNameField(key)} // Збереження по Enter
                    autoFocus // Автофокус на полі редагування
                  />
                  <span className="edit-icon" onClick={() => saveNameField(key)} title="Зберегти" style={{ cursor: 'pointer' }}>💾</span>
                </>
              ) : (
                <>
                  <span>{value || `Вкажіть ${(key === 'lastName' ? 'прізвище' : key === 'firstName' ? 'ім\'я' : 'по батькові')}`}</span>
                  <span className="edit-icon" onClick={() => setEditingField(key)} title="Редагувати" style={{ cursor: 'pointer' }}>✏️</span>
                </>
              )}
            </div>
          ))}
          <div className="editable-field">
            {isEditingDob ? (
              <>
                <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} />
                <span className="edit-icon" onClick={saveDob} title="Зберегти" style={{ cursor: 'pointer' }}>💾</span>
              </>
            ) : (
              <>
                <span>Дата народження: {dob || "не вказано"}</span>
                <span className="edit-icon" onClick={() => setIsEditingDob(true)} title="Редагувати" style={{ cursor: 'pointer' }}>✏️</span>
              </>
            )}
          </div>
          <div className="recommendation-button-wrapper">
            <a className="recommendation-button" href="/vacancies"> {/* Змінив на /vacancies */}
              Переглянути вакансії
            </a>
          </div>
        </div>
      </div>

      <div className="profile-body">
        <div className="test-card">
          <h3>Тест Дрейфус</h3>
          <div className="test-buttons">
            <button className="test-button primary" onClick={() => window.location.href = '/dreyfus-info'}>Пройти тест</button> {/* Перехід на сторінку тесту */}
            <button className="test-button secondary" onClick={handleViewDreyfusResults}>Переглянути</button> {/* Обробник для модалки */}
          </div>
        </div>
        <div className="test-card">
          <h3>Тест психофізичних характеристик</h3>
          <div className="test-buttons">
            <button className="test-button primary">Пройти тест</button>
            <button className="test-button secondary" disabled>Переглянути</button>
          </div>
        </div>
      </div>

      {/* Модальне вікно для результатів тесту Дрейфус */}
      {showDreyfusModal && (
        <div className="profile-modal-overlay" onClick={() => setShowDreyfusModal(false)}>
          <div className="profile-modal-content" onClick={e => e.stopPropagation()}>
            <button className="profile-modal-close-button" onClick={() => setShowDreyfusModal(false)}>×</button>
            <DreyfusResultsModalContent />
          </div>
        </div>
      )}
    </div>
  );
}