import { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { auth } from '../../firebase';
import './Header.css';

export default function Header() {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const location = useLocation();

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

  const getPageTitle = () => {
    const path = location.pathname.substring(1);
    return path.charAt(0).toUpperCase() + path.slice(1) || 'Analytics';
  };

  const menuItems = [
    {
      label: 'Personal Settings',
      icon: '👤',
      subItems: [
        { label: 'Goals', path: '/goals', icon: '🎯' },
        { label: 'Preferences', path: '/preferences', icon: '⚙️' }
      ]
    },
    { label: 'Theme', path: '/theme', icon: '🎨' },
    { label: 'Notifications', path: '/notifications', icon: '🔔' },
    { label: 'Support', path: '/support', icon: '❓' }
  ];

  return (
    <>
      <header className="main-header">
        <div className="header-left">
          <img 
            src="/logopure.png" 
            alt="EnergyWise Logo" 
            className="logo"
          />
        </div>
        
        <div className="header-center">
          <h1>{getPageTitle()}</h1>
        </div>
        
        <div className="header-right">
          <button 
            className={`settings-button ${isPanelOpen ? 'active' : ''}`}
            onClick={() => setIsPanelOpen(!isPanelOpen)}
            aria-label="Settings"
          >
            ⚙️
          </button>
        </div>
      </header>

      <div className={`settings-panel-wrapper ${isPanelOpen ? 'open' : ''}`}>
        <div className="settings-panel">
          <div className="panel-header">
            <h2>Settings</h2>
            <button 
              className="close-button"
              onClick={() => setIsPanelOpen(false)}
              aria-label="Close settings"
            >
              ×
            </button>
          </div>

          <nav className="settings-menu">
            {menuItems.map((item, index) => (
              <div key={index} className="menu-section">
                {item.subItems ? (
                  <>
                    <div className="menu-section-header">
                      <span className="menu-icon">{item.icon}</span>
                      {item.label}
                    </div>
                    <div className="submenu">
                      {item.subItems.map((subItem, subIndex) => (
                        <Link 
                          key={subIndex}
                          to={subItem.path}
                          className="menu-item submenu-item"
                        >
                          <span className="menu-icon">{subItem.icon}</span>
                          {subItem.label}
                        </Link>
                      ))}
                    </div>
                  </>
                ) : (
                  <Link 
                    to={item.path}
                    className="menu-item"
                  >
                    <span className="menu-icon">{item.icon}</span>
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
            
            <button 
              className="menu-item logout-button"
              onClick={() => auth.signOut()}
            >
              <span className="menu-icon">🚪</span>
              Logout
            </button>
          </nav>
        </div>
      </div>
    </>
  );
} 