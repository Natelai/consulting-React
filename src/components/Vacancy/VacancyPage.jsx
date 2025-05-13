import React, { useEffect, useState } from 'react';
import './VacanciesPage.css';
import { getUserIdFromToken } from '../../actions/auth.js';

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
                const data = await res.json();
                setVacancies(data);
            } catch (err) {
                console.error("Error fetching vacancies:", err);
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


    return (
        <div className="vacancies-container">
            <h2>Вакансії, що вам підходять</h2>
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

            {selectedVacancy && (
                <div className="modal-overlay" onClick={() => setSelectedVacancy(null)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <button className="close-button" onClick={() => setSelectedVacancy(null)}>×</button>
                        <h2>{selectedVacancy.title}</h2>
                        <p><strong>Відповідність:</strong> {selectedVacancy.matchPercentage.toFixed(1)}%</p>
                        <p>{selectedVacancy.description}</p>
                        <h4>Необхідні риси:</h4>
                        <ul>
                            {selectedVacancy.requiredTraits.map((trait, i) => (
                                <li key={i}>{trait.trait} — {trait.score}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VacanciesPage;
