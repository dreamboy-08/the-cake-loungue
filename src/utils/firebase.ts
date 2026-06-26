import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { initializeFirestore, getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase only if API key is present
const isConfigValid = firebaseConfig.apiKey && firebaseConfig.apiKey !== "your_api_key" && firebaseConfig.apiKey !== "undefined";

const app = getApps().length > 0
  ? getApp()
  : initializeApp(isConfigValid ? firebaseConfig : {
      apiKey: "missing",
      authDomain: "missing",
      projectId: "missing"
    });

// Initialize Auth
const auth = getAuth(app);

// Initialize Firestore with settings to handle undefined properties
const db = initializeFirestore(app, {
  ignoreUndefinedProperties: true,
});

// Initialize Storage
const storage = getStorage(app);

export { app, auth, db, storage };
