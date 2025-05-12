import React, { useState } from "react";
import questionsData from "./questionsData";
import { getUserIdFromToken } from '../../actions/auth.js';

const CareerTestPage = () => {
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);

  const handleAnswerChange = (questionId, value) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = async () => {
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
  };

  return (
    <div className="test-page">
      <h1 className="text-3xl font-bold mb-6">Тест для підбору професії</h1>

      {questionsData.map((q) => (
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

      <div className="navigation-buttons">
        <button onClick={handleSubmit} className="restart-button">
          Завершити тест і переглянути результати
        </button>
      </div>

      {result && (
        <div className="results-page">
          <h2 className="text-2xl font-bold mb-4">Ваш профіль характеристик:</h2>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr>
                <th className="border-b p-2">Характеристика</th>
                <th className="border-b p-2">Оцінка</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(result).map(([trait, score], idx) => (
                <tr key={idx}>
                  <td className="border-b p-2">{trait}</td>
                  <td className="border-b p-2">{score.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CareerTestPage;