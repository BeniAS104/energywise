import './Welcome.css';
import '../Onboarding.css';

export default function Welcome() {
  return (
    <div className="onboarding-page welcome-page" role="main" aria-labelledby="welcome-title">
      <h2 id="welcome-title">Welcome to Energywise 👋</h2>
      <p className="subtitle">Let&apos;s get started on your energy-saving journey!</p>
      <p className="subtitle">Energywise is here to help you to:</p>
      
      <div className="welcome-cards" role="list" aria-label="Key features">
        <div className="welcome-card" role="listitem">
          <span className="card-icon" role="img" aria-label="Analytics icon">📊</span>
          <h3>Track Usage</h3>
          <p>Monitor your energy consumption in real-time</p>
        </div>
        
        <div className="welcome-card" role="listitem">
          <span className="card-icon" role="img" aria-label="Money saving icon">💰</span>
          <h3>Save Money</h3>
          <p>Reduce your energy bills with smart recommendations</p>
        </div>
        
        <div className="welcome-card" role="listitem">
          <span className="card-icon" role="img" aria-label="Environmental icon">🌍</span>
          <h3>Go Green</h3>
          <p>Help the environment by optimizing your energy use</p>
        </div>
      </div>

      <div className="setup-time" role="status">
        <span className="clock-icon" role="img" aria-label="Clock">⏱️</span>
        <p>Setup takes only about 2 minutes</p>
      </div>
    </div>
  );
}

