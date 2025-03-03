import { initializeApp } from 'firebase/app';
import { getFirestore, collection } from 'firebase/firestore';

// Configuration de Firebase
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: "projet-rumble-memory.firebaseapp.com",
  projectId: "projet-rumble-memory",
  storageBucket: "projet-rumble-memory.appspot.com",
  messagingSenderId: "554392384106",
  appId: "1:554392384106:web:0e7d4d1022fcb1cc1e9013"
};

// Initialisation de l'application Firebase
export const firebaseApp = initializeApp(firebaseConfig);

// Utilisé pour les références Firestore
const db = getFirestore(firebaseApp);

// Exportation de la base de données et d'autres références
export const todosRef = collection(db, 'todos');
export { db }; // Ajoute cette ligne pour exporter db
