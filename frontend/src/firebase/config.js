// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA5-WnqCgtzb0gKaLLGfv_3MjUgnvVIwMs",
  authDomain: "quickhire-e11f5.firebaseapp.com",
  projectId: "quickhire-e11f5",
  storageBucket: "quickhire-e11f5.firebasestorage.app",
  messagingSenderId: "227949702072",
  appId: "1:227949702072:web:b43dd37ccde09424c7bd4d",
  measurementId: "G-TQC3TYP6GZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const googleProvider = new GoogleAuthProvider();
const auth = getAuth(app);

export {auth, googleProvider};