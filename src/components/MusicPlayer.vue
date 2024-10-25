<template>
  <div v-if="showControls">
    <div class="current-track mb-4" v-if="currentTrack">
      <p class="font-semibold">{{ currentTrack.title }}</p>
      <p class="text-sm text-gray-400">{{ currentTrack.artist }}</p>
    </div>

    <div class="controls flex items-center space-x-4">
      <button @click="togglePlayPause" class="bg-gray-700 p-2 rounded-lg">
        <span v-if="isPlaying">⏸️ Pause</span>
        <span v-else>▶️ Play</span>
      </button>
      <input type="range" min="0" max="100" v-model="volume" @input="adjustVolume" class="volume-slider bg-gray-700 w-1/3">
      <span class="text-sm">Volume: {{ volume }}%</span>
    </div>

    <div class="track-selector mt-4">
      <label for="track-select" class="block mb-2">Sélectionnez une piste :</label>
      <select id="track-select" v-model="selectedTrack" @change="changeTrack" class="bg-gray-700 p-2 rounded-lg w-full">
        <option v-for="(track, index) in tracks" :key="index" :value="index">
          {{ track.title }} - {{ track.artist }}
        </option>
      </select>
    </div>
  </div>

  <audio ref="audio" :src="currentTrack.url" @timeupdate="updateTime"></audio>
</template>

<script>
import { musicService } from "@/musicService"; 
import { ref, computed } from 'vue';

export default {
  props: {
    showControls: {
      type: Boolean,
      default: true,
    },
  },
  setup() {
    const volume = ref(musicService.volume * 100);
    const selectedTrack = ref(musicService.currentTrackIndex);
    const isPlaying = ref(musicService.isPlaying);

    const tracks = musicService.tracks;
    const currentTrack = computed(() => tracks[selectedTrack.value] || { title: '', artist: '', url: '' });

    function togglePlayPause() {
      musicService.togglePlayPause();
      isPlaying.value = musicService.isPlaying; // Mettre à jour l'état du bouton
    }

    function adjustVolume() {
      musicService.setVolume(volume.value);
    }

    function changeTrack() {
      musicService.changeTrack(selectedTrack.value);
      isPlaying.value = musicService.isPlaying;
    }

    return {
      isPlaying,
      volume,
      selectedTrack,
      tracks,
      currentTrack,
      togglePlayPause,
      adjustVolume,
      changeTrack,
    };
  }
};
</script>

