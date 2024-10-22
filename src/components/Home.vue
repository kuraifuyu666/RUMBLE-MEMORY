<template>
  <div class="home-container text-center p-6">
    <h1 class="text-4xl font-bold mb-4">Bienvenue dans Rumble Memory!</h1>
    <p class="text-xl mb-6">
      Testez votre mémoire et amusez-vous à associer les cartes. 
      Cliquez sur une carte pour la retourner et essayez de trouver les paires!
    </p>

    <div class="input-chat-container fixed bottom-4 left-4 w-full max-w-md">
      <!-- Affichage du champ pseudo seulement si il n'est pas soumis -->
      <div v-if="!isPseudoSubmitted" class="pseudo-container border border-gray-600 bg-gray-800 rounded-lg p-4 mb-2 shadow-lg">
        <input
          v-model="pseudo"
          type="text"
          placeholder="Entrez votre pseudo..."
          class="border border-gray-500 bg-gray-700 text-white rounded-lg p-2 w-full mb-2"
        />
        <button
          @click="submitPseudo"
          :disabled="!isPseudoValid" 
          class="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Valider
        </button>
      </div>

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
      pseudo: '',
      isPseudoSubmitted: false,
    };
  },
  computed: {
    isPseudoValid() {
      return this.pseudo.trim() !== ''; // Validation simple : le pseudo ne doit pas être vide
    },
  },
  methods: {
    submitPseudo() {
      if (this.isPseudoValid) {
        this.isPseudoSubmitted = true; // Marquer le pseudo comme soumis
      }
    },
    sendMessage() {
      if (this.newMessage.trim() !== '' && this.isPseudoSubmitted) {
        this.messages.push({ pseudo: this.pseudo, content: this.newMessage.trim() });
        this.newMessage = '';
        this.$nextTick(() => {
          this.scrollToBottom();
        });
      }
    },
    scrollToBottom() {
      const chatBox = this.$refs.chatBox;
      chatBox.scrollTop = chatBox.scrollHeight;
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
  flex-direction: column;
}
.pseudo-container {
  z-index: 10; 
}
.chat-container {
  transition: border-color 0.2s;
}
.chat-container:hover {
  border-color: #a1a1a1;
}
.chat-box {
  max-height: 100px;
}
.chat-message {
  padding: 2px 0;
  text-align: left;
}
</style>