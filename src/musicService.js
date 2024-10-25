class MusicService {
  constructor() {
    this.audio = new Audio();
    this.isPlaying = false;
    this.volume = 0.5;
    this.currentTrackIndex = 0;
    this.tracks = [
      { title: "A Look At You", artist: "Mister Boo", url: "/music/A look at you.mp3" },
      { title: "Just Me", artist: "Mister Boo", url: "/music/Just Me.mp3" },
      { title: "Spoon", artist: "Mister Boo", url: "/music/Spoon.mp3" },
    ];
  }

  async play() {
    if (!this.audio.src) {
      this.audio.src = this.tracks[this.currentTrackIndex].url;
    }
    this.audio.volume = this.volume;
    try {
      await this.audio.play();
      this.isPlaying = true;
    } catch (error) {
      console.error("Erreur lors de la lecture de l'audio:", error);
    }
    this.audio.onended = () => {
      this.nextTrack();
    };
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
