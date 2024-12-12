import { useState } from 'react';
import PropTypes from 'prop-types';
import { auth, database } from '../../firebase';
import { ref, remove } from 'firebase/database';
import { deleteUser } from 'firebase/auth';
import './Account.css';

export default function Account({ 
  userData = {
    location: {
      country: '',
      countryName: '',
      currency: 'USD'
    }
  }, 
  onUpdateUserData 
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [editedData, setEditedData] = useState({
    location: {
      country: userData.location.country || '',
      countryName: userData.location.countryName || '',
      currency: userData.location.currency || 'USD'
    }
  });
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'country') {
      setEditedData(prev => ({
        location: {
          ...prev.location,
          country: value,
          countryName: value
        }
      }));
    }
  };

  const handleSave = async () => {
    try {
      const updateData = {
        location: {
          country: editedData.location.country,
          countryName: editedData.location.countryName,
          currency: editedData.location.currency
        }
      };
      await onUpdateUserData(updateData);
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
                <span className="label">Location:</span>
                <input
                  type="text"
                  name="country"
                  value={editedData.location.country}
                  onChange={handleInputChange}
                  className="text-input"
                  placeholder="Enter your location"
                />
              </div>
            </>
          ) : (
            <>
              <div className="info-row">
                <span className="label">Location:</span>
                <span className="value">{userData.location.countryName || 'Not set'}</span>
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
      currency: PropTypes.string
    })
  }),
  onUpdateUserData: PropTypes.func.isRequired
}; 