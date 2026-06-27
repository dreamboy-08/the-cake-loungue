import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
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
let app;
try {
  if (firebaseConfig.apiKey && firebaseConfig.apiKey !== "your_api_key" && firebaseConfig.apiKey !== "missing") {
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  } else {
    if (typeof window !== 'undefined') {
      console.warn("Firebase configuration is missing or invalid. Please check your environment variables.");
    }
    // Initialize with a dummy app to prevent crashes during build or if env vars are missing
    app = getApps().length > 0 ? getApp() : initializeApp({
      apiKey: "missing",
      authDomain: "missing",
      projectId: "missing"
    });
  }
} catch (error) {
  console.error("Error initializing Firebase:", error);
  // Fallback to existing app if already initialized
  app = getApp();
}

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
