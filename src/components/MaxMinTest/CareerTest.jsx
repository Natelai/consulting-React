import React, { useState } from "react";
import questionsData from "./questionsData";
import { getUserIdFromToken } from '../../actions/auth.js';
import './CareerTestPage.css';

const CareerTestPage = () => {
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [showResults, setShowResults] = useState(false);

  const handleAnswerChange = (questionId, value) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  // Перевіряємо, чи відповіли на всі питання
  const allAnswered = questionsData.every(q => answers[q.id] != null);

  const handleSubmit = async () => {
    if (!allAnswered) {
      // Можна додати ще повідомлення або вібрацію
      return;
    }

    const traitScores = {};
    const traitCounts = {};

    questionsData.forEach((question) => {
      const answerValue = answers[question.id];
      if (answerValue != null) {
        question.relatedTraits.forEach((trait) => {
          traitScores[trait] = (traitScores[trait] || 0) + answerValue;
          traitCounts[trait] = (traitCounts[trait] || 0) + 1;
        });
      }
    });

    const traitAverages = {};
    for (const trait in traitScores) {
      traitAverages[trait] = traitScores[trait] / traitCounts[trait];
    }

    const userId = getUserIdFromToken();

    const payload = {
      userId,
      dreyfusScore: 0,
      careerTraits: Object.entries(traitAverages).map(([trait, score]) => ({
        trait,
        score: parseFloat(score.toFixed(2))
      }))
    };

    try {
      await fetch(`https://localhost:7100/test-results/career`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify(payload)
      });
    } catch (error) {
      console.error('Error saving career traits:', error);
    }

    setResult(traitAverages);
    setShowResults(true);
  };

  return (
    <div className="test-page">
      <h1 className="text-3xl font-bold mb-6">Тест для підбору професії</h1>

      {!showResults && questionsData.map((q) => (
        <div key={q.id} className="question-card">
          <p>{q.text}</p>
          <div className="options-row">
            {q.options.map((opt, idx) => {
              const selected = answers[q.id] === opt.value;
              return (
                <div
                  key={idx}
                  className={`option-circle ${selected ? "selected" : ""}`}
                  onClick={() => handleAnswerChange(q.id, opt.value)}
                >
                  <div className="circle" />
                  <span>{opt.text}</span>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {!showResults && (
        <div>
          <div>
            {!allAnswered && (
              <div className="incomplete-warning" style={{ marginTop: '8px', textAlign: 'center' }}>
                Будь ласка, виберіть відповіді на всі питання перед завершенням тесту.
              </div>
            )}

          </div>
          <div className="navigation-buttons" style={{ position: 'relative' }}>
            <button
              onClick={handleSubmit}
              className="restart-button"
              disabled={!allAnswered}
            >
              Завершити тест і переглянути результати
            </button>

          </div>
        </div>
      )}

      {showResults && result && (
        <div className="results-page">
          <h2 className="results-title">Ваш профіль характеристик:</h2>
          <div className="results-grid">
            {Object.entries(result).map(([trait, score], idx) => {
              const percentage = Math.round(score * 100);
              const color = `hsl(${percentage * 1.2}, 70%, 50%)`;

              return (
                <div key={idx} className="result-card">
                  <h3 className="trait-name">{trait}</h3>
                  <p className="trait-score">Оцінка: <strong>{percentage}%</strong></p>
                  <div className="progress-bar-background">
                    <div
                      className="progress-bar-fill"
                      style={{ width: `${percentage}%`, backgroundColor: color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
};

export default CareerTestPage;
