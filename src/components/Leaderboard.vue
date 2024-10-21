<template>
  <div class="bg-gradient-to-r from-gray-800 via-gray-900 to-black shadow-lg rounded-lg p-4 text-white">
    <h2 class="text-xl font-bold mb-2 text-yellow-400 uppercase tracking-widest">Classement</h2>
    <table class="min-w-full table-auto border-separate border-spacing-1 text-sm">
      <thead>
        <tr class="bg-gray-700">
          <th class="py-1 px-2 border-b border-yellow-400 text-left text-yellow-400">N°</th>
          <th class="py-1 px-2 border-b border-yellow-400 text-left text-yellow-400">UserId</th> <!-- Changer Pseudo à UserId -->
          <th class="py-1 px-2 border-b border-yellow-400 text-left text-yellow-400">Score</th>
          <th class="py-1 px-2 border-b border-yellow-400 text-left text-yellow-400">Temps</th>
          <th class="py-1 px-2 border-b border-yellow-400 text-left text-yellow-400">Erreurs</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(player, index) in topPlayers" :key="player.id" class="hover:bg-gray-700 bg-gray-800 transition-colors duration-200">
          <td class="py-1 px-2">{{ index + 1 }}</td>
          <td class="py-1 px-2">{{ player.userId }}</td> <!-- Changer Pseudo à UserId -->
          <td class="py-1 px-2">{{ player.bestGame?.score ?? 'N/A' }}</td>
          <td class="py-1 px-2">{{ player.bestGame?.time ?? 'N/A' }}</td>
          <td class="py-1 px-2">{{ player.bestGame?.errors ?? 'N/A' }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { onMounted } from 'vue';
import { useLeaderboardStore } from '../stores/useLeaderboardStore';

export default {
  name: 'Leaderboard',
  setup() {
    const leaderboardStore = useLeaderboardStore();

    // Récupére les joueurs lors du montage du composant
    onMounted(() => {
      leaderboardStore.fetchTopPlayers();
    });

    return {
      topPlayers: leaderboardStore.topPlayers
    };
  }
};
</script>

<style scoped>
body {
  font-family: 'Cinzel', serif;
}

h2 {
  letter-spacing: 0.1em;
}

table th, table td {
  border: 1px solid #b8860b;
}

table tbody tr {
  transition: all 0.2s ease;
}

.table-auto {
  font-size: 0.875rem; 
}

.table-auto th, .table-auto td {
  padding: 0.25rem 0.5rem; 
}

.table-auto th {
  font-weight: bold;
}
</style>





