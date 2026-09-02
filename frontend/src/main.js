import { createApp } from 'vue'
import { createPinia } from 'pinia'
import {
  Chart,
  ArcElement,
  BarElement,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Filler,
  Tooltip,
} from 'chart.js'

import App from './App.vue'
import router from './router'
import { useAuthStore } from './stores/auth'

Chart.register(
  ArcElement,
  BarElement,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Filler,
  Tooltip,
)

const app = createApp(App)

app.use(createPinia())

useAuthStore().inicijalizacija.then(() => {
  app.use(router)
  app.mount('#app')
  if (import.meta.env.DEV) import('./data/seed').then((seed) => (window.seed = seed))
})
