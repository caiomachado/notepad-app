import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: process.env.FIREBASE_CONFIG_API_KEY,
    authDomain: "notion-clone-1401c.firebaseapp.com",
    projectId: "notion-clone-1401c",
    storageBucket: "notion-clone-1401c.firebasestorage.app",
    messagingSenderId: "41013535965",
    appId: "1:41013535965:web:5074e4a8ed3a65d2fba734"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export { db };