import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { getEnergyCostForCountry, getAllRegions } from '../../../data/energyCosts';

export default function LocationSelection({ data, updateData }) {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRegion, setSelectedRegion] = useState('');
  const regions = getAllRegions();

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch('https://restcountries.com/v3.1/all');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const responseData = await response.json();
        const sortedCountries = responseData
          .map(country => ({
            name: country.name.common,
            code: country.cca2
          }))
          .sort((a, b) => a.name.localeCompare(b.name));
        setCountries(sortedCountries);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching countries:', error);
        setError('Unable to load countries. Please try refreshing the page.');
        setLoading(false);
      }
    };

    fetchCountries();
  }, []);

  const handleCountryChange = (e) => {
    const countryCode = e.target.value;
    const selectedCountry = countries.find(country => country.code === countryCode);
    const energyCostData = getEnergyCostForCountry(countryCode);
    
    updateData({
      ...data,
      country: countryCode,
      countryName: selectedCountry?.name || '',
      energyCost: energyCostData.cost,
      currency: energyCostData.currency,
      region: energyCostData.region
    });
  };

  // Filter countries based on selected region
  const filteredCountries = selectedRegion
    ? countries.filter(country => {
        const energyCostData = getEnergyCostForCountry(country.code);
        return energyCostData.region === selectedRegion;
      })
    : countries;

  if (loading) return <div className="loading-message">Loading countries...</div>;
  if (error) return (
    <div className="error-container">
      <div className="error-message">{error}</div>
      <button 
        onClick={() => window.location.reload()}
        className="retry-button"
      >
        Retry
      </button>
    </div>
  );

  return (
    <div className="onboarding-page">
      <h2>Your Location</h2>
      <p>Help us provide accurate energy costs for your region:</p>
      
      <div className="form-group">
        <label htmlFor="region">Filter by region:</label>
        <select
          id="region"
          value={selectedRegion}
          onChange={(e) => setSelectedRegion(e.target.value)}
        >
          <option value="">All regions</option>
          {regions.map(region => (
            <option key={region} value={region}>{region}</option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="country">Select your country:</label>
        <select
          id="country"
          value={data.country || ''}
          onChange={handleCountryChange}
        >
          <option value="">Select a country</option>
          {filteredCountries.map(country => (
            <option key={country.code} value={country.code}>
              {country.name}
            </option>
          ))}
        </select>
      </div>

      {data.energyCost && (
        <div className="energy-cost-info">
          <p>Average energy cost in {data.countryName}:</p>
          <h3>${data.energyCost.toFixed(2)} per kWh</h3>
          <small>* This is an average estimate and may vary by provider</small>
        </div>
      )}
    </div>
  );
}

LocationSelection.propTypes = {
  data: PropTypes.shape({
    country: PropTypes.string,
    countryName: PropTypes.string,
    energyCost: PropTypes.number,
    currency: PropTypes.string,
    region: PropTypes.string,
    map: PropTypes.func
  }).isRequired,
  updateData: PropTypes.func.isRequired
};