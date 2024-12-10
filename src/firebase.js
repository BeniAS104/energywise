import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyCXpKLmv5t36ZACC7xX-Q9J8QCY34-hQW0",
  authDomain: "energywise-c1003.firebaseapp.com",
  databaseURL: "https://energywise-c1003-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "energywise-c1003",
  storageBucket: "energywise-c1003.firebasestorage.app",
  messagingSenderId: "552570258198",
  appId: "1:552570258198:web:4e7906dd609a62086a0637"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
const auth = getAuth(app);
const database = getDatabase(app);

// Export the services
export { auth, database }; 