import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';


export default function AddAppliance({ addAppliance }) {
  const [appliance, setAppliance] = useState({
    name: '',
    type: '',
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
            className="input-fix"
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
            <option value="refrigerator">Refrigerator</option>
            <option value="washingMachine">Washing Machine</option>
            <option value="dishwasher">Dishwasher</option>
            <option value="airConditioner">Air Conditioner</option>
            <option value="waterHeater">Water Heater</option>
            <option value="dryer">Dryer</option>
            <option value="oven">Oven</option>
            <option value="microwave">Microwave</option>
            <option value="computer">Computer</option>
            <option value="television">Television</option>
            <option value="lighting">Lighting</option>
            <option value="dehumidifier">Dehumidifier</option>
            <option value="electricHeater">Electric Heater</option>
          </select>
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
            className="input-fix"
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
            className="input-fix"
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
            className="input-fix"
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