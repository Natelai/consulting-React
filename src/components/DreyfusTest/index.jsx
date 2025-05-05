import React, { useState } from 'react';
import questionsData from './questionsData';
import Chart from './Chart';
import './DreyfusTestPage.css';
import { getUserIdFromToken } from '../../actions/auth.js';

const blocksOrder = ['Novice', 'AdvancedBeginner', 'Competent', 'Proficient', 'Expert'];

const DreyfusTestPage = () => {
  const [currentBlockIndex, setCurrentBlockIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [chartData, setChartData] = useState([]);
  const [overallScore, setOverallScore] = useState(0);

  const currentBlock = blocksOrder[currentBlockIndex];

  const handleAnswer = (questionId, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleNext = () => {
    setCurrentBlockIndex(current => current + 1);
  };

  const handlePrevious = () => {
    setCurrentBlockIndex(current => current - 1);
  };

  const handleFinish = async () => {
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

  const restartTest = () => {
    setAnswers({});
    setCurrentBlockIndex(0);
    setShowResults(false);
    setChartData([]);
    setOverallScore(0);
  };

  if (showResults) {
    const percentage = (overallScore / 80) * 100;
    return (
      <div className="results-page">
        <h2>Ваш результат: {overallScore}</h2>
        <p>{getLevelDescription(overallScore)}</p>
        <p>Ваш рівень вищий, ніж у {percentage.toFixed(2)}% шукачів роботи.</p>
        <Chart answers={chartData} />
        <button onClick={restartTest} className="restart-button">Пройти знову</button>
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

      <h2>{currentBlock}</h2>
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

      <div className="navigation-buttons">
        <button onClick={handlePrevious} disabled={currentBlockIndex === 0}>Previous</button>
        {currentBlockIndex === blocksOrder.length - 1 ? (
          <button onClick={handleFinish}>Finish</button>
        ) : (
          <button onClick={handleNext}>Next</button>
        )}
      </div>
    </div>
  );
};

const getLevelDescription = (score) => {
  if (score <= 16) return "Ви новачок.";
  if (score <= 32) return "Ви початківець.";
  if (score <= 48) return "Ви компетентний.";
  if (score <= 64) return "Ви просунутий.";
  return "Ви експерт.";
};

export default DreyfusTestPage;
