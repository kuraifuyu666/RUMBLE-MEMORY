<template>
  <div class="bg-gradient-to-r from-gray-800 via-gray-900 to-black shadow-lg rounded-lg p-4 text-white">
    <h2 class="text-xl font-bold mb-2 text-yellow-400 uppercase tracking-widest">Classement par Difficulté</h2>

    <h3 class="text-lg font-bold text-yellow-400 mt-4">
      {{ leaderboardStore.difficulties[leaderboardStore.currentDifficultyIndex]?.charAt(0).toUpperCase() + leaderboardStore.difficulties[leaderboardStore.currentDifficultyIndex]?.slice(1) }}
    </h3>

    <div class="overflow-y-auto max-h-60"> <!--reglage taille pour evité débordement-->
      <table class="min-w-full table-auto border-separate border-spacing-1 text-sm">
        <thead>
          <tr class="bg-gray-700">
            <th class="py-1 px-2 border-b border-yellow-400 text-left text-yellow-400">N°</th>
            <th class="py-1 px-1 border-b border-yellow-400 text-left text-yellow-400">UserId</th>
            <th class="py-1 px-2 border-b border-yellow-400 text-left text-yellow-400">Score</th>
            <th class="py-1 px-2 border-b border-yellow-400 text-left text-yellow-400">Temps</th>
            <th class="py-1 px-2 border-b border-yellow-400 text-left text-yellow-400">Erreurs</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(player, index) in leaderboardStore.currentDifficultyPlayers.slice(0, leaderboardStore.playersPerPage)" :key="player.userId" class="hover:bg-gray-700 bg-gray-800 transition-colors duration-200">
            <td class="py-1 px-2">{{ index + 1 }}</td>
            <td class="py-1 px-1 text-sm truncate" style="max-width: 100px;">{{ player.userId }}</td>
            <td class="py-1 px-2">{{ player.score ?? 'N/A' }}</td>
            <td class="py-1 px-2">{{ player.timer ?? 'N/A' }}</td>
            <td class="py-1 px-2">{{ player.errors ?? 'N/A' }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <!-- Pagination -->
    <div class="flex justify-between mt-2">
      <button 
        @click="leaderboardStore.changeDifficulty(leaderboardStore.currentDifficultyIndex - 1)" 
        :disabled="leaderboardStore.currentDifficultyIndex === 0" 
        class="bg-yellow-400 text-black px-4 py-2 rounded disabled:opacity-50">
        Précédent
      </button>
      <span class="self-center text-yellow-400">Difficulté {{ leaderboardStore.currentDifficultyIndex + 1 }} sur {{ leaderboardStore.totalDifficulties }}</span>
      <button 
        @click="leaderboardStore.changeDifficulty(leaderboardStore.currentDifficultyIndex + 1)" 
        :disabled="leaderboardStore.currentDifficultyIndex === leaderboardStore.totalDifficulties - 1" 
        class="bg-yellow-400 text-black px-4 py-2 rounded disabled:opacity-50">
        Suivant
      </button>
    </div>
  </div>
</template>

<script>
import { useLeaderboardStore } from '@/stores/useLeaderboardStore';

export default {
  name: 'Leaderboard',
  setup() {
    const leaderboardStore = useLeaderboardStore();
    leaderboardStore.fetchTopPlayers(); // Récupération des joueurs lors de la création du composant

    return { leaderboardStore };
  },
};
</script>

<style scoped lang="scss">
$font-family_1: 'Cinzel', serif;
$background-color_1: #b8860b;

/* Style pour le conteneur de défilement */
body {
	font-family: $font-family_1;
}
h2 {
	letter-spacing: 0.1em;
}
table {
	th {
		border: 1px solid #b8860b;
	}
	td {
		border: 1px solid #b8860b;
	}
	tbody {
		tr {
			transition: all 0.2s ease;
		}
	}
}
.table-auto {
	font-size: 0.875rem;
	th {
		padding: 0.25rem 0.5rem;
		font-weight: bold;
	}
	td {
		padding: 0.25rem 0.5rem;
	}
}
.overflow-y-auto {
	overflow-y: auto;
	scrollbar-width: thin;
	&::-webkit-scrollbar {
		width: 8px;
	}
	&::-webkit-scrollbar-thumb {
		background-color: $background-color_1;
		border-radius: 10px;
	}
	&::-webkit-scrollbar-track {
		background: #333;
	}
}

</style>












