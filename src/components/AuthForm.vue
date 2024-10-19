<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-900">
    <div class="auth-form bg-gradient-to-r from-gray-800 via-gray-900 to-black shadow-lg rounded-lg p-8 text-white w-full max-w-md">
      <h2 class="text-3xl font-bold mb-4 text-yellow-400 uppercase tracking-widest" v-if="isSignUpMode">Sign Up</h2>
      <h2 class="text-3xl font-bold mb-4 text-yellow-400 uppercase tracking-widest" v-else>Log In</h2>

      <form @submit.prevent="isSignUpMode ? signUp() : signIn()">
        <div class="form-group mb-4">
          <label for="email" class="block text-white text-sm font-bold mb-2">Email:</label>
          <input
            v-model="email"
            type="email"
            id="email"
            v-if="isSignUpMode"
            class="w-full p-3 text-gray-900 rounded-lg shadow-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
            placeholder="Enter your email"
            required
          />
          <input
            v-model="email"
            type="text"
            id="email"
            v-else
            class="w-full p-3 text-gray-900 rounded-lg shadow-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
            placeholder="User ID"
            required
          />
        </div>

        <div v-if="isSignUpMode" class="form-group mb-4">
          <label for="userId" class="block text-white text-sm font-bold mb-2">User ID:</label>
          <input
            v-model="userId"
            type="text"
            id="userId"
            class="w-full p-3 text-gray-900 rounded-lg shadow-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
            placeholder="Create a User ID"
            required
          />
        </div>

        <div class="form-group mb-6">
          <label for="password" class="block text-white text-sm font-bold mb-2">Password:</label>
          <input
            v-model="password"
            type="password"
            id="password"
            class="w-full p-3 text-gray-900 rounded-lg shadow-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
            placeholder="Enter your password"
            required
          />
        </div>

        <button
          type="submit"
          class="w-full bg-yellow-400 text-gray-800 py-2 px-4 rounded-full hover:bg-yellow-500 transition-all duration-300 ease-in-out"
        >
          {{ isSignUpMode ? 'Sign Up' : 'Log In' }}
        </button>

        <p v-if="authStore.errorMessage" class="error-message text-red-500 mt-4">{{ authStore.errorMessage }}</p>
      </form>

      <p @click="toggleMode" class="toggle-mode text-white text-sm mt-4 cursor-pointer hover:underline">
        {{ isSignUpMode ? 'Vous avez un compte? Log In' : "Vous n'avez pas de compte? Sign Up" }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/useAuthStore';

const router = useRouter();
const authStore = useAuthStore();

const email = ref('');
const userId = ref('');
const password = ref('');
const isSignUpMode = ref(true);

// Inscription d'un nouvel utilisateur
const signUp = async () => {
  await authStore.signUp(email.value, password.value, userId.value);
  if (!authStore.errorMessage) {
    router.push('/'); // Redirection vers la page d'accueil
  }
};

// Connexion d'un utilisateur existant
const signIn = async () => {
  await authStore.signIn(email.value, password.value);
  if (!authStore.errorMessage) {
    router.push('/'); // Redirection vers la page d'accueil
  }
};

// Basculer entre inscription et connexion
const toggleMode = () => {
  isSignUpMode.value = !isSignUpMode.value;
  email.value = '';
  password.value = '';
  userId.value = '';
};
</script>

<style scoped>
.error-message {
  text-align: center;
  color: red;
  font-weight: 600; /* semi-bold */
}
</style>









