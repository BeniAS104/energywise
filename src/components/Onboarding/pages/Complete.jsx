import './Complete.css';

export default function Complete() {
  return (
    <div className="onboarding-page" role="main" aria-labelledby="complete-title">
      <h2 id="complete-title">Setup Complete! 🎉</h2>
      <p>You&apos;re all set to start monitoring and optimizing your energy usage.</p>
      
      <div className="completion-cards" role="region" aria-label="Setup completion information">
        <div className="completion-card" role="article" aria-labelledby="next-steps">
          <h3 id="next-steps">What&apos;s next?</h3>
          <ul role="list">
            <li role="listitem">Add your first appliance</li>
            <li role="listitem">Explore your dashboard</li>
            <li role="listitem">See possible savings in the Reduction section</li>
          </ul>
        </div>

        <div className="completion-card data-usage" role="article" aria-labelledby="data-usage">
          <h3 id="data-usage">How We Use Your Data</h3>
          <div className="data-point" role="listitem">
            <span className="icon" role="img" aria-label="Analytics icon">📊</span>
            <p>Your usage data helps calculate potential savings</p>
          </div>
          <div className="data-point" role="listitem">
            <span className="icon" role="img" aria-label="Location icon">🏠</span>
            <p>Location data ensures accurate energy costs</p>
          </div>
          <div className="data-point" role="listitem">
            <span className="icon" role="img" aria-label="Security icon">🔒</span>
            <p>All data is encrypted and stored securely</p>
          </div>
          <div className="data-point" role="listitem">
            <span className="icon" role="img" aria-label="Energy icon">⚡</span>
            <p>Appliance data powers personalized recommendations</p>
          </div>
        </div>
      </div>
    </div>
  );
}
