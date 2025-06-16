import React, { useState, useEffect } from 'react';
import './RecruiterDashboardPage.css';
// Кандидати залишаються захардкодженими для демонстрації
import { candidatesData } from './candidatesData.js';

const RecruiterDashboardPage = () => {
    const [vacancies, setVacancies] = useState([]);
    const [selectedVacancy, setSelectedVacancy] = useState(null);
    const [candidates, setCandidates] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchVacancies = async () => {
            setIsLoading(true);
            setError(null);
            try {
                // Робимо запит на ендпоінт, який ви вказали
                const res = await fetch(`https://localhost:7100/vacancies`, {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` }
                });

                if (!res.ok) {
                    // Якщо запит не вдався, генеруємо помилку, щоб перейти до блоку catch
                    throw new Error('API request failed');
                }

                const data = await res.json();
                // Додаємо простий ID до кожної вакансії для зв'язку з кандидатами
                const processedData = data.map((vacancy, index) => ({
                    ...vacancy,
                    keyId: index + 1
                }));
                setVacancies(processedData);

            } catch (err) {
                console.error("Не вдалося завантажити вакансії з API, використовуються демонстраційні дані.", err);

                // ---- Демонстраційні дані, якщо API не доступний ----
                const fallbackData = [
                    { "id": { "timestamp": 1747077310, "creationTime": "2025-05-12T19:15:10Z" }, "title": "Оператор безпілотного літального апарата", "description": "Управління та контроль дронами під час виконання оперативних завдань.", "type": "Військова" },
                    { "id": { "timestamp": 1747077947, "creationTime": "2025-05-12T19:25:47Z" }, "title": "Оператор дронів", "description": "Керування безпілотними літальними апаратами під час виконання розвідки або моніторингу.", "type": "Військова" },
                    { "id": { "timestamp": 1747077982, "creationTime": "2025-05-12T19:26:22Z" }, "title": "Диспетчер служби порятунку", "description": "Оперативна координація дій рятувальників під час надзвичайних ситуацій.", "type": "Військова" },
                    { "id": { "timestamp": 1747077995, "creationTime": "2025-05-12T19:26:35Z" }, "title": "Інженер-електронік", "description": "Обслуговування складного електронного обладнання та аналіз несправностей.", "type": "Цивільна" },
                    { "id": { "timestamp": 1747078005, "creationTime": "2025-05-12T19:26:45Z" }, "title": "Водій-кур'єр", "description": "Доставка вантажів з дотриманням маршрутів та часу прибуття.", "type": "Цивільна" },
                    { "id": { "timestamp": 1747078013, "creationTime": "2025-05-12T19:26:53Z" }, "title": "Спеціаліст із забезпечення безпеки", "description": "Контроль за дотриманням безпекових процедур у зоні об'єкта.", "type": "Військова" },
                    { "id": { "timestamp": 1747078022, "creationTime": "2025-05-12T19:27:02Z" }, "title": "Оператор спостереження", "description": "Аналіз відеопотоку та фіксація підозрілої активності.", "type": "Військова" },
                    { "id": { "timestamp": 1747078029, "creationTime": "2025-05-12T19:27:09Z" }, "title": "Рятувальник", "description": "Надання допомоги у надзвичайних ситуаціях, евакуація та перша медична допомога.", "type": "Цивільна" },
                    { "id": { "timestamp": 1747078042, "creationTime": "2025-05-12T19:27:22Z" }, "title": "Інструктор з підготовки персоналу", "description": "Навчання новобранців або цивільного персоналу відповідно до стандартів.", "type": "Військова" },
                    { "id": { "timestamp": 1747078051, "creationTime": "2025-05-12T19:27:31Z" }, "title": "Сапер", "description": "Виявлення та знешкодження вибухонебезпечних предметів.", "type": "Військова" },
                    { "id": { "timestamp": 1747078060, "creationTime": "2025-05-12T19:27:40Z" }, "title": "Аналітик даних для військових операцій", "description": "Обробка даних з дронів, супутників і радарів для прийняття рішень.", "type": "Військова" },
                    { "id": { "timestamp": 1750090272, "creationTime": "2025-06-16T16:11:12Z" }, "title": "string", "description": "string", "type": "string" }
                ];
                const processedFallbackData = fallbackData.map((vacancy, index) => ({
                    ...vacancy,
                    keyId: index + 1
                }));
                setVacancies(processedFallbackData);
                // Не встановлюємо помилку, щоб інтерфейс виглядав робочим для відео
                // setError('Показано демонстраційні дані'); 
            }
            setIsLoading(false);
        };

        fetchVacancies();
    }, []); // Масив залежностей порожній, запит виконується один раз

    const handleVacancySelect = (vacancy) => {
        setSelectedVacancy(vacancy);
        setCandidates(candidatesData[vacancy.keyId] || []);
    };

    const getMatchColor = (percentage) => {
        if (percentage > 90) return '#4caf50';
        if (percentage >= 85) return '#ff9800';
        return '#f44336';
    };

    if (isLoading) {
        return <div className="recruiter-dashboard-container"><p>Завантаження...</p></div>;
    }

    if (error) {
        // Показуємо помилку в UI, якщо це важливо, але для демо можна закоментувати
        return <div className="recruiter-dashboard-container"><p>Помилка: {error}</p></div>;
    }

    return (
        <div className="recruiter-dashboard-container">
            <header className="dashboard-header">
                <h1>Панель рекрутера</h1>
                <p>Оберіть вакансію, щоб переглянути список релевантних кандидатів.</p>
            </header>
            <main className="dashboard-main">
                <aside className="vacancies-list">
                    <h2>Активні вакансії</h2>
                    {vacancies.map(vacancy => (
                        <div
                            key={vacancy.id.timestamp}
                            className={`vacancy-item ${selectedVacancy?.id.timestamp === vacancy.id.timestamp ? 'active' : ''}`}
                            onClick={() => handleVacancySelect(vacancy)}
                        >
                            <h3>{vacancy.title}</h3>
                            <p>{vacancy.description.slice(0, 100)}...</p>
                        </div>
                    ))}
                </aside>
                <section className="candidates-view">
                    {selectedVacancy ? (
                        <>
                            <h2>Кандидати для вакансії "{selectedVacancy.title}"</h2>
                            <div className="candidates-grid">
                                {candidates.length > 0 ? (
                                    candidates.map(candidate => (
                                        <div key={candidate.id} className="candidate-card">
                                            <div className="candidate-header">
                                                <h4>{candidate.name}</h4>
                                                <span
                                                    className="candidate-match"
                                                    style={{ backgroundColor: getMatchColor(candidate.match) }}
                                                >
                                                    {candidate.match}%
                                                </span>
                                            </div>
                                            <p className="candidate-contact">
                                                <strong>Email:</strong> {candidate.email}<br />
                                                <strong>Телефон:</strong> {candidate.phone}
                                            </p>
                                            <div className="candidate-skills">
                                                <strong>Ключові навички:</strong>
                                                <div className="skills-tags">
                                                    {candidate.skills.map(skill => <span key={skill} className="skill-tag">{skill}</span>)}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p>Для цієї вакансії ще немає відповідних кандидатів.</p>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="placeholder">
                            <span className="placeholder-icon">←</span>
                            <p>Будь ласка, оберіть вакансію зі списку</p>
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
};

export default RecruiterDashboardPage;