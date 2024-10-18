class MusicService {
  constructor() {
    this.audio = new Audio();
    this.isPlaying = false;
    this.volume = 0.5; // Valeur par défaut
    this.currentTrackIndex = 0;
    this.tracks = [
      { title: "A Look At You", artist: "Mister Boo", url: "src/assets/music/A look at you.mp3" },
      { title: "Just Me", artist: "Mister Boo", url: "src/assets/music/Just Me.mp3" },
      { title: "Spoon", artist: "Mister Boo", url: "src/assets/music/Spoon.mp3" },
    ];
  }

  play() {
    if (!this.audio.src) {
      this.audio.src = this.tracks[this.currentTrackIndex].url;
    }
    this.audio.volume = this.volume;
    this.audio.play();
    this.isPlaying = true;
  }

  pause() {
    this.audio.pause();
    this.isPlaying = false;
  }

  togglePlayPause() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  changeTrack(index) {
    this.currentTrackIndex = index;
    this.audio.src = this.tracks[this.currentTrackIndex].url;
    this.play();
  }

  setVolume(value) {
    this.volume = value / 100;
    this.audio.volume = this.volume;
  }

  nextTrack() {
    this.currentTrackIndex = (this.currentTrackIndex + 1) % this.tracks.length;
    this.changeTrack(this.currentTrackIndex);
  }
}

export const musicService = new MusicService();