import PropTypes from 'prop-types';
import './Reduction.css';
import { Link } from 'react-router-dom';

export default function Reduction({ appliances, energyCost }) {
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
      refrigerator: [
        "Keep the temperature between 37-40°F (3-4°C)",
        "Clean coils regularly to maintain efficiency",
        "Check door seals for proper closure",
        "Avoid placing hot food directly in the fridge"
      ],
      washingMachine: [
        "Use cold water when possible",
        "Run full loads only",
        "Use high-spin speeds to reduce drying time",
        "Clean the lint filter regularly"
      ],
      dishwasher: [
        "Run only when full",
        "Use eco mode when available",
        "Skip the heat-dry cycle",
        "Clean filters monthly"
      ],
      airConditioner: [
        "Set temperature to 78°F (26°C) when home",
        "Use programmable features",
        "Clean filters monthly",
        "Use ceiling fans to improve circulation"
      ],
      waterHeater: [
        "Set temperature to 120°F (49°C)",
        "Insulate the tank and pipes",
        "Flush annually to remove sediment",
        "Consider a timer for operation hours"
      ],
      dryer: [
        "Clean lint filter before each use",
        "Use moisture sensor if available",
        "Dry similar fabrics together",
        "Consider air-drying when possible"
      ],
      oven: [
        "Use right-sized cookware",
        "Avoid opening door while cooking",
        "Use convection mode when possible",
        "Batch cook when feasible"
      ],
      microwave: [
        "Use for small portions instead of oven",
        "Keep interior clean for efficiency",
        "Use appropriate power levels",
        "Cover food to reduce cooking time"
      ],
      computer: [
        "Use sleep mode when inactive",
        "Enable power management features",
        "Unplug chargers when not in use",
        "Consider using a laptop instead of desktop"
      ],
      television: [
        "Adjust brightness to room conditions",
        "Enable auto-sleep features",
        "Use energy-saving mode",
        "Unplug when not in use for extended periods"
      ],
      lighting: [
        "Switch to LED bulbs",
        "Use natural light when possible",
        "Install motion sensors or timers",
        "Clean bulbs and fixtures regularly"
      ],
      dehumidifier: [
        "Clean filters regularly",
        "Place away from walls for better airflow",
        "Empty and clean water container regularly",
        "Use auto-humidity settings"
      ],
      electricHeater: [
        "Use programmable thermostat",
        "Keep doors and windows sealed",
        "Regular maintenance of heating elements",
        "Consider zone heating"
      ]
    };

    // Return default tips if no specific tips exist for the appliance type
    return tips[appliance.type] || [
      "Consider upgrading to an energy-efficient model",
      "Regular maintenance improves efficiency",
      "Use timers or smart plugs to avoid standby power",
      "Monitor usage patterns to optimize operation times"
    ];
  };

  const highConsumers = calculateHighConsumptionAppliances();
  const hasAppliances = appliances.length > 0;

  return (
    <div className="reduction-container">

<section className="general-tips-section">
        <h2>General Savings Opportunities</h2>
        <div className="tips-grid">
          <div className="tip-card">
            <div className="flexer">
            <h3>Cost Reduction</h3>
            <span className="tip-icon">💰</span></div>
            <ul>
              <li>Use appliances during off-peak hours</li>
              <li>Regular maintenance of all appliances</li>
              <li>Consider upgrading to energy-efficient models</li>
            </ul>
          </div>
          
          <div className="tip-card">
            <div className="flexer">
            <h3>Eco-Friendly Practices</h3>
            <span className="tip-icon">🌱</span></div>
            <ul>
              <li>Use natural ventilation when possible</li>
              <li>Maximize daylight usage</li>
              <li>Consider solar panel installation</li>
            </ul>
          </div>

          <div className="tip-card">
            <div className="flexer">
            <h3>Usage Tracking Tips</h3>
            <span className="tip-icon">📊</span></div>
            <ul>
              <li>Set up weekly energy usage reviews</li>
              <li>Compare usage patterns month-over-month</li>
              <li>Identify peak usage hours</li>
              <li>Monitor standby power consumption</li>
            </ul>
          </div>

          <div className="tip-card">
            <div className="flexer">
            <h3>Appliance Optimization </h3>
            <span className="tip-icon">⚡</span></div>
            <ul>
              <li>Schedule appliance usage during off-peak hours</li>
              <li>Group similar tasks to reduce startup cycles</li>
              <li>Regular maintenance schedule for efficiency</li>
              <li>Consider smart plugs for automation</li>
            </ul>
          </div>
        </div>
      </section>
      
      <section className="high-consumption-section">
        <h2>Top Energy Consumers</h2>
        {hasAppliances ? (
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
        ) : (
          <div className="empty-state">
            <div className="empty-state-content">
              <span className="empty-icon">📊</span>
              <h3>No Consumption Data Available</h3>
              <p>Add your appliances to see your top energy consumers and get personalized reduction tips.</p>
              <Link to="/appliances">
                <button className="add-button">
                  <span className="add-icon">+</span>
                  Add Your First Appliance
                </button>
              </Link>
            </div>
          </div>
        )}
      </section>

      

      <section className="usage-tracking-section">
        <h2>Usage Patterns</h2>
        {hasAppliances ? (
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
        ) : (
          <div className="empty-state">
            <div className="empty-state-content">
              <span className="empty-icon">📈</span>
              <h3>No Usage Patterns Yet</h3>
              <p>Start tracking your appliances to see your usage patterns and identify optimization opportunities.</p>
              <Link to="/appliances">
                <button className="add-button">
                  <span className="add-icon">+</span>
                  Add Your First Appliance
                </button>
              </Link>
            </div>
          </div>
        )}
      </section>

      <section className="optimization-section">
        <h2>Optimization Opportunities</h2>
        {hasAppliances ? (
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
        ) : (
          <div className="empty-state">
            <div className="empty-state-content">
              <span className="empty-icon">💡</span>
              <h3>No Optimization Insights Available</h3>
              <p>Add your appliances to receive personalized optimization recommendations and potential savings calculations.</p>
              <Link to="/appliances">
                <button className="add-button">
                  <span className="add-icon">+</span>
                  Add Your First Appliance
                </button>
              </Link>
            </div>
          </div>
        )}
      </section>
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
  energyCost: PropTypes.number.isRequired
}; 