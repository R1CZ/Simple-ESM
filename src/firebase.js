// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut,} from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";





const firebaseConfig = {
  apiKey: "AIzaSyA4sM9ZgmbI6GghX8-m2O1hpweb1fC5GT0",
  authDomain: "employee-management-12280.firebaseapp.com",
  projectId: "employee-management-12280",
  storageBucket: "employee-management-12280.appspot.com", 
  messagingSenderId: "376489148677",
  appId: "1:376489148677:web:93c8d0f21d770f44a7376c",
  measurementId: "G-QSE50Q4VF6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage (app);

// Function to create an admin user
const setAdminRole = async (email) => {
  await setDoc(doc(db, "users", email), { role: "admin" });
};

// Function to get user role
const getUserRole = async (email) => {
  const docSnap = await getDoc(doc(db, "users", email));
  return docSnap.exists() ? docSnap.data().role : null;
};

export { auth, db, analytics, storage, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, setAdminRole, getUserRole,};
