<template>
  <div class="game-container p-6 flex flex-col items-center bg-gray-900 text-white min-h-screen">
    <h2 class="text-3xl font-bold mb-4 text-gray-100">Jeu de Rumble Memory</h2>

    <!-- Conteneur pour le compteur d'erreurs, la sélection de difficulté et le timer alignés côte à côte -->
    <div class="flex items-center space-x-8 mb-4">
      <!-- Affichage du compteur d'erreurs -->
      <div class="text-xl bg-gray-800 text-gray-100 p-3 rounded-lg shadow-lg">
        <span>Erreurs : {{ errorCount }}</span>
      </div>

      <!-- Sélection de la difficulté -->
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

      <!-- Affichage du timer à droite -->
      <div class="text-xl bg-gray-800 text-gray-100 p-3 rounded-lg shadow-lg">
        <span>Temps : {{ timer }}s</span>
      </div>
    </div>

    <!-- Grille de cartes dans un conteneur -->
    <div class="cards-container grid grid-cols-4 gap-4 justify-center p-4 bg-gray-800 rounded-lg shadow-lg">
      <div
        v-for="(card, index) in cards"
        :key="index"
        class="card bg-gray-700 rounded-lg shadow-xl p-4 flex items-center justify-center cursor-pointer hover:bg-gray-600"
        @click="flipCard(index)"
      >

      <!-- Affiche l'image du dos de la carte si elle n'est pas retournée -->
        <img v-if="!card.flipped" src="@/assets/card-back.jpg" alt="Card Back" class="w-full h-full object-cover rounded-lg">
        
      <!-- Affiche l'image si la carte est retournée -->
        <img v-else :src="card.image" alt="card image" class="w-full h-full object-cover rounded-lg">
      
      </div>
    </div>
  </div>
</template>

<script>
        // Chemins des images intégrées
        import tarot1 from '@/assets/tarot1.jpg';
        import tarot2 from '@/assets/tarot2.jpg';
        import tarot3 from '@/assets/tarot3.jpg';
        import tarot4 from '@/assets/tarot4.jpg';
        import tarot5 from '@/assets/tarot5.jpg';
        import tarot6 from '@/assets/tarot6.jpg';
        import tarot7 from '@/assets/tarot7.jpg';
        import tarot8 from '@/assets/tarot8.jpg';
        import cardBack from '@/assets/card-back.jpg';
        
export default {
  data() {
    return {
      errorCount: 0,
      timer: 0, // Variable pour le temps écoulé
      timerStarted: false, // Vérifie si le timer a démarré
      timerInterval: null, // Intervalle pour le timer
      selectedDifficulty: 'easy', // Par défaut, le niveau de difficulté est "Facile"
      cards: [], // Tableau pour les cartes du jeu
      flippedCards: [], // Cartes retournées
      matchedPairs: [], // Paires correspondantes
      images: [tarot1, tarot2, tarot3, tarot4, tarot5, tarot6, tarot7, tarot8], // Utilise import pour les images
    };
  },
  mounted() {
    this.initializeGame();
  },
  methods: {
    initializeGame() {
      let numberOfPairs;
      
      // Détermine le nombre de paires en fonction de la difficulté sélectionnée
      if (this.selectedDifficulty === 'easy') {
        numberOfPairs = 4; // Facile : 4 paires
      } else if (this.selectedDifficulty === 'medium') {
        numberOfPairs = 6; // Moyen : 6 paires
      } else if (this.selectedDifficulty === 'hard') {
        numberOfPairs = 8; // Difficile : 8 paires
      }

      // Sélectionne les premières images en fonction du nombre de paires
      const selectedImages = this.images.slice(0, numberOfPairs);

      // Créer des cartes avec les images (chaque image apparaît deux fois)
      this.cards = [...selectedImages, ...selectedImages].map(image => ({
        image,
        flipped: false,
      }));

      // Mélange les cartes
      this.shuffleCards();

      // Réinitialise les cartes retournées, les paires trouvées, le compteur d'erreurs et le timer
      this.flippedCards = [];
      this.matchedPairs = [];
      this.errorCount = 0; 
      this.timer = 0;
      this.timerStarted = false; // Le timer n'a pas encore démarré
      clearInterval(this.timerInterval); // Stoppe le timer précédent s'il existe
    },

    // Méthode pour mélanger les cartes
    shuffleCards() {
      for (let i = this.cards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
      }
    },

    // Méthode pour retourner les cartes
    flipCard(index) {
      const card = this.cards[index];

    // Démarrer le timer si c'est la première carte retournée
    if (!this.timerStarted) {
      this.startTimer();
      }

      // Ignorer si la carte est déjà retournée ou si deux cartes sont déjà retournées
      if (card.flipped || this.flippedCards.length === 2) return;

      card.flipped = true;
      this.flippedCards.push(index);

      // Vérifier si deux cartes sont retournées
      if (this.flippedCards.length === 2) {
        setTimeout(this.checkMatch, 1000); // Vérifier la correspondance après un délai
      }
    },

    // Vérifier si les deux cartes retournées correspondent
    checkMatch() {
      const [firstIndex, secondIndex] = this.flippedCards;
      const firstCard = this.cards[firstIndex];
      const secondCard = this.cards[secondIndex];

      if (firstCard.image === secondCard.image) {
        this.matchedPairs.push(firstCard.image); // Ajoute la paire à la liste des correspondances
        // Vérifie si toutes les paires ont été trouvées
        if (this.matchedPairs.length === this.cards.length / 2) {
          this.stopTimer(); // Arrête le timer à la fin du jeu
        }
      } else {
        // compteur d'erreurs si les cartes ne correspondent pas
        this.errorCount++;
        firstCard.flipped = false;
        secondCard.flipped = false;
      }

      this.flippedCards = []; // Réinitialiser les cartes retournées
    },

    // Méthode pour démarrer le timer une seule fois
    startTimer() {
      this.timerStarted = true; // Le timer a démarré
      this.timerInterval = setInterval(() => {
        this.timer++; // Incrémenter le timer chaque seconde
      }, 1000);
    },

    // Méthode pour arrêter le timer à la fin du jeu (si nécessaire)
    stopTimer() {
      clearInterval(this.timerInterval); // Arrêter le timer
    },
  },
  beforeDestroy() {
    clearInterval(this.timerInterval); // Nettoyer l'intervalle du timer à la destruction du composant
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
  height: 280px; /* Ajuster la taille pour les cartes de tarot */
}
.card:hover {
  transform: scale(1.05);
  background-color: #374151;
}
</style>