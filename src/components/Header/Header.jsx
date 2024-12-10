import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { auth } from '../../firebase';
import './Header.css';

export default function Header() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const location = useLocation();

  const getPageTitle = () => {
    const path = location.pathname.substring(1); // Remove leading slash
    return path.charAt(0).toUpperCase() + path.slice(1) || 'Analytics';
  };

  return (
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
          className="settings-button"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          ⚙️
          {isDropdownOpen && (
            <div className="settings-dropdown">
              <button onClick={() => auth.signOut()}>
                Logout
              </button>
            </div>
          )}
        </button>
      </div>
    </header>
  );
} 