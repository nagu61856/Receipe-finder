// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';


const firebaseConfig = {
  apiKey: "AIzaSyA5oKNsP_hOdEWprc3olZuUg_c9BC2a9zY",
  authDomain: "receipe-62acb.firebaseapp.com",
  projectId: "receipe-62acb",
  storageBucket: "receipe-62acb.appspot.com",
  messagingSenderId: "721387655442",
  appId: "1:721387655442:web:279b8907cdf706c6b9e3cb",
  measurementId: "G-T6Y58TRXHZ"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const db = getFirestore(app);

export { auth,googleProvider,db};