import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { setupStores } from './stores/counter'

import App from './App.vue'
import router from './router'
import '@/assets/basic.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)
setupStores()

app.mount('#app')
