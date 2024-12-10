import PropTypes from 'prop-types';
import './shared.css';
import './Preferences.css';

export default function Preferences({ data, updateData }) {
  const handleChange = (field, value) => {
    updateData({
      ...data,
      [field]: value
    });
  };

  const handleNotificationChange = (type) => {
    updateData({
      ...data,
      notifications: {
        ...data.notifications,
        [type]: !data.notifications[type]
      }
    });
  };

  return (
    <div className="onboarding-page preferences-page">
      <h2>Your Preferences</h2>
      <p className="subtitle">Customize your experience</p>

      <div className="preferences-grid">
        <div className="preference-card">
          <h3>Temperature Unit</h3>
          <div className="toggle-group">
            <button 
              className={`toggle-button ${data.temperatureUnit === 'celsius' ? 'active' : ''}`}
              onClick={() => handleChange('temperatureUnit', 'celsius')}
            >
              Celsius
            </button>
            <button 
              className={`toggle-button ${data.temperatureUnit === 'fahrenheit' ? 'active' : ''}`}
              onClick={() => handleChange('temperatureUnit', 'fahrenheit')}
            >
              Fahrenheit
            </button>
          </div>
        </div>

        <div className="preference-card">
          <h3>Notifications</h3>
          <div className="checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={data.notifications.email}
                onChange={() => handleNotificationChange('email')}
              />
              <span>Email notifications</span>
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={data.notifications.usageAlerts}
                onChange={() => handleNotificationChange('usageAlerts')}
              />
              <span>Usage alerts</span>
            </label>
          </div>
        </div>

        <div className="preference-card">
          <h3>Report Frequency</h3>
          <select
            value={data.reportFrequency}
            onChange={(e) => handleChange('reportFrequency', e.target.value)}
            className="frequency-select"
          >
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
          </select>
        </div>
      </div>
    </div>
  );
}

Preferences.propTypes = {
  data: PropTypes.shape({
    temperatureUnit: PropTypes.string.isRequired,
    notifications: PropTypes.shape({
      email: PropTypes.bool.isRequired,
      usageAlerts: PropTypes.bool.isRequired
    }).isRequired,
    reportFrequency: PropTypes.string.isRequired
  }).isRequired,
  updateData: PropTypes.func.isRequired
};

Preferences.defaultProps = {
  data: {
    temperatureUnit: 'celsius',
    notifications: {
      email: false,
      usageAlerts: false
    },
    reportFrequency: 'monthly'
  }
};
