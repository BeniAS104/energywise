import './shared.css';
import './Welcome.css';

export default function Welcome() {
  return (
    <div className="onboarding-page welcome-page">
      <h2>Welcome to EnergyWise! 👋</h2>
      <p className="subtitle">Let&apos;s get started on your energy-saving journey</p>
      
      <div className="welcome-cards">
        <div className="welcome-card">
          <span className="card-icon">📊</span>
          <h3>Track Usage</h3>
          <p>Monitor your energy consumption in real-time</p>
        </div>
        
        <div className="welcome-card">
          <span className="card-icon">💰</span>
          <h3>Save Money</h3>
          <p>Reduce your energy bills with smart recommendations</p>
        </div>
        
        <div className="welcome-card">
          <span className="card-icon">🌍</span>
          <h3>Go Green</h3>
          <p>Help the environment by optimizing your energy use</p>
        </div>
      </div>

      <div className="setup-time">
        <span className="clock-icon">⏱️</span>
        <p>Setup takes only about 2 minutes</p>
      </div>
    </div>
  );
}

