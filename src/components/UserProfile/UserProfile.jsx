import React, { useEffect, useState } from 'react';
import './UserProfile.css';
import icon from './icon.jpeg';

export default function UserProfile() {
  const [photoUrl, setPhotoUrl] = useState(null);
  const [dob, setDob] = useState('');
  const [isEditingDob, setIsEditingDob] = useState(false);
  const [fullName, setFullName] = useState({
    lastName: '',
    firstName: '',
    middleName: '',
  });
  const [editingField, setEditingField] = useState(null);

  const defaultPhoto = '/default-user.png';

  useEffect(() => {
    fetch('https://localhost:7100/profile', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        'Content-Type': 'application/json'
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setFullName({
          lastName: data.lastName || '',
          firstName: data.firstName || '',
          middleName: data.secondName || '',
        });
        setDob(data.birthDate || '');
      })
      .catch((err) => console.error('Помилка завантаження профілю:', err));
  }, []);

  const saveNameField = async (key) => {
    const map = {
      lastName: 'lastName',
      firstName: 'firstName',
      middleName: 'secondName',
    };
    const value = fullName[key];

    await fetch(`https://localhost:7100/profile/${map[key]}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(value),
    });

    setEditingField(null);
  };

  const saveDob = async () => {
    await fetch(`https://localhost:7100/profile/birth`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dob),
    });
    setIsEditingDob(false);
  };

  const handleNameChange = (key, value) => {
    setFullName((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="profile-full">
      <div className="profile-header">
        <img
          src={icon || defaultPhoto}
          alt="User"
          className="user-photo"
        />

        <div className="fields">
          {Object.entries(fullName).map(([key, value]) => (
            <div className="editable-field" key={key}>
              {editingField === key ? (
                <>
                  <input
                    value={value}
                    onChange={(e) => handleNameChange(key, e.target.value)}
                  />
                  <span
                    className="edit-icon"
                    onClick={() => saveNameField(key)}
                    title="Зберегти"
                    style={{ cursor: 'pointer' }}
                  >
                    💾
                  </span>
                </>
              ) : (
                <>
                  <span>{value}</span>
                  <span
                    className="edit-icon"
                    onClick={() => setEditingField(key)}
                    title="Редагувати"
                    style={{ cursor: 'pointer' }}
                  >
                    ✏️
                  </span>
                </>
              )}
            </div>
          ))}

          <div className="editable-field">
            {isEditingDob ? (
              <>
                <input
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                />
                <span
                  className="edit-icon"
                  onClick={saveDob}
                  title="Зберегти"
                  style={{ cursor: 'pointer' }}
                >
                  💾
                </span>
              </>
            ) : (
              <>
                <span>Дата народження: {dob}</span>
                <span
                  className="edit-icon"
                  onClick={() => setIsEditingDob(true)}
                  title="Редагувати"
                  style={{ cursor: 'pointer' }}
                >
                  ✏️
                </span>
              </>
            )}
          </div>

          <div className="recommendation-button-wrapper">
            <a className="recommendation-button" href="/recommendations">
              Переглянути вакансії
            </a>
          </div>
        </div>
      </div>

      <div className="profile-body">
        <div className="test-card">
          <h3>Тест Дрейфуса</h3>
          <div className="test-buttons">
            <button className="test-button primary">Пройти тест</button>
            <button className="test-button secondary" disabled>Переглянути</button>
          </div>
        </div>

        <div className="test-card">
          <h3>Тест психофізичних характеристик</h3>
          <div className="test-buttons">
            <button className="test-button primary">Пройти тест</button>
            <button className="test-button secondary" disabled>Переглянути</button>
          </div>
        </div>
      </div>
    </div>
  );
}
