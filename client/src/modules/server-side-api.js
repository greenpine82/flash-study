import {
    getAuth,
    signInWithPopup,
    signInWithEmailAndPassword,
    GoogleAuthProvider,
    browserSessionPersistence,
    setPersistence
} from 'firebase/auth';
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

const auth = getAuth(app);
const  provider = new GoogleAuthProvider();
export const signInWithGoogle = async () => {
    await setPersistence(auth, browserSessionPersistence);
    return await signInWithPopup(auth, provider);
}

export const signIn = async (user, pass) => {
    await setPersistence(auth, browserSessionPersistence);
    return await signInWithEmailAndPassword(auth, user, pass);
}

export const getCurrentAuth = () => auth;

const functions = getFunctions(app, "asia-east1");
export const getRecipe = httpsCallable(functions, 'getRecipe');

function toObject(str) {
    const jsonString = str.replace("```json", "").replace("```", "");
    return JSON.parse(jsonString);
}

const getFlashCard = httpsCallable(functions, 'getFlashCard');
export const createFlashCard = async (base64) => {
    let result = await getFlashCard({ file: base64 });
    return toObject(result.data);
}

const getFillBlankQuestions = httpsCallable(functions, 'getFillBlankQuestions');
export const createFillBlankQuestions = async (construct_response_question) => {
    let result = await getFillBlankQuestions({ questions: construct_response_question });
    return toObject(result.data);
}
