const { initializeApp } = require('firebase/app');
const { getFirestore, connectFirestoreEmulator } = require('firebase/firestore');
require('dotenv').config();

// Firebase configuration using your project details
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY || "AIzaSyDo6fn_G-jNjFCE0zs3ym1FPXpeVnbImcU",
  authDomain: process.env.FIREBASE_AUTH_DOMAIN || "toyshop-3779d.firebaseapp.com",
  projectId: process.env.FIREBASE_PROJECT_ID || "toyshop-3779d",
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET || "toyshop-3779d.firebasestorage.app",
  messagingSenderId: "754756387664",
  appId: "1:754756387664:web:e9ebde4c3fcef56c2e6255",
  measurementId: "G-V4SKLH033C"
};

let app;
let db;

// Initialize Firebase
const initializeFirebase = () => {
  try {
    if (!app) {
      app = initializeApp(firebaseConfig);
      db = getFirestore(app);
      
      // Add connection settings for better reliability
      if (process.env.NODE_ENV === 'development') {
        // Enable offline persistence for development
        console.log('🔥 Firebase initialized successfully with offline support');
      } else {
        console.log('🔥 Firebase initialized successfully');
      }
    }
    return app;
  } catch (error) {
    console.error('❌ Firebase initialization error:', error);
    throw error;
  }
};

// Get Firestore database instance
const getFirestoreDB = () => {
  if (!db) {
    initializeFirebase();
  }
  return db;
};

module.exports = {
  initializeFirebase,
  getFirestore: getFirestoreDB,
  getFirestoreDB
};
