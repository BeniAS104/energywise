import { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { getEnergyCostForCountry, getAllRegions } from '../../../data/energyCosts';
import './LocationSelection.css';

export default function LocationSelection({ data, updateData }) {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [selectedRegion, setSelectedRegion] = useState('');
  const regions = getAllRegions();

  const fetchCountries = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('https://restcountries.com/v3.1/all', {
        headers: {
          'Accept': 'application/json'
        },
        cache: 'default'
      });

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
      setRetryCount(0);
    } catch (error) {
      console.error('Error fetching countries:', error);
      if (retryCount < 3) {
        const delay = Math.pow(2, retryCount) * 1000;
        setRetryCount(prev => prev + 1);
        setTimeout(fetchCountries, delay);
      } else {
        setError('Unable to load countries. Please refresh the page or try again later.');
        setLoading(false);
      }
    }
  }, [retryCount]);

  useEffect(() => {
    fetchCountries();
  }, [fetchCountries]);

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

  if (loading) return (
    <div className="loading-message">
      <div className="loading-spinner"></div>
      Loading countries... {retryCount > 0 ? `(Attempt ${retryCount + 1}/4)` : ''}
    </div>
  );
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="location-selection-page">
      <h2 className="location-text">Your Location</h2>
      <p className="subtitle">We need to know where you are to provide accurate energy costs for your region</p>
      
      <div className="selection-container">
        <div className="form-group">
          <label htmlFor="region">Filter by region</label>
          <select
            id="region"
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="select-input"
          >
            <option value="">All regions</option>
            {regions.map(region => (
              <option key={region} value={region}>{region}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="country">Select your country</label>
          <select
            id="country"
            value={data.country || ''}
            onChange={handleCountryChange}
            className="select-input"
          >
            <option value="">Select a country</option>
            {filteredCountries.map(country => (
              <option key={country.code} value={country.code}>
                {country.name}
              </option>
            ))}
          </select>
        </div>

        {data.country && data.energyCost > 0 && (
          <div className="energy-cost-card">
            <div className="cost-header">
              <span className="location-icon">📍</span>
              <h3>{data.countryName}</h3>
            </div>
            <div className="cost-details">
              <p>Average energy cost:</p>
              <div className="cost-value">
                ${data.energyCost.toFixed(2)}
                <span className="cost-unit">per kWh</span>
              </div>
            </div>
            <p className="cost-disclaimer">* This is an average estimate and may vary by provider</p>
          </div>
        )}
      </div>
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