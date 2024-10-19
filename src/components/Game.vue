<template>
  <div class="game-container p-6 flex flex-col items-center bg-gray-900 text-white min-h-screen">
    <h2 class="text-3xl font-bold mb-4 text-gray-100">Jeu de Rumble Memory</h2>

    <!-- Bouton pour mode invité -->
    <div class="mb-4">
      <label>
        <input type="checkbox" v-model="isGuest" />
        Jouer en mode invité
      </label>
    </div>

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
      selectedDifficulty: 'easy',
      cards: [],
      flippedCards: [],
      matchedPairs: [],
      score: 0,
      images: [tarot1, tarot2, tarot3, tarot4, tarot5, tarot6, tarot7, tarot8],
      isGuest: true, // Défini si l'utilisateur est en mode invité
      gameOver: false, // Nouvel état pour vérifier si le jeu est terminé
    };
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
      this.timer = 0;
      this.timerStarted = false;
      this.gameOver = false; // Réinitialiser à false au début d'une nouvelle partie
      clearInterval(this.timerInterval);
    },

    shuffleCards() {
      for (let i = this.cards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
      }
    },

    flipCard(index) {
      const card = this.cards[index];
      if (!this.timerStarted) this.startTimer();
      if (card.flipped || this.flippedCards.length === 2) return;

      card.flipped = true;
      this.flippedCards.push(index);
      if (this.flippedCards.length === 2) {
        setTimeout(this.checkMatch, 1000);
      }
    },

    checkMatch() {
      const [firstIndex, secondIndex] = this.flippedCards;
      const firstCard = this.cards[firstIndex];
      const secondCard = this.cards[secondIndex];

      if (firstCard.image === secondCard.image) {
        this.matchedPairs.push(firstCard.image);
        this.score += 100;
        if (this.matchedPairs.length === this.cards.length / 2) {
          this.stopTimer();
          this.gameOver = true; // Indique que le jeu est terminé
        }
      } else {
        this.errorCount++;
        firstCard.flipped = false;
        secondCard.flipped = false;
      }
      this.flippedCards = [];
    },

    startTimer() {
      this.timerStarted = true;
      this.timerInterval = setInterval(() => {
        this.timer++;
      }, 1000);
    },

    stopTimer() {
      clearInterval(this.timerInterval);
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






