<template>
  <div class="game-container p-6">
    <h2 class="text-2xl font-bold mb-4">Jeu de Rumble Memory</h2>

    <!-- Sélection de la difficulté -->
    <div class="mb-4">
      <label for="difficulty" class="block text-lg font-medium">Sélectionnez la difficulté :</label>
      <select id="difficulty" v-model="selectedDifficulty" @change="initializeGame" class="border p-2 rounded">
        <option value="easy">Facile (4 paires)</option>
        <option value="medium">Moyen (6 paires)</option>
        <option value="hard">Difficile (8 paires)</option>
      </select>
    </div>
    
    <!-- Grille de cartes -->
    <div v-if="cards.length" class="grid grid-cols-4 gap-4">
      <div
        v-for="(card, index) in cards"
        :key="index"
        class="card bg-white rounded-lg shadow-md p-4 flex items-center justify-center cursor-pointer"
        @click="flipCard(index)"
      >
        <!-- Afficher l'image si la carte est retournée -->
        <img v-if="card.flipped" :src="card.image" alt="card image" class="w-full h-full object-cover">
        <span v-else>?</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selectedDifficulty: 'easy', // Par défaut, le niveau de difficulté est "Facile"
      cards: [], // Tableau pour les cartes du jeu
      flippedCards: [], // Cartes retournées
      matchedPairs: [], // Paires correspondantes
      images: [
        // Chemins des images intégrées
        require('@/assets/tarot1.jpg'),
        require('@/assets/tarot2.jpg'),
        require('@/assets/tarot3.jpg'),
        require('@/assets/tarot4.jpg'),
        require('@/assets/tarot5.jpg'),
        require('@/assets/tarot6.jpg'),
        require('@/assets/tarot7.jpg'),
        require('@/assets/tarot8.jpg'),
      ],
    };
  },
  mounted() {
    this.initializeGame();
  },
  methods: {
    initializeGame() {
      let numberOfPairs;
      
      // Déterminer le nombre de paires en fonction de la difficulté sélectionnée
      if (this.selectedDifficulty === 'easy') {
        numberOfPairs = 4; // Facile : 4 paires
      } else if (this.selectedDifficulty === 'medium') {
        numberOfPairs = 6; // Moyen : 6 paires
      } else if (this.selectedDifficulty === 'hard') {
        numberOfPairs = 8; // Difficile : 8 paires
      }

      // Sélectionner les premières images en fonction du nombre de paires
      const selectedImages = this.images.slice(0, numberOfPairs);

      // Créer des cartes avec les images (chaque image apparaît deux fois)
      this.cards = [...selectedImages, ...selectedImages].map(image => ({
        image,
        flipped: false,
      }));

      // Mélanger les cartes
      this.shuffleCards();

      // Réinitialiser les cartes retournées et les paires trouvées
      this.flippedCards = [];
      this.matchedPairs = [];
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
        this.matchedPairs.push(firstCard.image); // Ajouter la paire à la liste des correspondances
      } else {
        firstCard.flipped = false;
        secondCard.flipped = false;
      }

      this.flippedCards = []; // Réinitialiser les cartes retournées
    },
  },
};
</script>

<style scoped>
.game-container {
  padding: 20px;
  background-color: #f9f9f9;
}
.card {
  transition: transform 0.2s;
  width: 100px;
  height: 150px; /* Ajuster la taille pour les cartes de tarot */
}
.card:hover {
  transform: scale(1.05);
}
</style>