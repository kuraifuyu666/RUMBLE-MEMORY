<template>
  <div class="home-container text-center p-6">
    <h1 class="text-4xl font-bold mb-4">Bienvenue dans Rumble Memory!</h1>
    <p class="text-xl mb-6">
      Testez votre mémoire et amusez-vous à associer les cartes. 
      Cliquez sur une carte pour la retourner et essayez de trouver les paires!
    </p>

    <div class="flex flex-col sm:flex-row justify-center">
      <div class="input-chat-container w-full max-w-md mb-4">
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

      <div class="leaderboard-container border-gray-600 bg-gray-800 rounded-lg p-4 w-full max-w-md shadow-lg mb-4 sm:mb-0">
        <Leaderboard />
      </div>
    </div>
  </div>
</template>

<script>
import { collection, addDoc, onSnapshot, query, orderBy, deleteDoc, doc, getDocs } from "firebase/firestore";
import { db } from '@/fireBase/index';
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
      return this.pseudo.trim() !== '';
    },
  },
  methods: {
    submitPseudo() {
      if (this.isPseudoValid) {
        this.isPseudoSubmitted = true;
      }
    },
    async sendMessage() {
      if (this.newMessage.trim() !== '' && this.isPseudoSubmitted) {
        try {
          await addDoc(collection(db, 'messages'), {
            pseudo: this.pseudo,
            content: this.newMessage.trim(),
            timestamp: new Date(),
          });
          this.newMessage = '';
        } catch (error) {
          console.error('Erreur lors de l\'envoi du message :', error);
        }
      }
    },
    scrollToBottom() {
      const chatBox = this.$refs.chatBox;
      if (chatBox) {
        chatBox.scrollTop = chatBox.scrollHeight;
      }
    },
    fetchMessages() {
      const q = query(collection(db, 'messages'), orderBy('timestamp'));
      onSnapshot(q, (querySnapshot) => {
        this.messages = [];
        querySnapshot.forEach((doc) => {
          this.messages.push(doc.data());
        });
        this.$nextTick(() => {
          this.scrollToBottom();
        });
      });
    },
    async deleteAllMessages() {
      const querySnapshot = await getDocs(collection(db, 'messages'));
      const deletePromises = querySnapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deletePromises);
    },
    handlePageUnload() {
      this.deleteAllMessages();
    },
  },
  mounted() {
    this.fetchMessages();
    window.addEventListener('beforeunload', this.handlePageUnload);
  },
  beforeDestroy() {
    window.removeEventListener('beforeunload', this.handlePageUnload);
  },
};
</script>

<style scoped lang="scss">
$background-color_1: #f9f9f9;
$border-color_1: #a1a1a1;

.home-container {
  background-color: $background-color_1;
  padding: 1rem;
  @media (min-width: 640px) {
    padding: 2rem;
  }
}

.flex {
  flex-direction: column;
  @media (min-width: 640px) {
    flex-direction: row;
  }
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
  &:hover {
    border-color: $border-color_1;
  }
}

.chat-box {
  max-height: 100px;
  overflow-y: auto;
  @media (min-width: 640px) {
    max-height: 200px;
  }
}

input,
button {
  font-size: 14px;
  @media (min-width: 640px) {
    font-size: 16px;
  }
}

.leaderboard-container {
  margin-top: 1rem;
  @media (min-width: 640px) {
    margin-top: 0;
  }
}
</style>






