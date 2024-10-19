<template>
  <div class="game-container p-6 flex flex-col items-center bg-gray-900 text-white min-h-screen">
    <h2 class="text-3xl font-bold mb-4 text-gray-100">Jeu de Rumble Memory</h2>

    <!-- Bouton Rejouer, visible seulement si le jeu est terminé -->
    <button 
      v-if="gameOver" 
      @click="initializeGame" 
      class="mt-4 bg-purple-500 text-white px-4 py-2 rounded shadow-md hover:bg-purple-600 transition-all"
    >
      Rejouer
    </button>

    <div class="flex items-center space-x-8 mb-4">
      <div>
        <label for="difficulty" class="block text-lg font-medium text-gray-200 mb-2">
          Sélectionnez la difficulté :
        </label>
        <select
          id="difficulty"
          v-model="selectedDifficulty"
          @change="initializeGame"
          class="bg-gray-700 text-gray-100 border border-gray-600 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 hover:bg-gray-600 transition-all"
        >
          <option value="easy" class="bg-gray-800">Facile (4 paires)</option>
          <option value="medium" class="bg-gray-800">Moyen (6 paires)</option>
          <option value="hard" class="bg-gray-800">Difficile (8 paires)</option>
        </select>
      </div>

      <div class="text-xl bg-gray-800 text-gray-100 p-3 rounded-lg shadow-lg">
        <span>Score : {{ score }}</span>
      </div>
      <div class="text-xl bg-gray-800 text-gray-100 p-3 rounded-lg shadow-lg">
        <span>Erreurs : {{ errorCount }}</span>
      </div>
      <div class="text-xl bg-gray-800 text-gray-100 p-3 rounded-lg shadow-lg">
        <span>Temps : {{ timer }}s</span>
      </div>
    </div>

    <div class="cards-container grid grid-cols-4 gap-4 justify-center p-4 bg-gray-800 rounded-lg shadow-lg">
      <div
        v-for="(card, index) in cards"
        :key="index"
        class="card bg-gray-700 rounded-lg shadow-xl p-4 flex items-center justify-center cursor-pointer hover:bg-gray-600"
        @click="flipCard(index)"
      >
        <img v-if="!card.flipped" src="@/assets/card-back.jpg" alt="Card Back" class="w-full h-full object-cover rounded-lg">
        <img v-else :src="card.image" alt="card image" class="w-full h-full object-cover rounded-lg">
      </div>
    </div>
  </div>
</template>

<script>
import { useGameStore } from '@/stores/gameStore'; // Assurez-vous que le chemin est correct
import { useAuthStore } from '@/stores/useAuthStore'; // Importer le store d'authentification
import tarot1 from '@/assets/tarot1.jpg';
import tarot2 from '@/assets/tarot2.jpg';
import tarot3 from '@/assets/tarot3.jpg';
import tarot4 from '@/assets/tarot4.jpg';
import tarot5 from '@/assets/tarot5.jpg';
import tarot6 from '@/assets/tarot6.jpg';
import tarot7 from '@/assets/tarot7.jpg';
import tarot8 from '@/assets/tarot8.jpg';

export default {
  data() {
    return {
      errorCount: 0,
      timer: 0,
      timerStarted: false,
      timerInterval: null,
      selectedDifficulty: 'easy', // Défaut à 'easy'
      cards: [],
      flippedCards: [],
      matchedPairs: [],
      score: 0,
      images: [tarot1, tarot2, tarot3, tarot4, tarot5, tarot6, tarot7, tarot8],
      gameOver: false, // Nouvel état pour vérifier si le jeu est terminé
    };
  },

  mounted() {
    this.initializeGame(); // Initialiser le jeu à chaque fois que le composant est monté
  },

  methods: {
    initializeGame() {
      let numberOfPairs;
      if (this.selectedDifficulty === 'easy') numberOfPairs = 4;
      else if (this.selectedDifficulty === 'medium') numberOfPairs = 6;
      else if (this.selectedDifficulty === 'hard') numberOfPairs = 8;

      const selectedImages = this.images.slice(0, numberOfPairs);
      this.cards = [...selectedImages, ...selectedImages].map(image => ({ image, flipped: false }));
      this.shuffleCards();
      this.flippedCards = [];
      this.matchedPairs = [];
      this.errorCount = 0; 
      this.score = 0; // Réinitialiser le score à 0
      this.timer = 0;
      this.timerStarted = false;
      this.gameOver = false; // Réinitialiser à false au début d'une nouvelle partie

      // Réinitialiser les statistiques du jeu dans le store
      const gameStore = useGameStore();
      gameStore.setGameStats(0, 0, 0); // Réinitialiser le score, le compteur d'erreurs et le temps
    },

    startTimer() {
      if (!this.timerStarted) {
        this.timerStarted = true;
        this.timerInterval = setInterval(() => {
          this.timer += 1;
        }, 1000);
      }
    },

    shuffleCards() {
      for (let i = this.cards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
      }
    },

    flipCard(index) {
      // Vérifie si la carte est déjà retournée ou si le jeu est terminé
      if (this.cards[index].flipped || this.gameOver) return;

      // Démarrer le chronomètre si c'est la première carte retournée
      this.startTimer();

      // Retourne la carte
      this.cards[index].flipped = true;
      this.flippedCards.push(index);

      // Vérifie si deux cartes sont retournées
      if (this.flippedCards.length === 2) {
        this.checkMatch();
      }
    },

    checkMatch() {
      const [firstIndex, secondIndex] = this.flippedCards;
      if (this.cards[firstIndex].image === this.cards[secondIndex].image) {
        this.matchedPairs.push(this.cards[firstIndex].image); // Ajoute l'image à matchedPairs
        this.score += 1; // Augmente le score
        this.flippedCards = []; // Réinitialise flippedCards
        this.checkGameOver(); // Vérifie si le jeu est terminé
      } else {
        // Si pas de match, retourne les cartes après un délai
        setTimeout(() => {
          this.cards[firstIndex].flipped = false;
          this.cards[secondIndex].flipped = false;
          this.errorCount += 1; // Augmente le compteur d'erreurs
          this.flippedCards = []; // Réinitialise flippedCards
        }, 1000);
      }
    },

    checkGameOver() {
      if (this.matchedPairs.length === this.cards.length / 2) {
        this.gameOver = true;
        clearInterval(this.timerInterval); // Arrêter le chronomètre

        // Envoie les résultats au store
        const gameStore = useGameStore();
        gameStore.setGameStats(this.score, this.errorCount, this.timer);
        
        // Récupérer l'ID utilisateur à partir du store d'authentification
        const authStore = useAuthStore();
        const userId = authStore.user?.uid; // Assurez-vous que l'utilisateur est connecté

        // Enregistrer les résultats dans Firebase
        if (userId) {
          gameStore.userId = userId; // Définir l'ID utilisateur dans le store de jeu
          gameStore.saveGameResults(); // Envoie les résultats à Firebase
        } else {
          console.error('User ID is not available.');
        }
      }
    },
  },

  beforeDestroy() {
    clearInterval(this.timerInterval);
  },
};
</script>

<style scoped>
.game-container {
  padding: 20px;
  background-color: #1f2937;
}
.card {
  transition: transform 0.2s, background-color 0.2s;
  width: 160px;
  height: 280px;
}
.card:hover {
  transform: scale(1.05);
  background-color: #374151;
}
</style>












