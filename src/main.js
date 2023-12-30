/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */
import App from './App.vue'
import './assets/style.css'
import { createApp } from 'vue'
import tooltip from './directives/tooltip'




// Plugins
import { registerPlugins } from '@/plugins'

const app = createApp(App)

app.directive('tooltip',tooltip)

registerPlugins(app)
import '@/assets/overwriteVutifyClass.scss'

app.mount('#app')

// To begin, access the app store to retrieve user information, including permissions, products, and plugins.
import { useAppStore } from '@/store/app'

// useAppStore()

export default app
