// Firebase configuration and initialization
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDBGfRenNwHtnJDSMbvDWsvYQPNpz7U6Mo",
  authDomain: "log-in-testing-1e3f0.firebaseapp.com",
  projectId: "log-in-testing-1e3f0",
  storageBucket: "log-in-testing-1e3f0.firebasestorage.app",
  messagingSenderId: "288239608335",
  appId: "1:288239608335:web:37557f0e02be155452797a",
  measurementId: "G-SH36RE2WEX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
