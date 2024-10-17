<template>
  <div id="app" class="min-h-screen bg-gray-100">
    <!-- Navbar centrée -->
    <header class="bg-gray-800 text-white py-4">
      <nav class="container mx-auto flex justify-between items-center">
        <!-- Section de gauche avec les liens centrés -->
        <div class="flex items-center space-x-8">
          <!-- Logo centré -->
          <h1 class=" luckiest-guy-regular text-2xl font-bold animate-bounce">Rumble Memory</h1>
          
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
                <button class="bg-purple-500 text-white px-4 py-2 rounded shadow-md hover:bg-purple-600 hover:shadow-lg transition-all">
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
              <a href="https://youtu.be/dQw4w9WgXcQ?si=kFB5mui2EZx39Rpn" target="_blank" rel="noopener noreferrer">
                <button class="bg-red-500 text-white px-4 py-2 rounded shadow-md hover:bg-red-600 hover:shadow-lg transition-all">
                  Help
                </button>
              </a>
            </li>
          </ul>
        </div>

        <!-- Section à droite avec Connexion et Inscription -->
        <div class="flex items-center space-x-4">
          <router-link to="/login">
            <button class="bg-blue-500 text-white px-4 py-2 rounded shadow-md hover:bg-blue-600 hover:shadow-lg transition-all">
              Connexion
            </button>
          </router-link>
          <router-link to="/signup">
            <button class="bg-green-500 text-white px-4 py-2 rounded shadow-md hover:bg-green-600 hover:shadow-lg transition-all">
              Inscription
            </button>
          </router-link>
        </div>
      </nav>
    </header>

    <!-- Main Content -->
    <main class="container mx-auto py-6">
      <router-view></router-view> <!-- This is where the components will be rendered -->
    </main>
  </div>
</template>

<script>
export default {

  name: 'App',
};
</script>


<style>
@import url('https://fonts.googleapis.com/css2?family=Luckiest+Guy&display=swap');

.luckiest-guy-regular {
  font-family: "Luckiest Guy", cursive;
  font-weight: 400;
  font-style: normal;
}


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