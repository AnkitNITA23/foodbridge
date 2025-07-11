// Replace these config values with YOUR OWN from Firebase Console
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCxbukYxkdDDLpdpZetT_TNfPq_z9fnT9w",
  authDomain: "foodbridge-67a75.firebaseapp.com",
  projectId: "foodbridge-67a75",
  storageBucket: "foodbridge-67a75.firebasestorage.app",
  messagingSenderId: "245061558653",
  appId: "1:245061558653:web:91beb75e1c39303b32ec14",
  measurementId: "G-WJMSHM5HEF"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
