import { createApp } from 'vue'
import { autoAnimatePlugin } from '@formkit/auto-animate/vue'
import Router from './routes'
import App from './App.vue'
import addStretchyDirective from './directives/stretchy'

const app = createApp(App)
app.use(Router)

app.use(autoAnimatePlugin)

addStretchyDirective(app)

app.mount('#app')
