import { getAuth, signInWithPopup, GoogleAuthProvider, browserSessionPersistence, setPersistence } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { getFunctions, httpsCallable } from "firebase/functions";

const firebaseConfig = {
    apiKey: import.meta.env.VITE_APP_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_APP_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_APP_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_APP_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const functions = getFunctions(app, "asia-east1");
export const getRecipe = httpsCallable(functions, 'getRecipe');
export const getFlashCard = httpsCallable(functions, 'getFlashCard');

const auth = getAuth(app);
const  provider = new GoogleAuthProvider();
export const signInWithGoogle = async () => {
    await setPersistence(auth, browserSessionPersistence);
    return await signInWithPopup(auth, provider);
}

export const getCurrentAuth = () => auth;