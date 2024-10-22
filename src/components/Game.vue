<template>
  <div class="game-container p-6 flex flex-col items-center bg-gray-900 text-white min-h-screen">
    <h2 class="text-3xl font-bold mb-4 text-gray-100">Jeu de Rumble Memory</h2>

    <button 
      v-if="gameStore.gameOver" 
      @click="restartGame" 
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
          v-model="gameStore.selectedDifficulty"
          @change="gameStore.initializeGame"
          class="bg-gray-700 text-gray-100 border border-gray-600 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 hover:bg-gray-600 transition-all"
        >
          <option value="easy" class="bg-gray-800">Facile (4 paires)</option>
          <option value="medium" class="bg-gray-800">Moyen (6 paires)</option>
          <option value="hard" class="bg-gray-800">Difficile (8 paires)</option>
        </select>
      </div>

      <div class="text-xl bg-gray-800 text-gray-100 p-3 rounded-lg shadow-lg">
        <span>Score : {{ gameStore.score }}</span>
      </div>
      <div class="text-xl bg-gray-800 text-gray-100 p-3 rounded-lg shadow-lg">
        <span>Erreurs : {{ gameStore.errorCount }}</span>
      </div>
      <div class="text-xl bg-gray-800 text-gray-100 p-3 rounded-lg shadow-lg">
        <span>Temps : {{ gameStore.timer }}s</span>
      </div>
    </div>

    <div class="cards-container grid grid-cols-4 gap-4 justify-center p-4 bg-gray-800 rounded-lg shadow-lg">
      <div
        v-for="(card, index) in gameStore.cards"
        :key="index"
        class="card bg-gray-700 rounded-lg shadow-xl p-4 flex items-center justify-center cursor-pointer hover:bg-gray-600"
        @click="gameStore.flipCard(index)"
      >
        <img v-if="!card.flipped" src="@/assets/card-back.jpg" alt="Card Back" class="w-full h-full object-cover rounded-lg">
        <img v-else :src="card.image" alt="card image" class="w-full h-full object-cover rounded-lg">
      </div>
    </div>
  </div>
</template>

<script>
import { useGameStore } from '@/stores/useGameStore';
import { onMounted, onBeforeUnmount } from 'vue';

export default {
  setup() {
    const gameStore = useGameStore();

    onMounted(() => {
      console.log('Initialisation du jeu...');
      gameStore.initializeGame(); // Initialise le jeu à chaque fois que le composant est monté
    });

    onBeforeUnmount(() => {
      gameStore.clearTimer();
    });

    const restartGame = () => {
      if (gameStore.gameOver) {
        console.log('Partie terminée.');
        // Logique pour gérer les résultats localement ou afficher un message
        const results = {
          score: gameStore.score,
          time: gameStore.timer,
          errors: gameStore.errorCount,
        };
        console.log('Résultats de la partie :', results);
        
        // Réinitialise le jeu
        gameStore.initializeGame(); 
      }
    };

    return { gameStore, restartGame };
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



