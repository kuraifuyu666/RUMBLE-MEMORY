<template>
  <div class="home-container text-center p-6">
    <h1 class="text-4xl font-bold mb-4">Bienvenue dans Rumble Memory!</h1>
    <p class="text-xl mb-6">
      Testez votre mémoire et amusez-vous à associer les cartes. 
      Cliquez sur une carte pour la retourner et essayez de trouver les paires!
    </p>

    <!-- Conteneur pour le pseudo et le chat -->
    <div class="input-chat-container fixed bottom-4 left-4 w-full max-w-md">
      <!-- Section de saisie du pseudo -->
      <div class="pseudo-container border border-gray-600 bg-gray-800 rounded-lg p-4 mb-2 shadow-lg">
        <input
          v-model="pseudo"
          type="text"
          placeholder="Entrez votre pseudo..."
          class="border border-gray-500 bg-gray-700 text-white rounded-lg p-2 w-full mb-2"
        />
      </div>

      <!-- Section de Chat -->
      <div class="chat-container border border-gray-600 bg-gray-800 rounded-lg p-4 shadow-lg">
        <h2 class="text-2xl font-bold mb-2 text-white">Chat</h2>
        <div class="chat-box border border-gray-300 rounded-lg shadow-md p-4 max-h-60 overflow-y-auto" ref="chatBox">
          <div v-for="(msg, index) in messages" :key="index" class="chat-message mb-2 text-gray-300 text-left">
            <strong>{{ msg.pseudo }}:</strong> {{ msg.content }}
          </div>
        </div>
        <input
          v-model="newMessage"
          @keyup.enter="sendMessage"
          type="text"
          placeholder="Écrivez un message..."
          class="border border-gray-500 bg-gray-700 text-white rounded-lg p-2 w-full"
        />
        <button @click="sendMessage" class="bg-blue-500 text-white px-4 py-2 mt-2 rounded">
          Envoyer
        </button>
      </div>
    </div>

    <!-- Affichage du Leaderboard à droite -->
    <div class="leaderboard-container fixed bottom-4 right-4 border-gray-600 bg-gray-800 rounded-lg p-4 w-full max-w-md shadow-lg">
      <Leaderboard />
    </div>
  </div>
</template>

<script>
import Leaderboard from '@/components/Leaderboard.vue';

export default {
  components: {
    Leaderboard,
  },
  name: 'Home',
  data() {
    return {
      newMessage: '',
      messages: [],
      pseudo: '', // Pseudo vide au départ
    };
  },
  methods: {
    sendMessage() {
      if (this.newMessage.trim() !== '' && this.pseudo.trim() !== '') {
        // Ajoute le message avec le pseudo utilisateur
        this.messages.push({ pseudo: this.pseudo, content: this.newMessage.trim() });
        this.newMessage = ''; // Réinitialise le champ de saisie
        this.$nextTick(() => {
          this.scrollToBottom(); // Faire défiler vers le bas après le rendu
        });
      }
    },
    scrollToBottom() {
      const chatBox = this.$refs.chatBox;
      chatBox.scrollTop = chatBox.scrollHeight; // Faire défiler vers le bas
    },
  },
};
</script>

<style scoped>
.home-container {
  background-color: #f9f9f9;
}
.input-chat-container {
  display: flex;
  flex-direction: column; /* Alignement vertical des conteneurs pseudo et chat */
}
.pseudo-container {
  z-index: 10; 
}
.chat-container {
  transition: border-color 0.2s;
}
.chat-container:hover {
  border-color: #a1a1a1; /* Couleur de bordure au survol */
}
.chat-box {
  max-height: 100px; /* Limite la hauteur de la boîte de chat */
}
.chat-message {
  padding: 2px 0;
  text-align: left; /* Aligne les messages sur la gauche */
}
</style>



