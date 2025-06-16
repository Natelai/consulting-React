import React, { useEffect, useState, useRef } from 'react';
import './VacanciesPage.css';
import { getUserIdFromToken } from '../../actions/auth.js';
import { Link } from 'react-router-dom';

const ALL_CAREER_TRAITS = [
    "швидкість мислення", "швидкість прийняття рішень", "зорова пам'ять",
    "концентрація уваги", "емоційно-вольова стійкість", "швидкість реакції",
    "координація рухів", "фізична витривалість", "відповідальність",
    "гнучкість мислення", "рухлива пам'ять"
];

const EXPERTISE_LEVELS = [
    { value: 'all', text: "Всі рівні експертності" },
    { value: 'Новачок', text: "Новачок" },
    { value: 'Початківець', text: "Початківець" },
    { value: 'Компетентний', text: "Компетентний" },
    { value: 'Просунутий', text: "Просунутий" },
    { value: 'Експерт', text: "Експерт" }
];

const VACANCY_TYPES = {
    CIVILIAN: 'Цивільна',
    MILITARY: 'Військова'
};

const VacanciesPage = () => {
    const [allVacancies, setAllVacancies] = useState([]);
    const [displayedVacancies, setDisplayedVacancies] = useState([]);
    const [selectedVacancy, setSelectedVacancy] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTypes, setSelectedTypes] = useState([]);
    const [selectedExpertise, setSelectedExpertise] = useState('all');
    const [selectedTraits, setSelectedTraits] = useState([]);

    const [isExpertiseDropdownOpen, setIsExpertiseDropdownOpen] = useState(false); // Для дропдауну експертизи
    const [isTraitsDropdownOpen, setIsTraitsDropdownOpen] = useState(false);

    const userId = getUserIdFromToken();
    const expertiseDropdownRef = useRef(null); // Реф для дропдауну експертизи
    const traitsDropdownRef = useRef(null);

    const getExpertiseLevelDetails = (totalScore) => {
        if (totalScore <= 16) return { text: "Новачок", color: "#9e9e9e" };
        if (totalScore <= 32) return { text: "Початківець", color: "#03a9f4" };
        if (totalScore <= 48) return { text: "Компетентний", color: "#4caf50" };
        if (totalScore <= 64) return { text: "Просунутий", color: "#ff9800" };
        return { text: "Експерт", color: "#f44336" };
    };

    useEffect(() => {
        const fetchVacancies = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const res = await fetch(`https://localhost:7100/vacancies/matched/${userId}`, {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` }
                });
                if (!res.ok) {
                    throw new Error("Тести не пройдено");

                }
                const data = await res.json();
                setAllVacancies(data);
            } catch (err) {
                console.error("Error fetching vacancies:", err);
                setError(err.message);
                setAllVacancies([]);
            }
            setIsLoading(false);
        };
        if (userId) fetchVacancies();
        else {
            setError("Користувач не автентифікований");
            setIsLoading(false);
            setAllVacancies([]);
        }
    }, [userId]);

    useEffect(() => {
        let filtered = [...allVacancies];
        if (searchTerm) {
            filtered = filtered.filter(({ vacancy }) =>
                vacancy.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                vacancy.description.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        if (selectedTypes.length > 0 && selectedTypes.length < Object.keys(VACANCY_TYPES).length) {
            filtered = filtered.filter(({ vacancy }) => selectedTypes.includes(vacancy.type));
        }
        if (selectedExpertise && selectedExpertise !== 'all') {
            filtered = filtered.filter(({ vacancy }) =>
                getExpertiseLevelDetails(vacancy.requiredDreyfusScore).text === selectedExpertise
            );
        }
        if (selectedTraits.length > 0) {
            filtered = filtered.filter(({ vacancy }) =>
                selectedTraits.every(st => vacancy.requiredTraits.some(vt => vt.trait === st))
            );
        }
        setDisplayedVacancies(filtered);
    }, [allVacancies, searchTerm, selectedTypes, selectedExpertise, selectedTraits]);

    // Обробник кліків поза дропдаунами
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (traitsDropdownRef.current && !traitsDropdownRef.current.contains(event.target)) {
                setIsTraitsDropdownOpen(false);
            }
            if (expertiseDropdownRef.current && !expertiseDropdownRef.current.contains(event.target)) {
                setIsExpertiseDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const getMatchColor = (percentage) => {
        if (percentage > 75) return '#4caf50';
        if (percentage >= 50) return '#ff9800';
        return '#f44336';
    };

    const ExpertiseBadge = ({ totalScore }) => {
        const { text, color } = getExpertiseLevelDetails(totalScore);
        return <span className="expertise-badge" style={{ backgroundColor: color }}>{text}</span>;
    };

    const handleTypeToggle = (type) => {
        setSelectedTypes(prev => prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]);
    };

    const handleTraitCheckboxChange = (trait) => {
        setSelectedTraits(prev => prev.includes(trait) ? prev.filter(t => t !== trait) : [...prev, trait]);
    };

    const getSelectedTraitsText = () => {
        if (selectedTraits.length === 0) return "Всі характеристики";
        if (selectedTraits.length === 1) return selectedTraits[0];
        return `Вибрано: ${selectedTraits.length}`;
    };

    const handleExpertiseSelect = (value) => {
        setSelectedExpertise(value);
        setIsExpertiseDropdownOpen(false); // Закриваємо дропдаун після вибору
    };

    const getSelectedExpertiseText = () => {
        const selectedLevel = EXPERTISE_LEVELS.find(level => level.value === selectedExpertise);
        return selectedLevel ? selectedLevel.text : "Всі рівні експертності";
    };


    if (isLoading) return <div className="vacancies-container"><p>Завантаження вакансій...</p></div>;
    if (error === "Тести не пройдено") return (
        <div className="vacancies-container">
            <Link to="/dreyfus-info" className="no-vacancies-link">
                <div className="no-vacancies-container">
                    <div className="no-vacancies-icon">📝</div>
                    <h3 className="no-vacancies-title">Рекомендацій поки немає</h3>
                    <p className="no-vacancies-message">Щоб побачити вакансії, які вам найкраще підходять,<br />будь ласка, <strong>завершіть проходження всіх тестів</strong>.</p>
                    <span className="go-to-tests-button">Пройти тести</span>
                </div>
            </Link>
        </div>
    );
    if (error) return <div className="vacancies-container error-message"><p>{error}</p></div>;

    return (
        <div className="vacancies-container">
            <h2>Вакансії, що вам підходять</h2>
            <div className="filters-section">
                <div className="main-filters-row">
                    <div className="filter-group type-filter">
                        <button
                            className={`type-pill ${selectedTypes.includes(VACANCY_TYPES.CIVILIAN) ? 'active' : ''}`}
                            onClick={() => handleTypeToggle(VACANCY_TYPES.CIVILIAN)}
                            style={{ '--type-color': '#755ad6' }}
                        >
                            {VACANCY_TYPES.CIVILIAN}
                        </button>
                        <button
                            className={`type-pill ${selectedTypes.includes(VACANCY_TYPES.MILITARY) ? 'active' : ''}`}
                            onClick={() => handleTypeToggle(VACANCY_TYPES.MILITARY)}
                            style={{ '--type-color': '#357266' }}
                        >
                            {VACANCY_TYPES.MILITARY}
                        </button>
                    </div>

                    {/* Кастомний дропдаун для Рівня Експертності */}
                    <div className="filter-group custom-dropdown-group" ref={expertiseDropdownRef}>
                        <button
                            className="filter-select dropdown-button" // Загальний клас для кнопок дропдаунів
                            onClick={() => setIsExpertiseDropdownOpen(!isExpertiseDropdownOpen)}
                        >
                            <span className="dropdown-button-text">{getSelectedExpertiseText()}</span>
                            <span className={`dropdown-arrow ${isExpertiseDropdownOpen ? 'open' : ''}`}>▼</span>
                        </button>
                        {isExpertiseDropdownOpen && (
                            <div className="custom-dropdown-list"> {/* Загальний клас для списків */}
                                {EXPERTISE_LEVELS.map(level => (
                                    <div
                                        key={level.value}
                                        className={`custom-dropdown-item ${selectedExpertise === level.value ? 'selected' : ''}`}
                                        onClick={() => handleExpertiseSelect(level.value)}
                                    >
                                        {level.text}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Кастомний дропдаун для Характеристик */}
                    <div className="filter-group custom-dropdown-group" ref={traitsDropdownRef}>
                        <button
                            className="filter-select dropdown-button" // Загальний клас для кнопок дропдаунів
                            onClick={() => setIsTraitsDropdownOpen(!isTraitsDropdownOpen)}
                        >
                            <span className="dropdown-button-text">{getSelectedTraitsText()}</span>
                            <span className={`dropdown-arrow ${isTraitsDropdownOpen ? 'open' : ''}`}>▼</span>
                        </button>
                        {isTraitsDropdownOpen && (
                            <div className="custom-dropdown-list traits-dropdown-list"> {/* Додатковий клас для можливих специфічних стилів */}
                                {ALL_CAREER_TRAITS.map(trait => (
                                    <label key={trait} className="trait-checkbox-label custom-dropdown-item"> {/* Додав custom-dropdown-item для спільного стилю */}
                                        <input
                                            type="checkbox"
                                            value={trait}
                                            checked={selectedTraits.includes(trait)}
                                            onChange={() => handleTraitCheckboxChange(trait)}
                                        />
                                        {trait}
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
                <div className="search-filter-row">
                    <div className="filter-group search-filter-full-width">
                        <input
                            type="text"
                            placeholder="Пошук..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input"
                        />
                    </div>
                </div>
            </div>

            {/* Решта JSX без змін (список вакансій, модальне вікно) */}
            {displayedVacancies.length === 0 && !isLoading ? (
                <div className="no-vacancies-container">
                    <div className="no-vacancies-icon">🤷</div>
                    <h3 className="no-vacancies-title">Вакансій не знайдено</h3>
                    <p className="no-vacancies-message">Спробуйте змінити критерії фільтрації або пошуку.</p>
                </div>
            ) : (
                <div className="vacancy-grid">
                    {displayedVacancies.map(({ vacancy, matchPercentage }) => (
                        <div
                            key={vacancy.id}
                            className="vacancy-card"
                            onClick={() => setSelectedVacancy({ ...vacancy, matchPercentage })}
                        >
                            <div className="vacancy-top-labels">
                                {vacancy.type && (
                                    <span
                                        className="type-badge"
                                        style={{ backgroundColor: vacancy.type === VACANCY_TYPES.MILITARY ? '#357266' : '#755ad6' }}
                                    >
                                        {vacancy.type}
                                    </span>
                                )}
                                <ExpertiseBadge totalScore={vacancy.requiredDreyfusScore} />
                            </div>
                            <div className="vacancy-header">
                                <h3 className="vacancy-title">{vacancy.title}</h3>
                                <div className="match-percentage" style={{ backgroundColor: getMatchColor(matchPercentage) }}>
                                    {matchPercentage.toFixed(1)}%
                                </div>
                            </div>
                            <p className="short-desc">{vacancy.description.slice(0, 120)}...</p>
                            <div className="skills-list">
                                {[...vacancy.requiredTraits].sort((a, b) => b.score - a.score).slice(0, 3).map((trait, i) => (
                                    <span key={i} className="skill">{trait.trait}</span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
            {selectedVacancy && (
                <div className="modal-overlay" onClick={() => setSelectedVacancy(null)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <button className="close-button" onClick={() => setSelectedVacancy(null)}>×</button>
                        <h2>{selectedVacancy.title}</h2>
                        <div className="vacancy-modal-top-info">
                            {selectedVacancy.type && (
                                <span
                                    className="type-badge"
                                    style={{
                                        backgroundColor: selectedVacancy.type === VACANCY_TYPES.MILITARY ? '#357266' : '#755ad6',
                                        marginRight: '10px'
                                    }}
                                >
                                    {selectedVacancy.type}
                                </span>
                            )}
                            <ExpertiseBadge totalScore={selectedVacancy.requiredDreyfusScore} />
                        </div>
                        <p className="modal-match-percentage"><strong>Відповідність:</strong> {selectedVacancy.matchPercentage.toFixed(1)}%</p>
                        <p className="modal-description">{selectedVacancy.description}</p>
                        <p>
                            <button
                                className="apply-button"
                                onClick={() => window.open(selectedVacancy.link, '_blank', 'noopener,noreferrer')}
                            >
                                Відгукнутись на вакансію ✅
                            </button>
                        </p>
                        <h4>Необхідні риси:</h4>
                        <ul className="required-traits-list">
                            {selectedVacancy.requiredTraits.map((trait, i) => {
                                const traitScorePercentage = trait.score * 100;
                                let traitColor = '#78909c';
                                if (traitScorePercentage >= 75) traitColor = '#4caf50';
                                else if (traitScorePercentage >= 50) traitColor = '#ffb300';
                                return (
                                    <li key={i} className="trait-item">
                                        <div className="trait-badge" style={{ backgroundColor: traitColor }}>
                                            {trait.trait} — {traitScorePercentage.toFixed(0)}%
                                            <div
                                                className="trait-progress-bar"
                                                style={{
                                                    width: `${traitScorePercentage}%`,
                                                    backgroundColor: 'rgba(255, 255, 255, 0.7)',
                                                    height: '4px',
                                                    marginTop: '4px',
                                                    borderRadius: '2px'
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