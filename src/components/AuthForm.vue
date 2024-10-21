<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-900">
    <div class="auth-form bg-gradient-to-r from-gray-800 via-gray-900 to-black shadow-lg rounded-lg p-8 text-white w-full max-w-md">
      <h2 class="text-3xl font-bold mb-4 text-yellow-400 uppercase tracking-widest" v-if="isSignUpMode">Sign Up</h2>
      <h2 class="text-3xl font-bold mb-4 text-yellow-400 uppercase tracking-widest" v-else>Log In</h2>

      <form @submit.prevent="isSignUpMode ? signUp() : signIn()">
        <div class="form-group mb-4">
          <label for="email" class="block text-white text-sm font-bold mb-2">Email:</label>
          <input
            v-model="email"
            type="email"
            id="email"
            v-if="isSignUpMode"
            class="w-full p-3 text-gray-900 rounded-lg shadow-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
            placeholder="Enter your email"
            required
          />
          <input
            v-model="email"
            type="text"
            id="email"
            v-else
            class="w-full p-3 text-gray-900 rounded-lg shadow-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
            placeholder="User ID"
            required
          />
        </div>

        <div v-if="isSignUpMode" class="form-group mb-4">
          <label for="userId" class="block text-white text-sm font-bold mb-2">User ID:</label>
          <input
            v-model="userId"
            type="text"
            id="userId"
            class="w-full p-3 text-gray-900 rounded-lg shadow-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
            placeholder="Create a User ID"
            required
          />
        </div>

        <div class="form-group mb-6">
          <label for="password" class="block text-white text-sm font-bold mb-2">Password:</label>
          <input
            v-model="password"
            type="password"
            id="password"
            class="w-full p-3 text-gray-900 rounded-lg shadow-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
            placeholder="Enter your password"
            required
          />
        </div>

        <button
          type="submit"
          class="w-full bg-yellow-400 text-gray-800 py-2 px-4 rounded-full hover:bg-yellow-500 transition-all duration-300 ease-in-out"
        >
          {{ isSignUpMode ? 'Sign Up' : 'Log In' }}
        </button>

        <p v-if="authStore.errorMessage" class="error-message text-red-500 mt-4">{{ authStore.errorMessage }}</p>
      </form>

      <p @click="toggleMode" class="toggle-mode text-white text-sm mt-4 cursor-pointer hover:underline">
        {{ isSignUpMode ? 'Vous avez un compte? Log In' : "Vous n'avez pas de compte? Sign Up" }}
      </p>
    </div>
  </div>
</template>

<script>
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, deleteUser, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, query, collection, where, getDocs } from 'firebase/firestore';
import { useRouter } from 'vue-router'; 
import { reactive, toRefs, onMounted, computed } from 'vue'; 

export default {
  name: 'AuthForm',
  props: {
    isSignUp: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const router = useRouter();
    const auth = getAuth();
    const db = getFirestore();
    const state = reactive({
      email: '',
      pseudo: '', // Pour stocker le pseudo
      password: '',
      errorMessage: '',
      successMessage: '',
      isAuthenticated: false,
      showProfile: false,
      friendEmail: '',
      inviteMessage: '',
      inviteError: '',
    });

    const formTitle = computed(() => (props.isSignUp ? 'Inscription' : 'Connexion'));
    const submitText = computed(() => (props.isSignUp ? 'Inscrire' : 'Se Connecter'));

    // Fonction de validation
    const validateForm = () => {
      if (!state.email.includes('@')) {
        state.errorMessage = 'Veuillez entrer un e-mail valide.';
        return false;
      }
      if (state.password.length < 6) {
        state.errorMessage = 'Le mot de passe doit comporter au moins 6 caractères.';
        return false;
      }
      return true;
    };

    const submitForm = async () => {
      state.errorMessage = '';
      state.successMessage = '';

      // Validation du formulaire
      if (!validateForm()) {
        return; // Stoppe l'exécution si le formulaire n'est pas valide
      }

      if (props.isSignUp) {
        try {
          const userCredential = await createUserWithEmailAndPassword(auth, state.email, state.password);
          // Enregistrer le pseudo dans Firestore
          await setDoc(doc(db, 'users', userCredential.user.uid), {
            pseudo: state.pseudo,
            email: state.email,
          });
          state.successMessage = 'Inscription réussie!';
          state.isAuthenticated = true;
          console.log('Utilisateur inscrit:', userCredential.user);
          router.push('/'); // Redirection vers la page d'accueil après l'inscription
        } catch (error) {
          state.errorMessage = error.message;
        }
      } else {
        try {
          let email = state.email;

          // Vérifier si l'utilisateur a entré un pseudo
          if (!email.includes('@')) {
            const q = query(collection(db, 'users'), where('pseudo', '==', state.email));
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
              state.errorMessage = 'Aucun utilisateur trouvé avec ce pseudo.';
              return;
            }

            // Obtenir l'e-mail correspondant au pseudo
            querySnapshot.forEach((doc) => {
              email = doc.data().email; // Met à jour l'email avec celui trouvé dans Firestore
            });
          }

          // Connexion avec l'e-mail récupéré ou entré
          const userCredential = await signInWithEmailAndPassword(auth, email, state.password);
          state.successMessage = 'Connexion réussie!';
          state.isAuthenticated = true;
          console.log('Utilisateur connecté:', userCredential.user);

          // Récupérer le pseudo depuis Firestore
          const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
          if (userDoc.exists()) {
            state.pseudo = userDoc.data().pseudo; // Mettre à jour le pseudo dans l'état
          }

          router.push('/'); // Redirection vers la page d'accueil après la connexion
        } catch (error) {
          console.error('Erreur lors de la connexion:', error);
          state.errorMessage = error.message;
        }
      }
    };

    const logout = async () => {
      try {
        await signOut(auth);
        state.isAuthenticated = false;
        state.showProfile = false;
        state.successMessage = 'Déconnexion réussie!';
      } catch (error) {
        state.errorMessage = error.message;
      }
    };

    const deleteAccount = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          await deleteUser(user);
          state.isAuthenticated = false;
          state.showProfile = false;
          state.successMessage = 'Compte supprimé avec succès';
        } catch (error) {
          state.errorMessage = error.message;
        }
      }
    };

    // Méthode pour inviter un ami
    const inviteFriend = async () => {
      state.inviteMessage = '';
      state.inviteError = '';

      // Vérification de l'e-mail de l'ami
      if (!state.friendEmail.includes('@')) {
        state.inviteError = 'Veuillez entrer un e-mail valide.';
        return;
      }

      try {
        // Ici, tu peux appeler une fonction pour envoyer l'invitation
        // Simulons l'envoi d'une invitation :
        console.log(`Invitation envoyée à : ${state.friendEmail}`);
        state.inviteMessage = 'Invitation envoyée avec succès !';
        state.friendEmail = ''; // Réinitialiser le champ
      } catch (error) {
        state.inviteError = 'Erreur lors de l\'envoi de l\'invitation.';
        console.error(error);
      }
    };

    const toggleProfile = () => {
      state.showProfile = !state.showProfile;
    };

    // Vérifie l'état d'authentification au démarrage
    onMounted(() => {
      onAuthStateChanged(auth, (user) => {
        state.isAuthenticated = !!user; // Met à jour isAuthenticated
        if (user) {
          // Récupérer le pseudo de Firestore
          getDoc(doc(db, 'users', user.uid)).then((userDoc) => {
            if (userDoc.exists()) {
              state.pseudo = userDoc.data().pseudo; // Mettre à jour le pseudo dans l'état
            } else {
              console.warn('Aucun document trouvé pour cet utilisateur dans Firestore.');
            }
          }).catch((error) => {
            console.error('Erreur lors de la récupération du document Firestore:', error);
          });
        }
      });
    });

    return {
      ...toRefs(state),
      submitForm,
      logout,
      deleteAccount,
      inviteFriend,
      toggleProfile,
      formTitle,
      submitText,
    };
  },
};
</script>

<style scoped>
.error-message {
  text-align: center;
  color: red;
  font-weight: 600; /* semi-bold */
}
</style>









