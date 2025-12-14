// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBRVrKfFmJmQL07HB2_tyPk4mwcPQQqXdM",
  authDomain: "emilyqiao-vibecoding.firebaseapp.com",
  projectId: "emilyqiao-vibecoding",
  storageBucket: "emilyqiao-vibecoding.firebasestorage.app",
  messagingSenderId: "381599961996",
  appId: "1:381599961996:web:9e87f662db6948fef77ca9",
  measurementId: "G-BK6EVMMGBR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);