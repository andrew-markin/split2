import '@quasar/extras/animate/fadeIn.css'
import '@quasar/extras/animate/fadeOut.css'
import '@quasar/extras/animate/slideInDown.css'
import '@quasar/extras/roboto-font/roboto-font.css'
import '@quasar/extras/mdi-v7/mdi-v7.css'
import 'quasar/src/css/index.sass'

import { Quasar } from 'quasar'
import quasarMdiIconSet from 'quasar/icon-set/mdi-v7'
import { createApp } from 'vue'

import App from '@/App.vue'
import router from '@/router'

const app = createApp(App)

app.use(router)

app.use(Quasar, {
  plugins: {},
  iconSet: quasarMdiIconSet
})

app.mount('#app')
