import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

// Import all required components
import Welcome from './pages/Welcome';
import LocationSelection from './pages/LocationSelection';
import EnergyGoals from '../EnergyGoals/EnergyGoals';
import Preferences from './pages/Preferences';
import Complete from './pages/Complete';

export default function Onboarding({ completeOnboarding }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [onboardingData, setOnboardingData] = useState({
    location: {
      country: '',
      countryName: '',
      energyCost: 0,
      currency: 'USD',
      region: '',
      energyUnit: 'kWh'
    },
    energyGoals: [],
    preferences: {
      notifications: {
        email: false,
        usageAlerts: false
      },
      reportFrequency: 'monthly'
    }
  });

  const navigate = useNavigate();

  const updateOnboardingData = (section, data) => {
    setOnboardingData(prev => ({
      ...prev,
      [section]: data
    }));
  };

  const finishOnboarding = () => {
    const completeData = {
      ...onboardingData,
      location: {
        ...onboardingData.location,
        energyUnit: onboardingData.location.energyUnit || 'kWh'
      }
    };
    completeOnboarding(completeData);
    navigate('/analytics');
  };

  const pages = [
    { 
      component: Welcome, 
      title: "Welcome" 
    },
    { 
      component: () => (
        <LocationSelection 
          data={onboardingData.location}
          updateData={(data) => updateOnboardingData('location', data)}
        />
      ), 
      title: "Location Selection" 
    },
    { 
      component: () => (
        <EnergyGoals 
          data={onboardingData.energyGoals}
          updateData={(data) => updateOnboardingData('energyGoals', data)}
        />
      ), 
      title: "Energy Goals" 
    },
    { 
      component: () => (
        <Preferences 
          data={onboardingData.preferences}
          updateData={(data) => updateOnboardingData('preferences', data)}
        />
      ), 
      title: "Preferences" 
    },
    { 
      component: Complete, 
      title: "Complete" 
    }
  ];

  // Calculate progress percentage
  const totalSteps = pages.length;
  const progress = ((currentStep + 1) / totalSteps) * 100;

  return (
    <div className="onboarding-container">
      <div className="progress-container">
        <div 
          className="progress-bar" 
          style={{ width: `${progress}%` }}
        >
          <span className="progress-text">{Math.round(progress)}%</span>
        </div>
      </div>

      <div className="onboarding-content">
        {typeof pages[currentStep].component === 'function' 
          ? pages[currentStep].component()
          : React.createElement(pages[currentStep].component)}
      </div>

      <div className="onboarding-navigation">
        {currentStep > 0 && (
          <button 
            onClick={() => setCurrentStep(prev => prev - 1)}
            className="nav-button back"
          >
            Back
          </button>
        )}
        
        {currentStep < pages.length - 1 ? (
          <button 
            onClick={() => setCurrentStep(prev => prev + 1)}
            className="nav-button next"
          >
            Next
          </button>
        ) : (
          <button 
            onClick={finishOnboarding}
            className="nav-button finish"
          >
            Finish
          </button>
        )}
      </div>
    </div>
  );
}

Onboarding.propTypes = {
  completeOnboarding: PropTypes.func.isRequired
};