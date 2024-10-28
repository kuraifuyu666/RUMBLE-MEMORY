<template>
  <div id="app" class="min-h-screen bg-gray-100">
    <header class="bg-gray-800 text-white py-4">
      <nav class="container mx-auto flex justify-between items-center">
        <h1 class="luckiest-guy-regular text-2xl font-bold animate-bounce">Rumble Memory</h1>

        <!-- Bouton Burger -->
        <button @click="toggleMenu" class="block lg:hidden focus:outline-none">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>

        <div class="hidden lg:flex items-center space-x-4">
          <router-link to="/">
            <button class="bg-blue-500 text-white px-4 py-2 rounded shadow-md hover:bg-blue-600 transition-all">
              Accueil
            </button>
          </router-link>
          <router-link to="/game">
            <button class="bg-purple-500 text-white px-4 py-2 rounded shadow-md hover:bg-purple-600 transition-all">
              Game
            </button>
          </router-link>
          <router-link to="/leaderboard">
            <button class="bg-yellow-500 text-white px-4 py-2 rounded shadow-md hover:bg-yellow-600 transition-all">
              Classement
            </button>
          </router-link>
          <a href="https://youtu.be/dQw4w9WgXcQ?si=kFB5mui2EZx39Rpn" target="_blank" rel="noopener noreferrer">
            <button class="bg-red-500 text-white px-4 py-2 rounded shadow-md hover:bg-red-600 transition-all">
              Help
            </button>
          </a>
          <button @click="togglePopup" class="bg-gray-500 text-white px-4 py-2 rounded shadow-md hover:bg-gray-600 transition-all">
            🎵 Music Player
          </button>
          <button v-if="!isAuthenticated" @click="goToLogin" class="bg-green-500 text-white px-4 py-2 rounded shadow-md hover:bg-green-600 transition-all">
            Inscription/Connexion
          </button>
          <button v-if="isAuthenticated" @click="toggleProfile" class="bg-gray-600 text-white px-4 py-2 rounded shadow-md hover:bg-gray-700 transition-all">
            Profil
          </button>
          <button v-if="isAuthenticated" @click="logout" class="bg-red-600 text-white px-4 py-2 rounded shadow-md hover:bg-red-700 transition-all">
            Déconnexion
          </button>
        </div>
      </nav>
    </header>

    <!-- Menu Burger -->
    <div v-if="menuOpen" class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center lg:hidden">
      <div class="bg-gray-900 text-white p-4 rounded-lg shadow-lg w-3/4 max-w-sm">
        <button @click="toggleMenu" class="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full">✖️</button>
        <router-link to="/" @click="toggleMenu">
          <button class="bg-blue-500 text-white px-4 py-2 rounded w-full mt-2">Accueil</button>
        </router-link>
        <router-link to="/game" @click="toggleMenu">
          <button class="bg-purple-500 text-white px-4 py-2 rounded w-full mt-2">Game</button>
        </router-link>
        <router-link to="/leaderboard" @click="toggleMenu">
          <button class="bg-yellow-500 text-white px-4 py-2 rounded w-full mt-2">Classement</button>
        </router-link>
        <a href="https://youtu.be/dQw4w9WgXcQ?si=kFB5mui2EZx39Rpn" target="_blank" rel="noopener noreferrer" @click="toggleMenu">
          <button class="bg-red-500 text-white px-4 py-2 rounded w-full mt-2">Help</button>
        </a>
        <button @click="togglePopup" class="bg-gray-500 text-white px-4 py-2 rounded w-full mt-2">🎵 Music Player</button>
        <button v-if="!isAuthenticated" @click="goToLogin" class="bg-green-500 text-white px-4 py-2 rounded w-full mt-2">Inscription/Connexion</button>
        <button v-if="isAuthenticated" @click="toggleProfile" class="bg-gray-600 text-white px-4 py-2 rounded w-full mt-2">Profil</button>
        <button v-if="isAuthenticated" @click="logout" class="bg-red-600 text-white px-4 py-2 rounded w-full mt-2">Déconnexion</button>
      </div>
    </div>

    <main class="container mx-auto py-6">
      <router-view></router-view>
    </main>

    <!-- code pour le popup et le profil -->
    <div v-if="showPopup" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div class="bg-gray-900 text-white p-4 rounded-lg shadow-lg relative">
        <MusicPlayer 
          :showControls="true"
          :isPlaying="isPlaying"
          :volume="volume"
          :selectedTrack="selectedTrack"
        />
        <button @click="showPopup = false" class="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full">
          ✖️
        </button>
      </div>
    </div>

    <div v-if="showProfile" class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div class="bg-white p-4 rounded shadow-lg relative">
        <h2 class="text-lg font-bold">Mon Profil</h2>
        <p class="mt-2">User ID: {{ userId }}</p>
        <p class="mt-2">Email: {{ userEmail }}</p>
        <button @click="deleteAccount" class="bg-red-700 text-white px-4 py-2 rounded mt-2">Supprimer le compte</button>
        <button @click="toggleProfile" class="absolute top-2 right-2 bg-gray-500 text-white p-2 rounded-full">✖️</button>
      </div>
    </div>
  </div>
</template>

<script>
import MusicPlayer from "@/components/MusicPlayer.vue";
import { getAuth, signOut, deleteUser, onAuthStateChanged } from 'firebase/auth';
import { useAuthStore } from '@/stores/useAuthStore';

export default {
  name: 'App',
  components: {
    MusicPlayer,
  },
  data() {
    return {
      showPopup: false,
      showProfile: false,
      menuOpen: false, // État du menu burger
      isPlaying: false,
      volume: 50,
      selectedTrack: 0,
      isAuthenticated: false,
      userEmail: '',
      userId: '',
    };
  },
  methods: {
    togglePlayPause() {
      this.isPlaying = !this.isPlaying;
    },
    changeTrack(index) {
      this.selectedTrack = index;
    },
    adjustVolume(value) {
      this.volume = value;
    },
    toggleProfile() {
      this.showProfile = !this.showProfile;
    },
    toggleMenu() {
      this.menuOpen = !this.menuOpen; // Ouvrir ou fermer le menu
    },
    goToLogin() {
      this.toggleMenu();
      this.$router.push('/login'); // Rediriger vers la page de connexion
    },
    async logout() {
      const auth = getAuth();
      try {
        await signOut(auth);
        this.isAuthenticated = false;
        this.userEmail = '';
        this.userId = '';
        this.showProfile = false;
        this.menuOpen = false; // Fermer le menu à la déconnexion
      } catch (error) {
        console.error('Erreur lors de la déconnexion:', error);
      }
    },
    async deleteAccount() {
      const auth = getAuth();
      const user = auth.currentUser;
      if (user) {
        try {
          await deleteUser(user);
          this.isAuthenticated = false;
          this.userEmail = '';
          this.userId = '';
          this.showProfile = false;
        } catch (error) {
          console.error('Erreur lors de la suppression du compte:', error);
        }
      }
    },
    togglePopup() {
      this.showPopup = !this.showPopup; // Ouvrir ou fermer le popup
    },
  },
  mounted() {
    const authStore = useAuthStore();
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.isAuthenticated = true;
        this.userEmail = user.email;
        this.userId = user.uid;
      } else {
        this.isAuthenticated = false;
        this.userEmail = '';
        this.userId = '';
      }
    });
  },
};
</script>

<style scoped lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Luckiest+Guy&display=swap');

$font-family_1: "Luckiest Guy", cursive;

.luckiest-guy-regular {
	font-family: $font-family_1;
	font-weight: 400;
	font-style: normal;
}
</style>




