import { createApp } from 'vue'
import { autoAnimatePlugin } from '@formkit/auto-animate/vue'
import { plugin as Slicksort } from 'vue-slicksort'
import Router from './routes'
import App from './App.vue'

const app = createApp(App)
app.use(Router)

app.use(autoAnimatePlugin)
app.use(Slicksort)

app.mount('#app')
