import { createApp } from 'vue'
import { VueQueryPlugin } from "vue-query"

import { registerPlugins } from '@/plugins'
import tooltip from './directives/tooltip'
import App from './App.vue'

// styles

import './assets/style.css'
import './assets/overwriteVutifyClass.scss'


const app = createApp(App)

app.directive('tooltip',tooltip)
app.use(VueQueryPlugin)

registerPlugins(app)

app.mount('#app')


export default app





