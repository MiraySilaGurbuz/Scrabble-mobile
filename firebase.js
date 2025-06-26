// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword  } from 'firebase/auth';

import { getDatabase } from 'firebase/database';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDeS0Nc_4gjPD_ZGP7Rf5v4Jp3mMl8AJK8",
  authDomain: "scrabbleyeni.firebaseapp.com",
  projectId: "scrabbleyeni",
  storageBucket: "scrabbleyeni.firebasestorage.app",
  messagingSenderId: "47993579802",
  appId: "1:47993579802:web:2f9cced9ac56a66ed4e4a3"
};

// Initialize Firebase
let app;
if (!getApps().length) {
    app = initializeApp(firebaseConfig);
} else {
    app = getApps()[0];
}
const auth = getAuth(app);

const db = getDatabase(app); // ✅ EKLENDİ
export { auth, db };
