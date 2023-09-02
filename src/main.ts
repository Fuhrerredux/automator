import { createPinia } from 'pinia'
import 'tippy.js/dist/tippy.css'
import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'
import VueTippy from 'vue-tippy'
import 'vue-toast-notification/dist/theme-sugar.css'
import Automator from './app.vue'
import './assets/app.css'
import locales from './locales'
import router from './router'

const locale = 'en'
const i18n = createI18n({
  locale,
  fallbackLocale: locale,
  legacy: false,
  allowComposition: true,
  globalInjection: true,
  messages: locales,
  missingWarn: false,
  fallbackWarn: false
})

const app = createApp(Automator)
app.use(createPinia())
app.use(router)
app.use(i18n)
app.use(VueTippy, { directive: 'tippy', component: 'tippy' })
app.mount('#app')
