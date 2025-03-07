import './assets/main.css'
import { VueFire, VueFireAuth } from 'vuefire'
import { firebaseApp } from '@/fireBase'
import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(VueFire, {
  // imported above but could also just be created here
  firebaseApp,
  modules: [
    // we will see other modules later on
    VueFireAuth(),
  ],
})

app.use(createPinia())
app.use(router)

app.mount('#app')
