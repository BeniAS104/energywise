import PropTypes from 'prop-types';
import './EnergyGoals.css';

export default function EnergyGoals({ data, updateData }) {
  const goals = [
    {
      id: 'reduce-bill',
      label: 'Reduce energy bill',
      icon: '💰'
    },
    {
      id: 'eco-friendly',
      label: 'Be more eco-friendly',
      icon: '🌱'
    },
    {
      id: 'track-usage',
      label: 'Track energy usage better',
      icon: '📊'
    },
    {
      id: 'optimize',
      label: 'Optimize appliance usage',
      icon: '⚡'
    }
  ];

  const handleGoalToggle = (goalId) => {
    const updatedGoals = data.includes(goalId)
      ? data.filter(g => g !== goalId)
      : [...data, goalId];
    updateData(updatedGoals);
  };

  return (
    <div className="page-content">
      <h2>Energy Goals</h2>
      <p className="subtitle">What would you like to achieve?</p>
      <p className="helper-text">Select all that apply</p>
      
      <div className="goals-grid">
        {goals.map(goal => (
          <div
            key={goal.id}
            className={`goal-card ${data.includes(goal.id) ? 'selected' : ''}`}
            onClick={() => handleGoalToggle(goal.id)}
          >
            <span className="goal-icon">{goal.icon}</span>
            <span className="goal-label">{goal.label}</span>
            <div className="checkbox">
              <div className="checkbox-inner"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

EnergyGoals.propTypes = {
  data: PropTypes.arrayOf(PropTypes.string).isRequired,
  updateData: PropTypes.func.isRequired
};
