import { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { auth } from '../../firebase';
import { signOut } from 'firebase/auth';
import './Header.css';

export default function Header() {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const location = useLocation();
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Close panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isPanelOpen && !event.target.closest('.settings-panel') && 
          !event.target.closest('.settings-button')) {
        setIsPanelOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isPanelOpen]);

  // Close panel when location changes
  useEffect(() => {
    setIsPanelOpen(false);
  }, [location]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const getPageTitle = () => {
    const path = location.pathname.substring(1);
    if (!path) return 'Energywise';
    
    return path
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleDarkModeToggle = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <>
      <header className="main-header">
        <div className="header-left">
          <Link to="/appliances">
            <img 
              src="/logopure.png" 
              alt="Energywise Logo" 
              className="logo"
            />
          </Link>
        </div>
        
        <div className="header-center">
          <h1>{getPageTitle()}</h1>
        </div>
        
        <div className="header-right">
          <button 
            className={`settings-button ${isPanelOpen ? 'active' : ''}`}
            onClick={() => setIsPanelOpen(!isPanelOpen)}
            aria-label="Settings"
            aria-expanded={isPanelOpen}
            aria-controls="settings-menu"
          >
            ⚙️
          </button>
        </div>
      </header>

      <div 
        className={`settings-panel-wrapper ${isPanelOpen ? 'open' : ''}`}
        aria-hidden={!isPanelOpen}
      >
        <div className="settings-panel">
          <div className="panel-header">
            
          </div>
          

          <nav className="settings-menu" id="settings-menu">
            <div className="menu-section">
              <div className="menu-section-header">
                <span>Personal Settings</span>
              </div>
              <div className="submenu">
                <Link 
                  to="/account" 
                  className="menu-item"
                  tabIndex={isPanelOpen ? 0 : -1}
                >
                  <span className="menu-icon">👨🏻‍💻</span>
                  Account
                </Link>
                <Link 
                  to="/preferences" 
                  className="menu-item"
                  tabIndex={isPanelOpen ? 0 : -1}
                >
                  <span className="menu-icon">⚙️</span>
                  Preferences
                </Link>
              </div>
            </div>

            <div className="menu-section">
              <div className="menu-section-header">
                <span>Display</span>
              </div>
              <div className="submenu">
                <button 
                  className="menu-item"
                  onClick={handleDarkModeToggle}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleDarkModeToggle();
                    }
                  }}
                  role="switch"
                  aria-checked={isDarkMode}
                  tabIndex={isPanelOpen ? 0 : -1}
                >
                  <span className="menu-icon">🌙</span>
                  Dark Mode
                  <label className="toggle-switch" onClick={e => e.stopPropagation()}>
                    <input 
                      type="checkbox"
                      checked={isDarkMode}
                      onChange={handleDarkModeToggle}
                      tabIndex={-1}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </button>
              </div>
            </div>

            <div className="menu-section">
              <div className="menu-section-header">
                <span>Help</span>
              </div>
              <div className="submenu">
                <Link 
                  to="/support" 
                  className="menu-item"
                  tabIndex={isPanelOpen ? 0 : -1}
                >
                  <span className="menu-icon">❓</span>
                  Support
                </Link>
              </div>
            </div>

            <div className="menu-section">
              <div className="menu-section-header">
                <span>Logout</span>
              </div>
              <div className="submenu">
                <button 
                  onClick={handleSignOut} 
                  className="menu-item logout-button"
                  tabIndex={isPanelOpen ? 0 : -1}
                >
                  <span className="menu-icon">🚪</span>
                  Logout
                </button>
              </div>
            </div>
          </nav>
        </div>
      </div>
    </>
  );
} 