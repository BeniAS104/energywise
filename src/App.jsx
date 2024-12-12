import { useState, useEffect } from 'react'
import './App.css'
import { auth, database } from './firebase';
import { ref, set, get, push, remove, update } from 'firebase/database';
import { Link, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import Analytics from './components/Analytics/Analytics';
import Appliances from './components/Appliances/Appliances';
import Reduction from './components/Reduction/Reduction';
import AddAppliance from './components/AddAppliance';
import Onboarding from './components/Onboarding/Onboarding';
import Login from './components/Login/Login';
import Preferences from './components/Onboarding/pages/Preferences';
import Header from './components/Header/Header';
import EnergyGoals from './components/EnergyGoals/EnergyGoals';
import Account from './components/Account/Account';

const DEFAULT_ENERGY_COST = 0.14; // Average electricity rate in USD/kWh

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [appliances, setAppliances] = useState([]);
  const [userLocation, setUserLocation] = useState({
    countryName: '',
    country: '',
    currency: 'USD',
    region: '',
    energyUnit: 'kWh'
  });
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [userGoals, setUserGoals] = useState([]);
  const [userPreferences, setUserPreferences] = useState({
    notifications: {
      email: false,
      usageAlerts: false
    },
    reportFrequency: 'monthly'
  });

  const addAppliance = async (appliance) => {
    if (user) {
      try {
        const appliancesRef = ref(database, `users/${user.uid}/appliances`);
        const newApplianceRef = push(appliancesRef);
        await set(newApplianceRef, appliance);
        
        // Update local state
        setAppliances(prevAppliances => [...prevAppliances, { ...appliance, id: newApplianceRef.key }]);
      } catch (error) {
        console.error('Error adding appliance:', error);
      }
    }
  };

  const editAppliance = async (id, updatedData) => {
    if (user) {
      try {
        const applianceRef = ref(database, `users/${user.uid}/appliances/${id}`);
        await update(applianceRef, updatedData);
        
        // Update local state
        setAppliances(prevAppliances =>
          prevAppliances.map(app => 
            app.id === id ? { ...app, ...updatedData } : app
          )
        );
      } catch (error) {
        console.error('Error updating appliance:', error);
      }
    }
  };

  const deleteAppliance = async (id) => {
    if (user) {
      try {
        const applianceRef = ref(database, `users/${user.uid}/appliances/${id}`);
        await remove(applianceRef);
        
        // Update local state
        setAppliances(prevAppliances => 
          prevAppliances.filter(app => app.id !== id)
        );
      } catch (error) {
        console.error('Error deleting appliance:', error);
      }
    }
  };

  // useEffect hook
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      if (user) {
        const userRef = ref(database, `users/${user.uid}`);
        const snapshot = await get(userRef);
        if (snapshot.exists()) {
          setHasCompletedOnboarding(snapshot.val().hasCompletedOnboarding || false);
        }
      }
    };

    if (user) {
      checkOnboardingStatus();
    }
  }, [user]);

  const completeOnboarding = async (onboardingData) => {
    if (user) {
      try {
        const userRef = ref(database, `users/${user.uid}`);
        const userData = {
          countryName: onboardingData.location.countryName,
          country: onboardingData.location.country,
          currency: onboardingData.location.currency || 'USD',
          region: onboardingData.location.region || '',
          energyUnit: onboardingData.location.energyUnit || 'kWh',
          energyGoals: onboardingData.energyGoals || [],
          preferences: onboardingData.preferences || {
            notifications: {
              email: false,
              usageAlerts: false
            },
            reportFrequency: 'monthly'
          },
          hasCompletedOnboarding: true
        };
        
        await set(userRef, userData);
        
        setUserLocation({
          countryName: userData.countryName,
          country: userData.country,
          currency: userData.currency,
          region: userData.region,
          energyUnit: userData.energyUnit
        });
        setUserGoals(userData.energyGoals);
        setUserPreferences(userData.preferences);
        setHasCompletedOnboarding(true);
      } catch (error) {
        console.error('Error saving onboarding data:', error);
      }
    }
  };

  useEffect(() => {
    const loadUserData = async () => {
      if (user?.uid) {
        try {
          const userRef = ref(database, `users/${user.uid}`);
          const snapshot = await get(userRef);
          if (snapshot.exists()) {
            const data = snapshot.val();
            setUserLocation({
              countryName: data.countryName || '',
              country: data.country || '',
              currency: data.currency || 'USD',
              region: data.region || '',
              energyUnit: data.energyUnit || 'kWh'
            });
            setHasCompletedOnboarding(data.hasCompletedOnboarding || false);
          }
        } catch (error) {
          console.error('Error loading user data:', error);
        }
      }
    };

    loadUserData();
  }, [user?.uid]);

  useEffect(() => {
    const loadAppliances = async () => {
      if (user) {
        try {
          const appliancesRef = ref(database, `users/${user.uid}/appliances`);
          const snapshot = await get(appliancesRef);
          
          if (snapshot.exists()) {
            const appliancesData = snapshot.val();
            const appliancesArray = Object.entries(appliancesData).map(([id, data]) => ({
              ...data,
              id,
              watts: Number(data.watts),
              hoursPerDay: Number(data.hoursPerDay),
              daysPerWeek: Number(data.daysPerWeek)
            }));
            setAppliances(appliancesArray);
          } else {
            setAppliances([]);
          }
        } catch (error) {
          console.error('Error loading appliances:', error);
        }
      }
    };

    loadAppliances();
  }, [user]);

  const updateUserPreferences = async (newPreferences) => {
    try {
      // Update in Firebase
      const userRef = ref(database, `users/${user.uid}/preferences`);
      await set(userRef, newPreferences);
      setUserPreferences(newPreferences);
    } catch (error) {
      console.error('Error updating preferences:', error);
    }
  };

  useEffect(() => {
    if (user) {
      const fetchUserPreferences = async () => {
        const prefsRef = ref(database, `users/${user.uid}/preferences`);
        const snapshot = await get(prefsRef);
        if (snapshot.exists()) {
          setUserPreferences(snapshot.val());
        }
      };
      fetchUserPreferences();
    }
  }, [user]);

  const updateUserGoals = async (newGoals) => {
    try {
      const userRef = ref(database, `users/${user.uid}/goals`);
      await set(userRef, newGoals);
      setUserGoals(newGoals);
    } catch (error) {
      console.error('Error updating goals:', error);
    }
  };

  const updateUserData = async (updates) => {
    if (user) {
      try {
        const userRef = ref(database, `users/${user.uid}`);
        await update(userRef, updates);
        
        if (updates.location) {
          setUserLocation(prev => ({
            ...prev,
            ...updates.location
          }));
        }
      } catch (error) {
        console.error('Error updating user data:', error);
      }
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="app">
      {!user ? (
        <Login />
      ) : !hasCompletedOnboarding ? (
        <Onboarding completeOnboarding={completeOnboarding} />
      ) : (
        <div className="dashboard">
          <Header />
          <nav className="menu-nav">
            <ul>
              <li><Link to="/analytics">Analytics</Link></li>
              <li><Link to="/appliances">Appliances</Link></li>
              <li><Link to="/reduction">Reduction</Link></li>
              <li><Link to="/preferences">Preferences</Link></li>
              <li><Link to="/goals">Goals</Link></li>
              <li><Link to="/account">Account</Link></li>
            </ul>
          </nav>

          <div className="content">
            <Routes>
              <Route 
                path="/analytics" 
                element={
                  <Analytics 
                    appliances={appliances} 
                    energyCost={DEFAULT_ENERGY_COST}
                  />
                } 
              />
              <Route 
                path="/appliances" 
                element={
                  <Appliances 
                    appliances={appliances}
                    onDelete={deleteAppliance}
                    onEdit={editAppliance}
                    energyCost={DEFAULT_ENERGY_COST}
                  />
                } 
              />
              <Route 
                path="/reduction" 
                element={
                  <Reduction 
                    appliances={appliances}
                    energyGoals={userGoals}
                    energyCost={DEFAULT_ENERGY_COST}
                  />
                } 
              />
              <Route path="/add-appliance" element={<AddAppliance addAppliance={addAppliance} />} />
              <Route 
                path="/preferences" 
                element={
                  <Preferences 
                    data={userPreferences}
                    updateData={updateUserPreferences}
                  />
                } 
              />
              <Route 
                path="/goals" 
                element={
                  <EnergyGoals 
                    data={userGoals}
                    updateData={updateUserGoals}
                  />
                } 
              />
              <Route 
                path="/account" 
                element={
                  <Account 
                    userData={{
                      location: userLocation,
                      preferences: userPreferences
                    }}
                    onUpdateUserData={updateUserData}
                  />
                } 
              />
              <Route path="*" element={<Navigate to="/analytics" replace />} />
            </Routes>
          </div>
        </div>
      )}
    </div>
  );
}

export default App
