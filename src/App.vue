<template>
  <div id="app" class="min-h-screen bg-gray-100">
    <!-- Navbar centrée -->
    <header class="bg-gray-800 text-white py-4">
      <nav class="container mx-auto flex justify-between items-center">
        <!-- Section de gauche avec les liens centrés -->
        <div class="flex items-center space-x-8">
          <h1 class="luckiest-guy-regular text-2xl font-bold animate-bounce">Rumble Memory</h1>

          <ul class="flex space-x-4">
            <li>
              <router-link to="/">
                <button class="bg-blue-500 text-white px-4 py-2 rounded shadow-md hover:bg-blue-600 hover:shadow-lg transition-all">
                  Accueil
                </button>
              </router-link>
            </li>
            <li>
              <router-link to="/game">
                <button class="bg-purple-500 text-white px-4 py-2 rounded shadow-md hover:bg-purple-600 hover:shadow-lg transition-all">
                  Game
                </button>
              </router-link>
            </li>
            <li>
              <router-link to="/leaderboard">
                <button class="bg-yellow-500 text-white px-4 py-2 rounded shadow-md hover:bg-yellow-600 hover:shadow-lg transition-all">
                  Classement
                </button>
              </router-link>
            </li>
            <li>
              <a href="https://youtu.be/dQw4w9WgXcQ?si=kFB5mui2EZx39Rpn" target="_blank" rel="noopener noreferrer">
                <button class="bg-red-500 text-white px-4 py-2 rounded shadow-md hover:bg-red-600 hover:shadow-lg transition-all">
                  Help
                </button>
              </a>
            </li>
          </ul>
        </div>

        <div class="flex items-center space-x-4">
          <button @click="showPopup = true" class="bg-gray-500 text-white px-4 py-2 rounded shadow-md hover:bg-gray-600 hover:shadow-lg transition-all">
            🎵 Music Player
          </button>
        </div>

        <div class="flex items-center space-x-4">
          <template v-if="isAuthenticated">
            <button @click="toggleProfile" class="bg-green-500 text-white px-4 py-2 rounded shadow-md hover:bg-green-600 hover:shadow-lg transition-all">
              Profil
            </button>
            <button @click="logout" class="bg-red-500 text-white px-4 py-2 rounded shadow-md hover:bg-red-600 hover:shadow-lg transition-all">
              Déconnexion
            </button>
          </template>

          <template v-else>
            <router-link to="/signup">
              <button class="bg-green-500 text-white px-4 py-2 rounded shadow-md hover:bg-green-600 hover:shadow-lg transition-all">
                Inscription/connexion
              </button>
            </router-link>
          </template>
        </div>
      </nav>
    </header>

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

    <main class="container mx-auto py-6">
      <router-view></router-view>
    </main>

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
    async logout() {
      const auth = getAuth();
      try {
        await signOut(auth);
        this.isAuthenticated = false;
        this.userEmail = '';
        this.userId = '';
        this.showProfile = false;
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
  },
  mounted() {
    const authStore = useAuthStore();
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.isAuthenticated = true;
        this.userEmail = user.email;
        this.userId = user.uid; // Récupération de userId ici
        // Si tu as besoin d'autres informations à partir du store, tu peux les ajouter ici
      } else {
        this.isAuthenticated = false;
        this.userEmail = '';
        this.userId = '';
      }
    });
  },
};
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Luckiest+Guy&display=swap');

$font-family_1: "Luckiest Guy", cursive;

@keyframes bounce {
	0%,20%,50%,80%,100% {
		transform: translateY(0);
	}
	40% {
		transform: translateY(-10px);
	}
	60% {
		transform: translateY(-5px);
	}
}
.luckiest-guy-regular {
	font-family: $font-family_1;
	font-weight: 400;
	font-style: normal;
}
.animate-bounce {
	animation: bounce 1s ease infinite;
}

</style>


