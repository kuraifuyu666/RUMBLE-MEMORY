<template>
  <div class="max-w-md mx-auto bg-white p-6 rounded shadow">
    <h2 class="text-2xl font-bold mb-4">{{ formTitle }}</h2>
    <form @submit.prevent="submitForm">
      <div class="mb-4">
        <label class="block text-sm font-bold mb-2">E-mail</label>
        <input v-model="email" type="email" class="w-full p-2 border border-gray-300 rounded" required />
      </div>
      <div class="mb-4" v-if="isSignUp">
        <label class="block text-sm font-bold mb-2">Pseudo</label>
        <input v-model="pseudo" type="text" class="w-full p-2 border border-gray-300 rounded" required />
      </div>
      <div class="mb-4">
        <label class="block text-sm font-bold mb-2">Mot de passe</label>
        <input v-model="password" type="password" class="w-full p-2 border border-gray-300 rounded" required />
      </div>
      <button class="w-full bg-blue-500 text-white p-2 rounded">{{ submitText }}</button>
    </form>
  </div>
</template>

<script>
export default {
  name: 'AuthForm',
  props: {
    isSignUp: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      email: '',
      pseudo: '',
      password: '',
    };
  },
  computed: {
    formTitle() {
      return this.isSignUp ? 'Inscription' : 'Connexion';
    },
    submitText() {
      return this.isSignUp ? 'Inscrire' : 'Se Connecter';
    },
  },
  methods: {
    submitForm() {
      // Handle form submission
    },
  },
};
</script>