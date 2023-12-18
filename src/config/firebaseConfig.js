// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBdaOE3cQ--LlB4sLIAg0XC4ESi14werXQ",
  authDomain: "insureme-c2e0f.firebaseapp.com",
  projectId: "insureme-c2e0f",
  storageBucket: "insureme-c2e0f.appspot.com",
  messagingSenderId: "286152176198",
  appId: "1:286152176198:web:2110ba3645be87ba8ed047",
  measurementId: "G-X8PH0SP7MQ",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
