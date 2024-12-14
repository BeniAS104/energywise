import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { auth, database } from '../../firebase';
import { ref, remove } from 'firebase/database';
import { deleteUser } from 'firebase/auth';
import { energyCosts, getAllRegions, getCountriesByRegion } from '../../data/energyCosts';
import './Account.css';

export default function Account({ userData = {
  location: {
    country: '',
    countryName: '',
    currency: 'USD',
    energyCost: 0.15
  }
}, onUpdateUserData }) {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState('');
  const regions = getAllRegions();
  
  const [editedData, setEditedData] = useState({
    location: {
      country: userData.location.country || '',
      countryName: userData.location.countryName || '',
      currency: userData.location.currency || 'USD',
      energyCost: userData.location.energyCost || 0.15
    }
  });

  const getFilteredCountries = () => {
    if (!selectedRegion) {
      return Object.entries(energyCosts).map(([code, data]) => ({
        code,
        name: data.name,
        ...data
      }));
    }
    return getCountriesByRegion(selectedRegion);
  };

  const handleRegionChange = (e) => {
    setSelectedRegion(e.target.value);
  };

  const handleCountryChange = (e) => {
    const countryCode = e.target.value;
    const countryData = energyCosts[countryCode];
    
    if (countryData) {
      setEditedData(prev => ({
        location: {
          ...prev.location,
          country: countryCode,
          countryName: countryData.name,
          currency: countryData.currency,
          energyCost: countryData.cost
        }
      }));
    }
  };

  const handleSave = async () => {
    try {
      await onUpdateUserData({
        location: {
          country: editedData.location.country,
          countryName: editedData.location.countryName,
          currency: editedData.location.currency,
          energyCost: editedData.location.energyCost
        }
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving changes:', error);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const userRef = ref(database, `users/${auth.currentUser.uid}`);
      await remove(userRef);
      await deleteUser(auth.currentUser);
      navigate('/');
    } catch (error) {
      console.error('Error deleting account:', error);
    }
  };

  return (
    <div className="account-page">
      <h2>Account Settings</h2>
      
      <div className="account-section">
        <h3>Profile Information</h3>
        <div className="profile-info">
          <div className="info-row">
            <span className="label">Email:</span>
            <span className="value">{auth.currentUser?.email}</span>
          </div>
          {isEditing ? (
            <>
              <div className="info-row">
                <span className="label">Region:</span>
                <select
                  value={selectedRegion}
                  onChange={handleRegionChange}
                  className="select-input"
                >
                  <option value="">All regions</option>
                  {regions.map(region => (
                    <option key={region} value={region}>{region}</option>
                  ))}
                </select>
              </div>
              <div className="info-row">
                <span className="label">Location:</span>
                <select
                  name="country"
                  value={editedData.location.country}
                  onChange={handleCountryChange}
                  className="select-input"
                >
                  <option value="">Select a country</option>
                  {getFilteredCountries().map(country => (
                    <option key={country.code} value={country.code}>
                      {country.name} - {country.cost}$/kWh
                    </option>
                  ))}
                </select>
              </div>
            </>
          ) : (
            <>
              <div className="info-row">
                <span className="label">Location:</span>
                <span className="value">
                  {userData.location.country ? 
                    energyCosts[userData.location.country]?.name || userData.location.country : 
                    'Not set'}
                </span>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="account-section">
        <h3>Account Management</h3>
        <div className="action-buttons">
          {isEditing ? (
            <>
              <button 
                className="save-button"
                onClick={handleSave}
              >
                💾 Save Changes
              </button>
              <button 
                className="cancel-button"
                onClick={() => setIsEditing(false)}
              >
                ❌ Cancel
              </button>
            </>
          ) : (
            <>
              <button 
                className="edit-button"
                onClick={() => setIsEditing(true)}
              >
                ✏️ Edit Profile
              </button>
              <button 
                className="delete-button"
                onClick={() => setShowDeleteConfirm(true)}
              >
                🗑️ Delete Account
              </button>
            </>
          )}
        </div>
      </div>

      {showDeleteConfirm && (
        <div className="modal-overlay">
          <div className="confirmation-modal">
            <h3>Delete Account</h3>
            <p>Are you sure you want to delete your account? This action cannot be undone.</p>
            <div className="modal-buttons">
              <button 
                className="cancel-button"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </button>
              <button 
                className="confirm-delete-button"
                onClick={handleDeleteAccount}
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

Account.propTypes = {
  userData: PropTypes.shape({
    location: PropTypes.shape({
      country: PropTypes.string,
      countryName: PropTypes.string,
      currency: PropTypes.string,
      energyCost: PropTypes.number
    })
  }),
  onUpdateUserData: PropTypes.func.isRequired
}; 