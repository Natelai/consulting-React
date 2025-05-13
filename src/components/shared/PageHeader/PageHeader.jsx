import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faSignOutAlt, faBars } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import './PageHeader.css';
import logo from '../../../logo.png';

function PageHeader({ isAuthenticated, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleButtonClick = (destination) => {
    navigate(`/${destination}`);
    setMenuOpen(false); // закриваємо меню після переходу
  };

  return (
    <header className="page-header">
      <div className="left-section">
        <img src={logo} alt="Logo" className="logo" onClick={() => handleButtonClick('')} />
        <span className="title" onClick={() => handleButtonClick('')}>Consulting Platform</span>
      </div>

      <div className="right-section">
        <div className="menu-icon" onClick={toggleMenu}>
          <FontAwesomeIcon icon={faBars} />
        </div>

        <div className={`nav-items ${menuOpen ? 'open' : ''}`}>
          {isAuthenticated ? (
            <>
              <FontAwesomeIcon icon={faUser} className="icon" title="Profile" />
              <FontAwesomeIcon
                icon={faSignOutAlt}
                className="icon"
                title="Logout"
                onClick={onLogout}
              />
            </>
          ) : (
            <>
              <button className="auth-button" onClick={() => handleButtonClick('register')}>Register</button>
              <button className="auth-button" onClick={() => handleButtonClick('login')}>Login</button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default PageHeader;
