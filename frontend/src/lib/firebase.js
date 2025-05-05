// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAYKTMxQ9AO83FU_IgsunZRAimA-MAoTCs",
  authDomain: "taskcircle-63837.firebaseapp.com",
  projectId: "taskcircle-63837",
  storageBucket: "taskcircle-63837.firebasestorage.app",
  messagingSenderId: "39129350188",
  appId: "1:39129350188:web:d5b996e604973fd4eb9189",
  measurementId: "G-J9S1JNFDPX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };