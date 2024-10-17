<template>
  <div class="music-player fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white p-4 rounded-lg shadow-lg">
    

    <!-- Informations sur la piste actuelle -->
    <div class="current-track mb-4">
      <p class="font-semibold">{{ currentTrack.title }}</p>
      <p class="text-sm text-gray-400">{{ currentTrack.artist }}</p>
    </div>

    <!-- Contrôles de musique -->
    <div class="controls flex items-center space-x-4">
      <button @click="togglePlayPause" class="bg-gray-700 p-2 rounded-lg">
        <span v-if="isPlaying">⏸️ Pause</span>
        <span v-else>▶️ Play</span>
      </button>
      <input type="range" min="0" max="100" v-model="volume" @input="adjustVolume" class="volume-slider bg-gray-700 w-1/3">
      <span class="text-sm">Volume: {{ volume }}%</span>
    </div>

    <!-- Sélection de piste -->
    <div class="track-selector mt-4">
      <label for="track-select" class="block mb-2">Sélectionnez une piste :</label>
      <select id="track-select" v-model="selectedTrack" @change="changeTrack" class="bg-gray-700 p-2 rounded-lg w-full">
        <option v-for="(track, index) in tracks" :key="index" :value="index">
          {{ track.title }} - {{ track.artist }}
        </option>
      </select>
    </div>

    <audio ref="audio" :src="currentTrack.url" @timeupdate="updateTime" @ended="nextTrack"></audio>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isPlaying: false, // Indique si la musique est en cours de lecture
      volume: 50, // Volume de la musique
      selectedTrack: 0, // Piste actuellement sélectionnée
      currentTime: 0, // Temps actuel de la piste
      tracks: [
        {
          title: "A Look At You",
          artist: "Mister Boo",
          url: "src/assets/music/A look at you.mp3", // Chemin vers la piste 1
        },
        {
          title: "Just Me",
          artist: "Mister Boo",
          url: "src/assets/music/Just Me.mp3", // Chemin vers la piste 2
        },
        {
          title: "Spoon",
          artist: "Mister Boo",
          url: "src/assets/music/Spoon.mp3", // Chemin vers la piste 3
        },
      ],
    };
  },
  computed: {
    currentTrack() {
      return this.tracks[this.selectedTrack]; // Retourne la piste actuelle
    },
  },
  methods: {
    togglePlayPause() {
      const audio = this.$refs.audio;
      if (this.isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
      this.isPlaying = !this.isPlaying;
    },
    adjustVolume() {
      const audio = this.$refs.audio;
      audio.volume = this.volume / 100;
    },
    changeTrack() {
      const audio = this.$refs.audio;
      audio.src = this.currentTrack.url;
      this.isPlaying = false;
      audio.play();
      this.isPlaying = true;
    },
    updateTime() {
      const audio = this.$refs.audio;
      this.currentTime = audio.currentTime;
    },
    nextTrack() {
      this.selectedTrack = (this.selectedTrack + 1) % this.tracks.length;
      this.changeTrack();
    },
  },
};
</script>

<style scoped>
.music-player {
  width: 100%;
  max-width: 400px;
}
.volume-slider {
  appearance: none;
  width: 100px;
}
</style>
