import { defineStore } from 'pinia';
import { db } from '@/fireBase'; 
import { doc, setDoc } from 'firebase/firestore';

export const useGameStore = defineStore('game', {
  state: () => ({
    score: 0,
    errorCount: 0,
    timer: 0,
    userId: null, // Assure-toi de définir l'ID de l'utilisateur
  }),

  actions: {
    setGameStats(score, errorCount, timer) {
      this.score = score;
      this.errorCount = errorCount;
      this.timer = timer;
    },

    async saveGameResults() {
      if (!this.userId) return; // Ne rien faire si userId est nul

      try {
        const gameResult = {
          score: this.score,
          errorCount: this.errorCount,
          timer: this.timer,
          createdAt: new Date().toISOString(),
        };

        // Envoie les résultats à Firestore dans la collection `gameResults`
        const docRef = doc(db, 'users', this.userId, 'gameResults', `result_${Date.now()}`);
        await setDoc(docRef, gameResult);
        console.log('Game results saved successfully!');
      } catch (error) {
        console.error('Error saving game results: ', error);
      }
    },

    setUserId(userId) {
      this.userId = userId;
    },
  },
});
