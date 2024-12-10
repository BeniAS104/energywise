import { useState } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Modal from '../Modal/Modal';
import './Appliances.css';

export default function Appliances({ appliances, onDelete, onEdit, energyCost }) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedAppliance, setSelectedAppliance] = useState(null);
  const [editForm, setEditForm] = useState({
    name: '',
    watts: '',
    hoursPerDay: '',
    daysPerWeek: ''
  });

  const handleEditClick = (appliance) => {
    setSelectedAppliance(appliance);
    setEditForm({
      name: appliance.name,
      watts: appliance.watts,
      hoursPerDay: appliance.hoursPerDay,
      daysPerWeek: appliance.daysPerWeek
    });
    setShowEditModal(true);
  };

  const handleDeleteClick = (appliance) => {
    setSelectedAppliance(appliance);
    setShowDeleteModal(true);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    onEdit(selectedAppliance.id, editForm);
    setShowEditModal(false);
  };

  const handleDeleteConfirm = () => {
    onDelete(selectedAppliance.id);
    setShowDeleteModal(false);
  };

  const calculateMonthlyCost = (appliance) => {
    const hoursPerMonth = appliance.hoursPerDay * appliance.daysPerWeek * 4;
    const kWh = (appliance.watts / 1000) * hoursPerMonth;
    const cost = kWh * energyCost;
    return cost.toFixed(2);
  };

  return (
    <div className="appliances-container">
      <div className="appliances-header">
        <h2>Your Appliances</h2>
        <Link to="/add-appliance">
          <button className="add-button">
            <span className="add-icon">+</span>
            Add New Appliance
          </button>
        </Link>
      </div>
      
      <div className="appliances-grid">
        {appliances.map(appliance => (
          <div key={appliance.id} className="appliance-card">
            <div className="appliance-header">
              <h3>{appliance.name}</h3>
              <div className="appliance-actions">
                <button 
                  onClick={() => handleEditClick(appliance)}
                  className="action-button edit"
                >
                  ✏️
                </button>
                <button 
                  onClick={() => handleDeleteClick(appliance)}
                  className="action-button delete"
                >
                  🗑️
                </button>
              </div>
            </div>
            
            <div className="appliance-details">
              <p>Power: {appliance.watts}W</p>
              <p>Usage: {appliance.hoursPerDay}h/day, {appliance.daysPerWeek}days/week</p>
              <p className="cost-estimate">
                Estimated monthly cost: ${calculateMonthlyCost(appliance)}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      <Modal 
        isOpen={showDeleteModal} 
        onClose={() => setShowDeleteModal(false)}
        title="Confirm Deletion"
      >
        <div className="delete-modal-content">
          <p>Are you sure you want to delete {selectedAppliance?.name}?</p>
          <p className="warning-text">This action cannot be undone.</p>
          <div className="modal-actions">
            <button 
              onClick={() => setShowDeleteModal(false)}
              className="cancel-button"
            >
              Cancel
            </button>
            <button 
              onClick={handleDeleteConfirm}
              className="delete-button"
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>

      {/* Edit Modal */}
      <Modal 
        isOpen={showEditModal} 
        onClose={() => setShowEditModal(false)}
        title="Edit Appliance"
      >
        <form onSubmit={handleEditSubmit} className="edit-form">
          <div className="form-group">
            <label htmlFor="name">Appliance Name</label>
            <input
              type="text"
              id="name"
              value={editForm.name}
              onChange={(e) => setEditForm({...editForm, name: e.target.value})}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="watts">Power (Watts)</label>
            <input
              type="number"
              id="watts"
              value={editForm.watts}
              onChange={(e) => setEditForm({...editForm, watts: e.target.value})}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="hoursPerDay">Hours per Day</label>
            <input
              type="number"
              id="hoursPerDay"
              value={editForm.hoursPerDay}
              onChange={(e) => setEditForm({...editForm, hoursPerDay: e.target.value})}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="daysPerWeek">Days per Week</label>
            <input
              type="number"
              id="daysPerWeek"
              value={editForm.daysPerWeek}
              onChange={(e) => setEditForm({...editForm, daysPerWeek: e.target.value})}
              required
            />
          </div>

          <div className="modal-actions">
            <button 
              type="button" 
              onClick={() => setShowEditModal(false)}
              className="cancel-button"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="save-button"
            >
              Save Changes
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

Appliances.propTypes = {
  appliances: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    watts: PropTypes.number.isRequired,
    hoursPerDay: PropTypes.number.isRequired,
    daysPerWeek: PropTypes.number.isRequired
  })).isRequired,
  onDelete: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  energyCost: PropTypes.number.isRequired
}; 