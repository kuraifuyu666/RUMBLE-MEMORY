<template>
  <div v-if="showControls">
    <!-- Informations sur la piste actuelle -->
    <div class="current-track mb-4" v-if="currentTrack">
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
      <span v-if="index === (selectedTrack + 1) % tracks.length"></span>
    </option>
      </select>
    </div>
  </div>

  <!-- Audio (toujours monté, même si les contrôles sont cachés) -->
  <audio ref="audio" :src="currentTrack.url" @timeupdate="updateTime" @loadedmetadata="setAudioVolume"></audio>
</template>

<script>
import { musicService } from "@/musicService"; // Assurez-vous que le chemin est correct

export default {
  props: {
    showControls: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      isPlaying: musicService.isPlaying,
      volume: musicService.volume * 100,
      selectedTrack: musicService.currentTrackIndex,
      tracks: musicService.tracks,
    };
  },
  computed: {
    currentTrack() {
      return this.tracks[this.selectedTrack] || { title: '', artist: '', url: '' }; // Valeur par défaut
    },
  },
  watch: {
    selectedTrack(newIndex) {
      musicService.changeTrack(newIndex);
      this.isPlaying = musicService.isPlaying; // Met à jour l'état de lecture
    },
  },
  methods: {
    togglePlayPause() {
      musicService.togglePlayPause();
      this.isPlaying = musicService.isPlaying;
    },
    adjustVolume() {
      musicService.setVolume(this.volume);
    },
  },
  mounted() {
    if (musicService.isPlaying) {
      musicService.play();
    }
  },
};
</script>