import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { setupStores } from './stores/counter'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)
setupStores()

app.mount('#app')
