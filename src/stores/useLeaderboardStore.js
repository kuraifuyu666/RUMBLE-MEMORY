// src/stores/useLeaderboardStore.js
import { defineStore } from 'pinia';
import { db } from '@/fireBase'; // Assure-toi d'importer ton instance Firebase
import { ref } from 'vue';

export const useLeaderboardStore = defineStore('leaderboard', () => {
  const topPlayers = ref([]);

  // Fonction pour récupérer les données depuis Firestore en temps réel
  const fetchTopPlayers = () => {
    try {
      // Utilise onSnapshot pour écouter les modifications en temps réel
      db.collection('users').onSnapshot(snapshot => {
        topPlayers.value = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            userId: data.userId,
            bestGame: data.gameResults ? {
              score: data.gameResults.score,
              time: data.gameResults.time,
              errors: data.gameResults.errors
            } : null
          };
        });
      });
    } catch (error) {
      console.error("Erreur lors de la récupération des joueurs:", error);
    }
  };

  return {
    topPlayers,
    fetchTopPlayers
  };
});

