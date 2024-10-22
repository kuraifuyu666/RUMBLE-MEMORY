import { defineStore } from 'pinia';
import { db } from '@/fireBase'; // Assure-toi d'importer ta configuration Firebase
import { collection, getDocs } from 'firebase/firestore';

export const useLeaderboardStore = defineStore('leaderboard', {
  state: () => ({
    topPlayers: [],
    currentDifficultyIndex: 0, // Index de la difficulté actuelle
    difficulties: [], // Liste des difficultés
    playersPerPage: 5, // Nombre de joueurs à afficher par page
  }),
  getters: {
    playersByDifficulty: (state) => {
      const playersGroupedByDifficulty = {};
      state.topPlayers.forEach(player => {
        const { difficult } = player;
        if (!playersGroupedByDifficulty[difficult]) {
          playersGroupedByDifficulty[difficult] = [];
        }
        playersGroupedByDifficulty[difficult].push(player);
      });

      state.difficulties = Object.keys(playersGroupedByDifficulty); // Mettre à jour la liste des difficultés
      return playersGroupedByDifficulty;
    },
    // Getter pour obtenir les joueurs de la difficulté actuelle
    currentDifficultyPlayers: (state) => {
      const difficulty = state.difficulties[state.currentDifficultyIndex];
      return state.playersByDifficulty[difficulty] || [];
    },
    totalDifficulties: (state) => {
      return state.difficulties.length; // Nombre total de niveaux de difficulté
    },
  },
  actions: {
    setTopPlayers(players) {
      this.topPlayers = players;
    },
    async fetchTopPlayers() {
      const players = [];
      const userCollection = collection(db, 'users');

      try {
        const userSnapshots = await getDocs(userCollection);
        const userPromises = userSnapshots.docs.map(async (userDoc) => {
          const userId = userDoc.id; // UID
          const gameResultsCollection = collection(db, `users/${userId}/gameResult`);

          const resultSnapshots = await getDocs(gameResultsCollection);
          resultSnapshots.forEach((resultDoc) => {
            const resultData = resultDoc.data();
            players.push({
              userId: userId,
              score: resultData.score,
              timer: resultData.timer,
              errors: resultData.errorCount,
              difficult: resultData.difficulty,
            });
          });
        });

        await Promise.all(userPromises); // Attendre que toutes les promesses soient résolues
        this.setTopPlayers(players);
      } catch (error) {
        console.error("Erreur lors de la récupération des joueurs :", error);
      }
    },
    // Action pour changer de difficulté
    changeDifficulty(index) {
      if (index >= 0 && index < this.totalDifficulties) {
        this.currentDifficultyIndex = index;
      }
    },
  },
});


