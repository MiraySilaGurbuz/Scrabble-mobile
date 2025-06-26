import { initializeApp, getApps } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword  } from 'firebase/auth';

import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "your_apiKey",
  authDomain: "your_authDomain.firebaseapp.com",
  projectId: "your_projectId",
  storageBucket: "your_storageBucket.firebasestorage.app",
  messagingSenderId: "your_messagingSenderId",
  appId: "your_appId"
};

// Initialize Firebase
let app;
if (!getApps().length) {
    app = initializeApp(firebaseConfig);
} else {
    app = getApps()[0];
}
const auth = getAuth(app);

const db = getDatabase(app);
export { auth, db };
