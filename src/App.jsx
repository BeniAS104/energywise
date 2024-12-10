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
import Header from './components/Header/Header';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [appliances, setAppliances] = useState([]);
  const [userEnergyCost, setUserEnergyCost] = useState(null);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [userGoals, setUserGoals] = useState([]);

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
        const onboardingRef = ref(database, `users/${user.uid}/onboarding`);
        const snapshot = await get(onboardingRef);
        if (snapshot.exists()) {
          setHasCompletedOnboarding(snapshot.val().completed);
        }
      }
    };

    checkOnboardingStatus();
  }, [user]);

  const completeOnboarding = async (onboardingData) => {
    if (user) {
      try {
        const userRef = ref(database, `users/${user.uid}`);
        await set(userRef, {
          ...onboardingData,
          hasCompletedOnboarding: true
        });
        setUserEnergyCost(onboardingData.location.energyCost);
        setUserGoals(onboardingData.goals);
        setHasCompletedOnboarding(true);
      } catch (error) {
        console.error('Error saving onboarding data:', error);
      }
    }
  };

  useEffect(() => {
    const loadUserData = async () => {
      if (user) {
        try {
          const userRef = ref(database, `users/${user.uid}`);
          const snapshot = await get(userRef);
          if (snapshot.exists()) {
            const data = snapshot.val();
            setHasCompletedOnboarding(data.hasCompletedOnboarding || false);
            setUserEnergyCost(data.energyCost);
            setUserGoals(data.goals || []);
          }
        } catch (error) {
          console.error('Error loading user data:', error);
        }
      }
    };

    loadUserData();
  }, [user]);

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
            </ul>
          </nav>

          <div className="content">
            <Routes>
              <Route 
                path="/analytics" 
                element={
                  <Analytics 
                    appliances={appliances} 
                    energyCost={userEnergyCost || 0.12} 
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
                    energyCost={userEnergyCost || 0.12}
                  />
                } 
              />
              <Route 
                path="/reduction" 
                element={
                  <Reduction 
                    appliances={appliances}
                    energyGoals={userGoals}
                    energyCost={userEnergyCost || 0.12}
                  />
                } 
              />
              <Route path="/add-appliance" element={<AddAppliance addAppliance={addAppliance} />} />
              <Route path="*" element={<Navigate to="/analytics" replace />} />
            </Routes>
          </div>
        </div>
      )}
    </div>
  );
}

export default App
