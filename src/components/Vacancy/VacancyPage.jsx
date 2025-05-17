import React, { useEffect, useState } from 'react';
import './VacanciesPage.css';
import { getUserIdFromToken } from '../../actions/auth.js';
import { Link } from 'react-router-dom';

const VacanciesPage = () => {
    const [vacancies, setVacancies] = useState([]);
    const [selectedVacancy, setSelectedVacancy] = useState(null);

    const userId = getUserIdFromToken();

    useEffect(() => {
        const fetchVacancies = async () => {
            try {
                const res = await fetch(`https://localhost:7100/vacancies/matched/${userId}`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                    }
                });

                if (!res.ok) {
                    if (res.status === 403) {
                        throw new Error("Тести не пройдено");
                    } else {
                        throw new Error("Помилка при завантаженні вакансій");
                    }
                }

                const data = await res.json();
                setVacancies(data);
            } catch (err) {
                console.error("Error fetching vacancies:", err);
                setVacancies(null);
            }
        };

        fetchVacancies();
    }, []);

    const getMatchColor = (percentage) => {
        if (percentage > 75) return '#4caf50';     // Зелений
        if (percentage >= 50) return '#ff9800';     // Помаранчевий
        return '#f44336';                           // Червоний
    };

    const getExpertiseLevel = (totalScore) => {

        if (totalScore <= 16) return { text: "Новачок", color: "#9e9e9e" };       // Сірий
        if (totalScore <= 32) return { text: "Початківець", color: "#03a9f4" };   // Блакитний
        if (totalScore <= 48) return { text: "Компетентний", color: "#4caf50" }; // Зелений
        if (totalScore <= 64) return { text: "Просунутий", color: "#ff9800" };   // Помаранчевий
        return { text: "Експерт", color: "#f44336" };                            // Червоний
    };

    const ExpertiseBadge = ({ totalScore }) => {
        const { text, color } = getExpertiseLevel(totalScore);
        return (
            <span
                style={{
                    backgroundColor: color,
                    color: 'white',
                    padding: '4px 10px',
                    borderRadius: '12px',
                    fontWeight: '600',
                    fontSize: '0.9rem',
                    display: 'inline-block',
                    minWidth: '100px',
                    textAlign: 'center',
                }}
            >
                {text}
            </span>
        );
    };

    return (
        <div className="vacancies-container">
            <h2>Вакансії, що вам підходять</h2>
            {vacancies === null ? (
                <Link to="/" className="no-vacancies-link">
                    <div className="no-vacancies-container">
                        <div className="no-vacancies-icon">🧪</div>
                        <h3 className="no-vacancies-title">Рекомендацій поки немає</h3>
                        <p className="no-vacancies-message">
                            Щоб побачити вакансії, які вам найкраще підходять,<br />
                            будь ласка, <strong>завершіть проходження всіх тестів</strong>
                        </p>
                        <span className="go-to-tests-button">На головну</span>
                    </div>
                </Link>
            ) : (
                <div className="vacancy-grid">
                    {vacancies.map(({ vacancy, matchPercentage }) => {
                        const topTraits = [...vacancy.requiredTraits]
                            .sort((a, b) => b.score - a.score)
                            .slice(0, 3);

                        const expertiseLevel = getExpertiseLevel(vacancy.requiredDreyfusScore);

                        return (
                            <div
                                key={vacancy.id}
                                className="vacancy-card"
                                onClick={() => setSelectedVacancy({ ...vacancy, matchPercentage })}
                            >
                                <div className="vacancy-top-labels">
                                    <span
                                        className="expertise-badge"
                                        style={{ backgroundColor: expertiseLevel.color }}
                                    >
                                        {expertiseLevel.text}
                                    </span>

                                    {/* Placeholder для цивільна/військова плашки */}
                                    {/* <span className="type-badge">Цивільна</span> */}
                                </div>

                                <div className="vacancy-header">
                                    <h3 className="vacancy-title">{vacancy.title}</h3>
                                    <div
                                        className="match-percentage"
                                        style={{
                                            backgroundColor: getMatchColor(matchPercentage)
                                        }}
                                    >
                                        {matchPercentage.toFixed(1)}%
                                    </div>
                                </div>

                                <p className="short-desc">{vacancy.description.slice(0, 120)}...</p>

                                <div className="skills-list">
                                    {topTraits.map((trait, i) => (
                                        <span key={i} className="skill">
                                            {trait.trait}
                                        </span>
                                    ))}
                                </div>
                            </div>

                        );
                    })}
                </div>
            )}
            {selectedVacancy && (
                <div className="modal-overlay" onClick={() => setSelectedVacancy(null)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <button className="close-button" onClick={() => setSelectedVacancy(null)}>×</button>

                        <h2>{selectedVacancy.title}</h2>

                        {/* Рівень експертності */}
                        <div style={{ marginBottom: '10px' }}>
                            <ExpertiseBadge totalScore={selectedVacancy.requiredDreyfusScore} />
                        </div>

                        <p><strong>Відповідність:</strong> {selectedVacancy.matchPercentage.toFixed(1)}%</p>
                        <p>{selectedVacancy.description}</p>

                        {/* Посилання на вакансію */}
                        <p>
                            <strong>Посилання на вакансію: </strong>
                            <a href={selectedVacancy.link || '#'} target="_blank" rel="noopener noreferrer">
                                {selectedVacancy.link ? selectedVacancy.link : 'Посилання буде додано пізніше'}
                            </a>
                        </p>

                        <h4>Необхідні риси:</h4>
                        <ul className="required-traits-list">
                            {selectedVacancy.requiredTraits.map((trait, i) => {
                                const level = getExpertiseLevel(trait.score * 64); // Масштабування для кольору
                                return (
                                    <li key={i} className="trait-item">
                                        <div
                                            className="trait-badge"
                                            style={{ backgroundColor: level.color }}
                                        >
                                            {trait.trait} — {(trait.score * 100).toFixed(0)}%
                                            <div
                                                className="trait-progress-bar"
                                                style={{
                                                    width: `${(trait.score * 100)}%`,
                                                    backgroundColor: 'rgba(255, 255, 255, 0.7)',
                                                    height: '4px',
                                                    marginTop: '4px',
                                                    borderRadius: '2px',
                                                }}
                                            />
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>

                </div>
            )}
        </div>
    );
};

export default VacanciesPage;
