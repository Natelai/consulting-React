import React, { useState } from "react";
import questionsData from "./questionsData";
import { getUserIdFromToken } from '../../actions/auth.js';
import './CareerTestPage.css';
import { professionRequirements } from "./questionsData";

const CareerTestPage = () => {
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({});
  const [modalTitle, setModalTitle] = useState("");

  const handleAnswerChange = (questionId, value) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const allAnswered = questionsData.every(q => answers[q.id] != null);

  const handleSubmit = async () => {
    if (!allAnswered) return;

    const traitScores = { military: {}, civil: {} };
    const traitCounts = { military: {}, civil: {} };

    questionsData.forEach((question) => {
      const value = answers[question.id];
      if (value != null) {
        ["military", "civil"].forEach(domain => {
          const weights = question.weights[domain];
          if (!weights) return;

          Object.entries(weights).forEach(([trait, weight]) => {
            traitScores[domain][trait] = (traitScores[domain][trait] || 0) + weight * value;
            traitCounts[domain][trait] = (traitCounts[domain][trait] || 0) + Math.abs(weight);
          });
        });
      }
    });

    const traitAverages = { military: {}, civil: {} };
    ["military", "civil"].forEach(domain => {
      Object.keys(traitScores[domain]).forEach(trait => {
        traitAverages[domain][trait] = traitCounts[domain][trait] > 0
          ? parseFloat((traitScores[domain][trait] / traitCounts[domain][trait]).toFixed(2))
          : 0;
      });
    });

    const userId = getUserIdFromToken();
    const payload = {
      userId,
      dreyfusScore: 0,
      careerTraits: traitAverages
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

    const maxMinComposition = (userVector, professionMatrix) => {
      const result = {};
      Object.entries(professionMatrix).forEach(([profession, traits]) => {
        const mins = Object.entries(traits).map(([trait, req]) => {
          const userVal = userVector[trait] ?? 0;
          return Math.min(userVal, req);
        });
        result[profession] = parseFloat((Math.max(...mins)).toFixed(2));
      });
      return result;
    };

    const militaryMatches = maxMinComposition(traitAverages.military, professionRequirements.military);
    const civilMatches = maxMinComposition(traitAverages.civil, professionRequirements.civil);

    traitAverages.militaryMatches = militaryMatches;
    traitAverages.civilMatches = civilMatches;

    setResult(traitAverages);
    setShowResults(true);
  };

  const renderResultTable = (title, data) => (
    <div className="results-table-block">
      <h3>{title}</h3>
      <table className="results-table styled">
        <thead>
          <tr>
            <th>Характеристика / Професія</th>
            <th>Оцінка (0 – 1)</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(data).sort((a, b) => b[1] - a[1]).map(([trait, score], idx) => (
            <tr key={idx} className={score > 0.8 ? 'highlight-high' : score < 0.4 ? 'highlight-low' : ''}>
              <td>{trait}</td>
              <td>{score.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const openModal = (type) => {
    setModalTitle(type === "military" ? "Матриця військових професій" : "Матриця цивільних професій");
    setModalContent(professionRequirements[type]);
    setShowModal(true);
  };

  const renderMatrixModal = () => (
    <div className="modal-overlay" onClick={() => setShowModal(false)}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <h2>{modalTitle}</h2>
        {Object.entries(modalContent).map(([profession, traits], i) => (
          <div key={i} style={{ marginBottom: '16px' }}>
            <h4>{profession}</h4>
            <table className="results-table styled">
              <thead>
                <tr>
                  <th>Характеристика</th>
                  <th>Вага</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(traits).map(([trait, weight], j) => (
                  <tr key={j}>
                    <td>{trait}</td>
                    <td>{weight.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
        <button className="close-button" onClick={() => setShowModal(false)}>Закрити</button>
      </div>
    </div>
  );

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
          {!allAnswered && (
            <div className="incomplete-warning" style={{ marginTop: '8px', textAlign: 'center' }}>
              Будь ласка, виберіть відповіді на всі питання перед завершенням тесту.
            </div>
          )}
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
        <>
          <div className="results-columns">
            {renderResultTable("Військові характеристики", result.military)}
            {renderResultTable("Цивільні характеристики", result.civil)}
          </div>
          <div className="results-columns">
            <div style={{ position: 'relative' }}>
              <button className="info-button" onClick={() => openModal("military")}>ℹ️</button>
              {renderResultTable("Відповідність військовим професіям", result.militaryMatches)}
            </div>
            <div style={{ position: 'relative' }}>
              <button className="info-button" onClick={() => openModal("civil")}>ℹ️</button>
              {renderResultTable("Відповідність цивільним професіям", result.civilMatches)}
            </div>
          </div>
          {showModal && renderMatrixModal()}
        </>
      )}
    </div>
  );
};

export default CareerTestPage;
