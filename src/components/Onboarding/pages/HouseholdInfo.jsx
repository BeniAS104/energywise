import PropTypes from 'prop-types';

export default function HouseholdInfo({ data, updateData }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    updateData({
      ...data,
      [name]: value
    });
  };

  return (
    <div className="onboarding-page">
      <h2>Household Information</h2>
      <p>Help us understand your household better:</p>
      <form className="onboarding-form">
        <div className="form-group">
          <label htmlFor="residents">Number of residents:</label>
          <input
            type="number"
            id="residents"
            name="residents"
            min="1"
            value={data.residents}
            onChange={handleChange}
            placeholder="e.g., 4"
          />
        </div>
        <div className="form-group">
          <label htmlFor="homeType">Home type:</label>
          <select
            id="homeType"
            name="homeType"
            value={data.homeType}
            onChange={handleChange}
          >
            <option value="">Select home type</option>
            <option value="apartment">Apartment</option>
            <option value="house">House</option>
            <option value="condo">Condo</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="squareFootage">Square footage:</label>
          <input
            type="number"
            id="squareFootage"
            name="squareFootage"
            value={data.squareFootage}
            onChange={handleChange}
            placeholder="e.g., 1500"
          />
        </div>
      </form>
    </div>
  );
}

HouseholdInfo.propTypes = {
  data: PropTypes.shape({
    residents: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    homeType: PropTypes.string,
    squareFootage: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  }).isRequired,
  updateData: PropTypes.func.isRequired
};
