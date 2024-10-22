import { defineStore } from 'pinia';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { db } from '@/fireBase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null, // Stocke uniquement les infos essentielles
    errorMessage: null,
  }),

  actions: {
    // Inscription d'un nouvel utilisateur
    async signUp(email, password, userId) {
      const auth = getAuth();
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Stocke les informations dans Firestore
        await setDoc(doc(db, 'users', user.uid), {
          userId: userId,
          email: email,
          createdAt: new Date(),
        });

        this.user = { userId, email }; // Stocke uniquement l'email et le userId
        this.errorMessage = null; // Réinitialise l'erreur
      } catch (error) {
        this.errorMessage = error.message;
      }
    },

    // Connexion d'un utilisateur existant
    async signIn(email, password) {
      const auth = getAuth();
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Récupére l'ID utilisateur depuis Firestore
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        const userData = userDoc.data();

        this.user = { userId: userData.userId, email: user.email }; // Met à jour l'état avec les infos nécessaires
        this.errorMessage = null; // Réinitialise l'erreur
      } catch (error) {
        this.errorMessage = error.message;
      }
    },

    // Déconnexion de l'utilisateur
    async signOutUser() {
      const auth = getAuth();
      try {
        await signOut(auth);
        this.user = null;
      } catch (error) {
        this.errorMessage = error.message;
      }
    },

    // Écoute les changements d'état d'authentification
    listenToAuthStateChanges() {
      const auth = getAuth();
      onAuthStateChanged(auth, (user) => {
        if (user) {
          // Utilisateur connecté, mettre à jour l'état
          this.user = { userId: user.uid, email: user.email }; // Tu pourrais aussi récupérer d'autres données si nécessaire
        } else {
          // Aucun utilisateur connecté
          this.user = null;
        }
      });
    },
  },
});