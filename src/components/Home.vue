<template>
  <div class="home-container text-center p-6">
    <h1 class="text-4xl font-bold mb-4">Bienvenue dans Rumble Memory!</h1>
    <p class="text-xl mb-6">
      Testez votre mémoire et amusez-vous à associer les cartes. 
      Cliquez sur une carte pour la retourner et essayez de trouver les paires!
    </p>
  </div>
    <!-- Section de Chat à droite -->
    <div class="chat-container fixed bottom-4 left-4 border border-gray-600 bg-gray-800 rounded-lg p-4 w-full max-w-md shadow-lg">
      <h2 class="text-2xl font-bold mb-2 text-white">Chat</h2>
      <div class="chat-box border border-gray-300 rounded-lg shadow-md p-4 max-h-60 overflow-y-auto">
        <div v-for="(msg, index) in messages" :key="index" class="chat-message mb-2 text-gray-300">
          <strong>User:</strong> {{ msg }}
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
</template>

<script>
export default {
  name: 'Home',
  data() {
    return {
      newMessage: '',
      messages: [],
    };
  },
  methods: {
    sendMessage() {
      if (this.newMessage.trim() !== '') {
        this.messages.push(this.newMessage.trim());
        this.newMessage = ''; // Réinitialiser le champ de saisie
      }
    },
  },
};
</script>

<style scoped>
.home-container {
  background-color: #f9f9f9;
}
.chat-container {
  transition: border-color 0.2s;
}
.chat-container:hover {
  border-color: #a1a1a1; /* Couleur de bordure au survol */
}
.chat-box {
  max-height: 100px; /* Limiter la hauteur de la boîte de chat */
}
.chat-message {
  padding: 2px 0;
}
</style>