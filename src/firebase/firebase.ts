import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyDn1atC5sws715d1BiyvEZ0B16Oy3G553Y',
  authDomain: 'flash-card-ba896.firebaseapp.com',
  projectId: 'flash-card-ba896',
  storageBucket: 'flash-card-ba896.appspot.com',
  messagingSenderId: '205349352593',
  appId: '1:205349352593:web:d92d12e6cb4fd048383b30'
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
