import { defineStore } from 'pinia';

export const useLeaderboardStore = defineStore('leaderboard', {
  state: () => ({
    topPlayers: [],
  }),
  actions: {
    setTopPlayers(players) {
      this.topPlayers = players;
    },
    fetchTopPlayers() {
      // Remplace ceci par ta logique de récupération de données
      const players = [
        { userId: 'User1', bestGame: { score: 100, time: '10s', errors: 2 } },
        { userId: 'User2', bestGame: { score: 90, time: '12s', errors: 3 } },
        { userId: 'User3', bestGame: { score: 80, time: '15s', errors: 1 } },
      ];
      this.setTopPlayers(players);
    },
  },
});
