import { defineStore } from 'pinia';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/fireBase'; // Importer la configuration Firebase
import { getAuth } from 'firebase/auth';
import tarot1 from '@/assets/tarot1.jpg';
import tarot2 from '@/assets/tarot2.jpg';
import tarot3 from '@/assets/tarot3.jpg';
import tarot4 from '@/assets/tarot4.jpg';
import tarot5 from '@/assets/tarot5.jpg';
import tarot6 from '@/assets/tarot6.jpg';
import tarot7 from '@/assets/tarot7.jpg';
import tarot8 from '@/assets/tarot8.jpg';

export const useGameStore = defineStore('game', {
  state: () => ({
    errorCount: 0,
    timer: 0,
    timerStarted: false,
    timerInterval: null,
    selectedDifficulty: 'easy',
    cards: [],
    flippedCards: [],
    matchedPairs: [],
    score: 0,
    images: [tarot1, tarot2, tarot3, tarot4, tarot5, tarot6, tarot7, tarot8],
    gameOver: false,
  }),

  actions: {
    initializeGame() {
      let numberOfPairs;
      if (this.selectedDifficulty === 'easy') numberOfPairs = 4;
      else if (this.selectedDifficulty === 'medium') numberOfPairs = 6;
      else if (this.selectedDifficulty === 'hard') numberOfPairs = 8;

      const selectedImages = this.images.slice(0, numberOfPairs);
      this.cards = [...selectedImages, ...selectedImages].map(image => ({ image, flipped: false }));
      this.shuffleCards();
      this.flippedCards = [];
      this.matchedPairs = [];
      this.errorCount = 0;
      this.score = 0;
      this.timer = 0;
      this.timerStarted = false;
      this.gameOver = false;
    },

    startTimer() {
      if (!this.timerStarted) {
        this.timerStarted = true;
        this.timerInterval = setInterval(() => {
          this.timer += 1;
        }, 1000);
      }
    },

    shuffleCards() {
      for (let i = this.cards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
      }
    },

    flipCard(index) {
      if (this.cards[index].flipped || this.gameOver) return;

      this.startTimer();
      this.cards[index].flipped = true;
      this.flippedCards.push(index);

      if (this.flippedCards.length === 2) {
        this.checkMatch();
      }
    },

    checkMatch() {
      const [firstIndex, secondIndex] = this.flippedCards;
      if (this.cards[firstIndex].image === this.cards[secondIndex].image) {
        this.matchedPairs.push(this.cards[firstIndex].image);
        this.score += 100;
        this.flippedCards = [];
        this.checkGameOver();
      } else {
        setTimeout(() => {
          this.cards[firstIndex].flipped = false;
          this.cards[secondIndex].flipped = false;
          this.errorCount += 1;
          this.flippedCards = [];
        }, 1000);
      }
    },

    async checkGameOver() {
      if (this.matchedPairs.length === this.cards.length / 2) {
        console.log('Jeu terminé !');
        this.gameOver = true;
        clearInterval(this.timerInterval);

        // Enregistrer les résultats dans Firestore
        await this.saveGameResult();
      }
    },

    clearTimer() {
      clearInterval(this.timerInterval);
    },

    async saveGameResult() {
      try {
        const auth = getAuth();
        const user = auth.currentUser;
        if (!user) throw new Error("User not authenticated");

        // Créer un ID unique pour chaque résultat de jeu
        const resultId = new Date().getTime().toString(); // Utilisation d'un timestamp comme ID

        // Chemin du document complet : users/{UID}/gameResult/{resultId}
        const gameResultRef = doc(db, 'users', user.uid, 'gameResult', resultId);

        await setDoc(gameResultRef, {
          score: this.score,
          errorCount: this.errorCount,
          timer: this.timer,
          difficulty: this.selectedDifficulty,
          date: new Date().toISOString()
        });

        console.log("Résultat de jeu enregistré avec succès !");
      } catch (error) {
        console.error("Erreur lors de l'enregistrement des résultats de jeu:", error);
      }
    }
  },
});



