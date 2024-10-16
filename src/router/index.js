import { createRouter, createWebHistory } from 'vue-router';
import Game from '@/components/Game.vue';
import Leaderboard from '@/components/Leaderboard.vue';
import AuthForm from '@/components/AuthForm.vue';

const routes = [
  { path: '/game', 
    component: Game,
  },
  
  {
    path: '/leaderboard',
    component: Leaderboard,
  },
  {
    path: '/login',
    component: AuthForm,
    props: { isSignUp: false },
  },
  {
    path: '/signup',
    component: AuthForm,
    props: { isSignUp: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
