import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA5-WnqCgtzb0gKaLLGfv_3MjUgnvVIwMs",
  authDomain: "quickhire-e11f5.firebaseapp.com",
  projectId: "quickhire-e11f5",
  storageBucket: "quickhire-e11f5.firebasestorage.app",
  messagingSenderId: "227949702072",
  appId: "1:227949702072:web:b43dd37ccde09424c7bd4d",
  measurementId: "G-TQC3TYP6GZ"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);