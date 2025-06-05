/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Plugins
import { registerPlugins } from '@/plugins'

// Components
import App from './App.vue'

// Composables
import { createApp } from 'vue'

// Styles
import 'unfonts.css'

import router from './router'

import pinia from './stores' // <-- from index.js

const app = createApp(App)

app.use(pinia)
app.use(router)

registerPlugins(app)

app.mount('#app')
