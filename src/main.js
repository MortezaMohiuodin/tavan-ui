import { createApp } from 'vue'

import { registerPlugins } from '@/plugins'
import tooltip from './directives/tooltip'
import App from './App.vue'

// styles

import './assets/style.css'
import './assets/overwriteVutifyClass.scss'


const app = createApp(App)

app.directive('tooltip',tooltip)

registerPlugins(app)

app.mount('#app')


export default app





