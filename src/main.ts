import { createApp } from 'vue'
import { autoAnimatePlugin } from '@formkit/auto-animate/vue'
import PrimeVue from 'primevue/config'
import Router from './routes'
import App from './App.vue'
import addStretchyDirective from './directives/stretchy'

import 'primevue/resources/themes/mdc-dark-indigo/theme.css'
import 'primevue/resources/primevue.min.css'
import 'primeicons/primeicons.css'
import 'primeflex/primeflex.css'

const app = createApp(App)

app.use(Router)

app.use(autoAnimatePlugin)

addStretchyDirective(app)

app.use(PrimeVue, { ripple: false })

app.mount('#app')
