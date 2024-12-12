import PropTypes from 'prop-types';
import './Reduction.css';

export default function Reduction({ appliances, energyGoals, energyCost }) {
  const calculateHighConsumptionAppliances = () => {
    return appliances
      .map(app => {
        const hoursPerMonth = app.hoursPerDay * app.daysPerWeek * 4;
        const kWh = (app.watts / 1000) * hoursPerMonth;
        return { ...app, monthlyConsumption: kWh };
      })
      .sort((a, b) => b.monthlyConsumption - a.monthlyConsumption)
      .slice(0, 3); // Top 3 consumers
  };

  const getApplianceSpecificTips = (appliance) => {
    const tips = {
      lighting: [
        'Switch to LED bulbs to save up to 80% energy',
        'Install motion sensors for automatic control',
        'Utilize natural daylight when possible'
      ],
      computer: [
        'Enable power-saving mode',
        'Unplug chargers when not in use',
        'Use a smart power strip to eliminate phantom power'
      ],
      cooking: [
        'Use lids while cooking to reduce energy loss',
        'Match pot size to burner size',
        'Use a microwave for small portions'
      ],
      cooling: [
        'Clean filters regularly',
        'Set temperature to optimal 24°C (75°F)',
        'Use ceiling fans to improve air circulation'
      ]
    };
    return tips[appliance.type] || [];
  };

  const highConsumers = calculateHighConsumptionAppliances();

  return (
    <div className="reduction-container">
      <h2>Energy Reduction Strategies</h2>
      
      <section className="high-consumption-section">
        <h3>Top Energy Consumers</h3>
        <div className="appliance-cards">
          {highConsumers.map(appliance => (
            <div key={appliance.id} className="appliance-reduction-card">
              <h4>{appliance.name}</h4>
              <p className="consumption-stats">
                {appliance.monthlyConsumption.toFixed(2)} kWh/month
                <br />
                ${(appliance.monthlyConsumption * energyCost).toFixed(2)}/month
              </p>
              <div className="tips-list">
                <h5>Reduction Tips:</h5>
                <ul>
                  {getApplianceSpecificTips(appliance).map((tip, index) => (
                    <li key={index}>{tip}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="general-tips-section">
        <h3>General Savings Opportunities</h3>
        <div className="tips-grid">
          {energyGoals.includes('reduce-bill') && (
            <div className="tip-card">
              <span className="tip-icon">💰</span>
              <h4>Cost Reduction</h4>
              <ul>
                <li>Use appliances during off-peak hours</li>
                <li>Regular maintenance of all appliances</li>
                <li>Consider upgrading to energy-efficient models</li>
              </ul>
            </div>
          )}
          
          {energyGoals.includes('eco-friendly') && (
            <div className="tip-card">
              <span className="tip-icon">🌱</span>
              <h4>Eco-Friendly Practices</h4>
              <ul>
                <li>Use natural ventilation when possible</li>
                <li>Maximize daylight usage</li>
                <li>Consider solar panel installation</li>
              </ul>
            </div>
          )}

          {energyGoals.includes('track-usage') && (
            <div className="tip-card">
              <span className="tip-icon">📊</span>
              <h4>Usage Tracking Tips</h4>
              <ul>
                <li>Set up weekly energy usage reviews</li>
                <li>Compare usage patterns month-over-month</li>
                <li>Identify peak usage hours</li>
                <li>Monitor standby power consumption</li>
              </ul>
            </div>
          )}

          {energyGoals.includes('optimize') && (
            <div className="tip-card">
              <span className="tip-icon">⚡</span>
              <h4>Appliance Optimization</h4>
              <ul>
                <li>Schedule appliance usage during off-peak hours</li>
                <li>Group similar tasks to reduce startup cycles</li>
                <li>Regular maintenance schedule for efficiency</li>
                <li>Consider smart plugs for automation</li>
              </ul>
            </div>
          )}
        </div>
      </section>

      {energyGoals.includes('track-usage') && (
        <section className="usage-tracking-section">
          <h3>Usage Patterns</h3>
          <div className="usage-stats">
            <div className="stat-card">
              <h4>Peak Usage Times</h4>
              <p>Your highest energy consumption occurs between:</p>
              <ul>
                {highConsumers.map(appliance => (
                  <li key={appliance.id}>
                    {appliance.name}: {appliance.hoursPerDay} hours/day
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="stat-card">
              <h4>Weekly Distribution</h4>
              <p>Active days per appliance:</p>
              <ul>
                {highConsumers.map(appliance => (
                  <li key={appliance.id}>
                    {appliance.name}: {appliance.daysPerWeek} days/week
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      )}

      {energyGoals.includes('optimize') && (
        <section className="optimization-section">
          <h3>Optimization Opportunities</h3>
          <div className="optimization-cards">
            {highConsumers.map(appliance => {
              const potentialSavings = appliance.monthlyConsumption * 0.2; // Assume 20% potential reduction
              return (
                <div key={appliance.id} className="optimization-card">
                  <h4>{appliance.name} Optimization</h4>
                  <p>Potential monthly savings:</p>
                  <div className="savings-estimate">
                    <span className="kwh">{potentialSavings.toFixed(2)} kWh</span>
                    <span className="cost">${(potentialSavings * energyCost).toFixed(2)}</span>
                  </div>
                  <div className="optimization-tips">
                    <h5>Recommended Schedule:</h5>
                    <p>Optimal usage: {Math.max(appliance.hoursPerDay - 2, 1)} hours/day</p>
                    <p>Suggested days: {Math.min(appliance.daysPerWeek, 5)} days/week</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}

Reduction.propTypes = {
  appliances: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    watts: PropTypes.number.isRequired,
    hoursPerDay: PropTypes.number.isRequired,
    daysPerWeek: PropTypes.number.isRequired,
    type: PropTypes.string.isRequired
  })).isRequired,
  energyGoals: PropTypes.arrayOf(PropTypes.string).isRequired,
  energyCost: PropTypes.number.isRequired
}; 