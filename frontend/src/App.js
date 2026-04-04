import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBjxocIwjb2ietXXYkhsObkFkzWQEc7x80",
  authDomain: "maxtvpro-roleta.firebaseapp.com",
  projectId: "maxtvpro-roleta",
  storageBucket: "maxtvpro-roleta.firebasestorage.app",
  messagingSenderId: "39113863514",
  appId: "1:39113863514:web:30212d1fcc1e56421c4363"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
