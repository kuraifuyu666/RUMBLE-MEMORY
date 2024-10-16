<template>
  <div id="app" class="min-h-screen bg-gray-100">
    <!-- Navbar centrée -->
    <header class="bg-gray-800 text-white py-4">
      <nav class="container mx-auto flex justify-center items-center">
        <div class="flex items-center space-x-8">
          <!-- Logo centré -->
          <h1 class="text-2xl font-bold animate-bounce">Rumble Memory</h1>
          
          <!-- Liens centrés avec boutons -->
          <ul class="flex space-x-4">
            <li>
              <router-link to="/">
                <button class="bg-blue-500 text-white px-4 py-2 rounded shadow-md hover:bg-blue-600 hover:shadow-lg transition-all">
                  Accueil
                </button>
              </router-link>
            </li>
            <li>
              <router-link to="/game">
                <button class="bg-blue-500 text-white px-4 py-2 rounded shadow-md hover:bg-blue-600 hover:shadow-lg transition-all">
                  Game
                </button>
              </router-link>
            </li>
            <li>
              <router-link to="/leaderboard">
                <button class="bg-yellow-500 text-white px-4 py-2 rounded shadow-md hover:bg-yellow-600 hover:shadow-lg transition-all">
                  Classement
                </button>
              </router-link>
            </li>
            <li>
              <router-link to="/login">
                <button class="bg-blue-500 text-white px-4 py-2 rounded shadow-md hover:bg-blue-600 hover:shadow-lg transition-all">
                  Connexion
                </button>
              </router-link>
            </li>
            <li>
              <router-link to="/signup">
                <button class="bg-gray-500 text-white px-4 py-2 rounded shadow-md hover:bg-gray-600 hover:shadow-lg transition-all">
                  Inscription
                </button>
              </router-link>
            </li>
            <li>
              <router-link to="/help">
                <button class="bg-green-500 text-white px-4 py-2 rounded shadow-md hover:bg-green-600 hover:shadow-lg transition-all">
                  Help
                </button>
              </router-link>
            </li>
          </ul>
        </div>
      </nav>
    </header>

    <!-- Main Content -->
    <main class="container mx-auto py-6">
      <router-view></router-view> 
    </main>
  </div>
</template>

<script>
export default {
  name: 'App',
};
</script>

<style>
/* Animation de rebond */
@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
}

.animate-bounce {
  animation: bounce 1s ease infinite;
}
</style>