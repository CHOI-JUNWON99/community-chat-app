// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDSTAcpdQ-fDPw10h9wz3y_cS-bywHgVAY",
  authDomain: "community-chat-app-68996.firebaseapp.com",
  projectId: "community-chat-app-68996",
  storageBucket: "community-chat-app-68996.appspot.com",
  messagingSenderId: "523216978134",
  appId: "1:523216978134:web:a4bae7b951e880a7f78977",
  measurementId: "G-3VB219MYP1",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
