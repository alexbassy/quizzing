import { createApp } from 'vue'
import { autoAnimatePlugin } from '@formkit/auto-animate/vue'
import PrimeVue from 'primevue/config'
import Router from './routes'
import App from './App.vue'
import addStretchyDirective from './directives/stretchy'

const app = createApp(App)

app.use(Router)

app.use(autoAnimatePlugin)

addStretchyDirective(app)

app.use(PrimeVue, { ripple: false })

app.mount('#app')
