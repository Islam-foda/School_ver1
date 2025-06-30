
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyA8tnAToQ96Hupt3vhYFrcA2Z29BM62JFg",
  authDomain: "schoolhub-50647.firebaseapp.com",
  projectId: "schoolhub-50647",
  storageBucket: "schoolhub-50647.firebasestorage.app",
  messagingSenderId: "973242010170",
  appId: "1:973242010170:web:af93a3e564d5940c3fc303",
  measurementId: "G-LVJ6JFYV55"
};




const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
