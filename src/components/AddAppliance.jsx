import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

export default function AddAppliance({ addAppliance }) {
  const [appliance, setAppliance] = useState({
    name: '',
    type: '',
    room: '',
    watts: '',
    hoursPerDay: '',
    daysPerWeek: '7'
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAppliance(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formattedAppliance = {
      ...appliance,
      watts: Number(appliance.watts),
      hoursPerDay: Number(appliance.hoursPerDay),
      daysPerWeek: Number(appliance.daysPerWeek)
    };
    addAppliance(formattedAppliance);
    navigate('/appliances');
  };

  return (
    <div className="page-content">
      <h2>Add Appliance</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={appliance.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="type">Type:</label>
          <select
            id="type"
            name="type"
            value={appliance.type}
            onChange={handleChange}
            required
          >
            <option value="">Select type</option>
            <option value="lighting">Lighting</option>
            <option value="computer">Computer</option>
            <option value="cooking">Cooking</option>
            <option value="cooling">Cooling</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="room">Room:</label>
          <input
            type="text"
            id="room"
            name="room"
            value={appliance.room}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="watts">Power (Watts):</label>
          <input
            type="number"
            id="watts"
            name="watts"
            value={appliance.watts}
            onChange={handleChange}
            min="0"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="hoursPerDay">Hours used per day:</label>
          <input
            type="number"
            id="hoursPerDay"
            name="hoursPerDay"
            value={appliance.hoursPerDay}
            onChange={handleChange}
            min="0"
            max="24"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="daysPerWeek">Days used per week:</label>
          <input
            type="number"
            id="daysPerWeek"
            name="daysPerWeek"
            value={appliance.daysPerWeek}
            onChange={handleChange}
            min="1"
            max="7"
            required
          />
        </div>

        <button type="submit" className="submit-button">Add Appliance</button>
      </form>
    </div>
  );
}

AddAppliance.propTypes = {
  addAppliance: PropTypes.func.isRequired
}; 