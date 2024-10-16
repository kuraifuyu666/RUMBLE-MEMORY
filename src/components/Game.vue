<template>
  <div class="game-container">
    <h2 class="text-center text-2xl font-bold mb-4">Jeu de Rumble Memory</h2>
    <div class="grid grid-cols-4 gap-4">
      <div
        v-for="(card, index) in cards"
        :key="index"
        class="card bg-white rounded-lg shadow-md p-4 flex items-center justify-center cursor-pointer"
        @click="flipCard(index)"
      >
        <span v-if="card.flipped">{{ card.value }}</span>
        <span v-else>?</span>
      </div>
    </div>
    <div v-if="message" class="text-center text-xl mt-4 text-red-500">
      {{ message }}
    </div>
    <button @click="resetGame" class="mt-6 bg-green-500 text-white px-4 py-2 rounded">
      Réinitialiser le jeu
    </button>
  </div>
</template>

<script>
export default {
  name: 'Game',
  data() {
    return {
      cards: this.generateCards(),
      flippedCards: [],
      matchedPairs: [],
      message: '',
    };
  },
  methods: {
    generateCards() {
      const values = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
      const cards = [...values, ...values].map(value => ({ value, flipped: false }));
      return this.shuffle(cards);
    },
    shuffle(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    },
    flipCard(index) {
      const card = this.cards[index];

      // Ignore si la carte est déjà retournée ou si deux cartes sont déjà retournées
      if (card.flipped || this.flippedCards.length === 2) return;

      card.flipped = true;
      this.flippedCards.push(index);

      // Vérifier si deux cartes sont retournées
      if (this.flippedCards.length === 2) {
        setTimeout(this.checkMatch, 1000); // Vérifier la correspondance après un délai
      }
    },
    checkMatch() {
      const [firstIndex, secondIndex] = this.flippedCards;
      const firstCard = this.cards[firstIndex];
      const secondCard = this.cards[secondIndex];

      if (firstCard.value === secondCard.value) {
        this.matchedPairs.push(firstCard.value); // Ajouter la paire à la liste des paires correspondantes
        this.message = 'Bravo ! Vous avez trouvé une paire !';
      } else {
        firstCard.flipped = false;
        secondCard.flipped = false;
        this.message = 'Pas de correspondance, essayez encore !';
      }

      this.flippedCards = []; // Réinitialiser les cartes retournées
      // Vérifier si toutes les paires ont été trouvées
      if (this.matchedPairs.length === this.cards.length / 2) {
        this.message = 'Félicitations ! Vous avez gagné !';
      }
    },
    resetGame() {
      this.cards = this.generateCards();
      this.flippedCards = [];
      this.matchedPairs = [];
      this.message = '';
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
}
.card:hover {
  transform: scale(1.05);
}
</style>