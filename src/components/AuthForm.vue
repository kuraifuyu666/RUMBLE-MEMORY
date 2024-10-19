<template>
  <div class="max-w-md mx-auto bg-white p-6 rounded shadow">
    <h2 class="text-2xl font-bold mb-4">{{ formTitle }}</h2>
    
    <!-- Formulaire de connexion ou inscription -->
    <form @submit.prevent="submitForm" v-if="!isAuthenticated">
      <div class="mb-4">
        <label class="block text-sm font-bold mb-2">E-mail</label>
        <input v-model="email" type="email" class="w-full p-2 border border-gray-300 rounded" required />
      </div>
      <div class="mb-4" v-if="isSignUp">
        <label class="block text-sm font-bold mb-2">Pseudo</label>
        <input v-model="pseudo" type="text" class="w-full p-2 border border-gray-300 rounded" required />
      </div>
      <div class="mb-4">
        <label class="block text-sm font-bold mb-2">Mot de passe</label>
        <input v-model="password" type="password" class="w-full p-2 border border-gray-300 rounded" required />
      </div>
      <button class="w-full bg-blue-500 text-white p-2 rounded">{{ submitText }}</button>
    </form>

    <!-- Afficher le bouton Profil si l'utilisateur est connecté -->
    <div v-if="isAuthenticated" class="mt-4">
      <button @click="toggleProfile" class="w-full bg-green-500 text-white p-2 rounded">Profil</button>
    </div>

    <!-- Menu Profil : afficher le pseudo et inviter un ami -->
    <div v-if="isAuthenticated && showProfile" class="mt-4 bg-gray-100 p-4 rounded shadow">
      <h3 class="text-lg font-bold mb-2">Profil</h3>
      <p><strong>Pseudo :</strong> {{ pseudo || 'Chargement...' }}</p> <!-- Afficher le pseudo ici -->

      <!-- Section pour inviter des amis -->
      <h3 class="text-lg font-bold mt-4 mb-2">Inviter un ami</h3>
      <input v-model="friendEmail" type="email" class="w-full p-2 border border-gray-300 rounded mb-2" placeholder="E-mail de l'ami" />
      <button @click="inviteFriend" class="w-full bg-blue-500 text-white p-2 rounded">Inviter</button>
      <div v-if="inviteMessage" class="mt-2 text-green-500">{{ inviteMessage }}</div>
      <div v-if="inviteError" class="mt-2 text-red-500">{{ inviteError }}</div>

      <button @click="logout" class="w-full bg-red-500 text-white p-2 rounded mt-4">Déconnexion</button>
      <button @click="deleteAccount" class="w-full bg-red-700 text-white p-2 rounded mt-2">Supprimer le compte</button>
    </div>

    <!-- Message d'erreur ou de succès -->
    <div v-if="errorMessage" class="text-red-500 mt-2">{{ errorMessage }}</div>
    <div v-if="successMessage" class="text-green-500 mt-2">{{ successMessage }}</div>
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
/* Ajoute des styles ici si nécessaire */
</style>




