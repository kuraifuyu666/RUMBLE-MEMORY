<template>
  <div class="home-container text-center p-6">
    <h1 class="text-4xl font-bold mb-4">Bienvenue dans Rumble Memory!</h1>
    <p class="text-xl mb-6">
      Testez votre mémoire et amusez-vous à associer les cartes. 
      Cliquez sur une carte pour la retourner et essayez de trouver les paires!
    </p>
  </div>
    <!-- Section de Chat -->
    <div class="chat-container mt-6">
      <h2 class="text-2xl font-bold mb-2">Chat</h2>
      <div class="chat-box border border-gray-300 rounded-lg shadow-md p-4 max-h-60 overflow-y-auto">
        <div v-for="(msg, index) in messages" :key="index" class="chat-message mb-2">
          <strong>User:</strong> {{ msg }}
        </div>
      </div>
      <input
        v-model="newMessage"
        @keyup.enter="sendMessage"
        type="text"
        placeholder="Écrivez un message..."
        class="mt-2 w-full p-2 border border-gray-300 rounded"
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
  max-width: 600px;
  margin: auto;
}
.chat-box {
  max-height: 200px; /* Limiter la hauteur de la boîte de chat */
}
.chat-message {
  padding: 2px 0;
}

</style>