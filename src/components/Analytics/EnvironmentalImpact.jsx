import PropTypes from 'prop-types';

export default function EnvironmentalImpact({ monthlyConsumption }) {
  // Constants for environmental impact calculations
  const CO2_PER_KWH = 0.92; // pounds of CO2 per kWh
  const TREES_PER_TON_CO2 = 45; // trees needed to absorb 1 ton of CO2 per year
  const MILES_DRIVEN_PER_KWH = 2.07; // equivalent miles driven per kWh
  
  // Calculate environmental metrics
  const monthlyCO2 = monthlyConsumption * CO2_PER_KWH;
  const yearlyCO2 = monthlyCO2 * 12;
  const treesNeeded = (yearlyCO2 / 2000) * TREES_PER_TON_CO2; // Convert lbs to tons
  const milesDriven = monthlyConsumption * MILES_DRIVEN_PER_KWH;

  return (
    <div className="environmental-impact" role="region" aria-labelledby="impact-title">
      <h3 id="impact-title">Environmental Impact Metrics</h3>
      <div className="impact-metrics">
        <div 
          className="impact-card" 
          role="article" 
          aria-labelledby="trees-title"
          tabIndex={0}
        >
          <span className="impact-icon" role="img" aria-label="Tree">🌳</span>
          <div className="impact-data">
            <h4 id="trees-title">Trees Needed</h4>
            <p className="impact-value" aria-label={`${Math.ceil(treesNeeded)} trees`}>
              {Math.ceil(treesNeeded)}
            </p>
            <p className="impact-description">
              trees needed to offset your yearly emissions
            </p>
          </div>
        </div>

        <div 
          className="impact-card" 
          role="article" 
          aria-labelledby="miles-title"
          tabIndex={0}
        >
          <span className="impact-icon" role="img" aria-label="Car">🚗</span>
          <div className="impact-data">
            <h4 id="miles-title">Equivalent Miles</h4>
            <p className="impact-value" aria-label={`${Math.ceil(milesDriven)} equivalent miles driven`}>
              {Math.ceil(milesDriven)}
            </p>
            <p className="impact-description">
              miles driven in an average car
            </p>
          </div>
        </div>

        <div 
          className="impact-card" 
          role="article" 
          aria-labelledby="co2-title"
          tabIndex={0}
        >
          <span className="impact-icon" role="img" aria-label="CO2 emissions">💨</span>
          <div className="impact-data">
            <h4 id="co2-title">CO2 Emissions</h4>
            <p className="impact-value" aria-label={`${monthlyCO2.toFixed(1)} pounds of CO2 per month`}>
              {monthlyCO2.toFixed(1)}
            </p>
            <p className="impact-description">
              pounds of CO2 per month
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

EnvironmentalImpact.propTypes = {
  monthlyConsumption: PropTypes.number.isRequired
};
