import React from 'react';
import './DreyfusTestPage.css'; // Імпортуємо звичайний CSS файл
import { useNavigate } from 'react-router-dom';

const DreyfusTestInfoPage = () => {
    const navigate = useNavigate();
    const onStartTest = () => {
        navigate('/dreyfus');
    };

    return (
        <div className="testInfoPageContainer">
            <header className="dreyfusPageHeader">
                <h1 className="headerMainTitle">
                    Цей тест допоможе визначити ваш рівень на основі консультаційної моделі братів Дрейфус, яка розділяє процес навчання на 5 етапів
                </h1>
                <div className="headerInfoBlocksContainer">
                    <div className="infoBlock">
                        <span className="infoBlockIcon">📝</span> {/* Блокнот з олівцем */}
                        <p>Вам буде запропоновано кілька блоків питань, що охоплюють різні аспекти програмування.</p>
                    </div>
                    <div className="infoBlock">
                        <span className="infoBlockIcon">🔢</span> {/* Цифри */}
                        <p>Відповіді оцінюються в балах, а підсумковий результат визначає ваш рівень.</p>
                    </div>
                    <div className="infoBlock">
                        <span className="infoBlockIcon">📊</span> {/* Графік */}
                        <p>По завершенню тесту ви отримаєте візуалізацію результатів та рекомендації щодо розвитку.</p>
                    </div>
                </div>
            </header>

            <section className="testDescriptionContent">
                <h2>🤔 Що це за тест?</h2>
                <p>
                    Модель оцінки навичок братів Дрейфус – це відомий підхід до визначення рівня розвитку професійних компетенцій людини в процесі навчання та роботи. Вона описує п'ять послідовних етапів, через які проходить фахівець, здобуваючи досвід: від Новачка 🚀 до Експерта 🌟. Цей тест допоможе вам зрозуміти, на якому з цих етапів ви перебуваєте у вашій сфері діяльності або в навичках, які ви прагнете оцінити.
                </p>

                <h2>💡 Чому це важливо?</h2>
                <p>
                    Розуміння вашого поточного рівня за моделлю Дрейфус дозволить:
                </p>
                <ul>
                    <li>✅ Об'єктивно оцінити свої сильні сторони та зони для розвитку.</li>
                    <li>🎯 Отримати більш точні та релевантні рекомендації щодо вибору професії чи напрямку кар'єрного зростання.</li>
                    <li>🌱 Сформувати реалістичні очікування та спланувати наступні кроки для досягнення успіху.</li>
                </ul>


                <p className="goodLuckMessage">
                    Бажаємо успіху! 🍀 Ваші відповіді допоможуть нам надати вам найцінніші поради.
                </p>
            </section>

            <div className="actionButtonContainer">
                <button className="startTestButton" onClick={onStartTest}>
                    Пройти тест
                </button>
            </div>
        </div>
    );
};

export default DreyfusTestInfoPage;