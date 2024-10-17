<template>
  <div class="bg-white shadow-md rounded p-6">
    <h2 class="text-xl font-bold mb-4">Classement</h2>
    <table class="min-w-full table-auto">
      <thead>
        <tr class="bg-gray-200">
          <th class="py-2 px-4">N°</th>
          <th class="py-2 px-4">Name</th>
          <th class="py-2 px-4">Score</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="player in topPlayers" :key="player.rank" class="hover:bg-gray-100">
          <td class="py-2 px-4">{{ player.rank }}</td>
          <td class="py-2 px-4">{{ player.name }}</td>
          <td class="py-2 px-4">{{ player.score }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: 'Leaderboard',
  data() {
    return {
      topPlayers: [
        { rank: 1, name: 'Player1', score: 2000 },
        // ... autres joueurs
      ],
    };
  },
};
</script>