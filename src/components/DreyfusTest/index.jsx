import React, { useState } from 'react';
import questionsData from './questionsData';
import Chart from './Chart';
import './DreyfusTestPage.css';
import { getUserIdFromToken } from '../../actions/auth.js';

const blocksOrder = ['Novice', 'AdvancedBeginner', 'Competent', 'Proficient', 'Expert'];

const blockTitles = {
  Novice: 'Новачок',
  AdvancedBeginner: 'Твердий початківець',
  Competent: 'Компетентний',
  Proficient: 'Досвідчений',
  Expert: 'Експерт'
};

const DreyfusTestPage = () => {
  const [currentBlockIndex, setCurrentBlockIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [chartData, setChartData] = useState([]);
  const [overallScore, setOverallScore] = useState(0);
  const [showIncompleteWarning, setShowIncompleteWarning] = useState(false);

  const currentBlock = blocksOrder[currentBlockIndex];

  const handleAnswer = (questionId, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleNext = () => {
    if (!isCurrentBlockComplete()) {
      setShowIncompleteWarning(true);
      return;
    }
    setShowIncompleteWarning(false);
    setCurrentBlockIndex(current => current + 1);
  };

  const handlePrevious = () => {
    setCurrentBlockIndex(current => current - 1);
  };

  const handleFinish = async () => {
    if (!isCurrentBlockComplete()) {
      setShowIncompleteWarning(true);
      return;
    }
    setShowIncompleteWarning(false);
    const scoresByBlock = {};
    let total = 0;

    blocksOrder.forEach(block => {
      const questions = questionsData[block];
      let sum = 0;
      questions.forEach(q => {
        const selectedLabel = answers[q.id];
        const option = q.options.find(o => o.label === selectedLabel);
        if (option) {
          sum += option.score;
          total += option.score;
        }
      });
      scoresByBlock[block] = sum;
    });

    const userId = getUserIdFromToken();

    const payload = {
      userId,
      dreyfusScore: total,
      careerTraits: []
    };

    try {
      await fetch("https://localhost:7100/test-results/dreyfus", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify(payload)
      });
    } catch (error) {
      console.error('Error saving Dreyfus result:', error);
    }

    const chartPoints = Object.entries(scoresByBlock).map(([block, score]) => ({
      Block: block,
      Score: score
    }));

    setOverallScore(total);
    setChartData(chartPoints);
    setShowResults(true);
  };

  React.useEffect(() => {
    if (isCurrentBlockComplete() && showIncompleteWarning) {
      setShowIncompleteWarning(false);
    }
  }, [answers, currentBlockIndex, showIncompleteWarning]);

  const restartTest = () => {
    setAnswers({});
    setCurrentBlockIndex(0);
    setShowResults(false);
    setChartData([]);
    setOverallScore(0);
  };

  const levelImageMap = {
    'Новачок': 'Beginner.png',
    'Твердий початківець': 'AdvancedBeginner.png',
    'Компетентний': 'Competent.png',
    'Досвідчений': 'Proficient.png',
    'Експерт': 'Expert.png'
  };

  const isCurrentBlockComplete = () => {
    return questionsData[currentBlock].every(q => answers[q.id]);
  };

  if (showResults) {
    const percentage = (overallScore / 80) * 100;
    const level = getLevelDescription(overallScore);
    const levelTitle = level.title;
    const levelDescription = level.description;

    return (
      <div className="results-page">
        <div className="results-container">
          <div className="results-image">
            <img
              src={require(`./${levelImageMap[levelTitle]}`)}
              alt={levelTitle}
            />
          </div>
          <div className="results-content">
            <h2>{levelTitle}</h2>
            <p>Ваш рівень вищий, ніж у {percentage.toFixed(2)}% шукачів роботи.</p>
            <p className="level-description">{levelDescription}</p>
            <div className="chart-container">
              <Chart answers={chartData} />
            </div>

            <button onClick={restartTest} className="restart-button">Пройти знову</button>
          </div>


        </div>


      </div>
    );
  }

  return (
    <div className="test-page">
      <div className="progress-bar-container">
        <div className="progress-text">
          Блок {currentBlockIndex + 1} із {blocksOrder.length}
        </div>
        <div className="progress-bar-background">
          <div
            className="progress-bar-fill"
            style={{ width: `${((currentBlockIndex + 1) / blocksOrder.length) * 100}%` }}
          />
        </div>
      </div>

      <h2>{blockTitles[currentBlock]}</h2>
      {questionsData[currentBlock].map(q => (
        <div key={q.id} className="question-card fade-in">
          <p>{q.question}</p>
          <div className="options-row">
            {q.options.map(opt => (
              <label
                key={opt.label}
                className={`option-circle ${answers[q.id] === opt.label ? 'selected' : ''}`}
              >
                <input
                  type="radio"
                  name={q.id}
                  value={opt.label}
                  checked={answers[q.id] === opt.label}
                  onChange={() => handleAnswer(q.id, opt.label)}
                  style={{ display: 'none' }}
                />
                <div className="circle" />
                <span>{opt.label}</span>
              </label>
            ))}
          </div>
        </div>
      ))}

      {showIncompleteWarning && (
        <div className="incomplete-warning" style={{ marginTop: '0.5rem', textAlign: 'center' }}>
          Будь ласка, виберіть відповіді на всі питання, щоб продовжити.
        </div>
      )}

      <div className="navigation-buttons" style={{ marginTop: '1rem' }}>
        <button className="back-button" onClick={handlePrevious} disabled={currentBlockIndex === 0}>
          Назад
        </button>

        {currentBlockIndex === blocksOrder.length - 1 ? (
          <button
            className="finish-button"
            onClick={handleFinish}
          >
            Завершити
          </button>
        ) : (
          <button
            className="next-button"
            onClick={handleNext}
          >
            Далі
          </button>
        )}
      </div>
    </div>
  );
};

const getLevelDescription = (score) => {
  if (score <= 16) {
    return {
      title: "Новачок",
      description:
        "На цьому етапі кандидат має обмежений досвід і не здатен бачити контекстуальні особливості."
    };
  }
  if (score <= 32) {
    return {
      title: "Твердий початківець",
      description:
        "Особа на цьому етапі починає помічати контекстуальні особливості, але все ще покладається на чіткі правила та інструкції."
    };
  }
  if (score <= 48) {
    return {
      title: "Компетентний",
      description:
        "Особа здатна робити більш складні рішення, оскільки має досвід роботи з різними ситуаціями."
    };
  }
  if (score <= 64) {
    return {
      title: "Досвідчений",
      description:
        "Кандидат починає бачити загальну картину і здатний прогнозувати можливі результати своїх рішень."
    };
  }
  return {
    title: "Експерт",
    description:
      "Людина на цьому етапі володіє глибоким розумінням своєї сфери, працює без чітких інструкцій і може надавати рекомендації навіть у складних ситуаціях."
  };
};


export default DreyfusTestPage;
