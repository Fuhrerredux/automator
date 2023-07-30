import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'
import Automator from './app.vue'
import './assets/app.css'
import locales from './locales'
import router from './router'

const locale = 'en'
const i18n = createI18n({
  locale,
  fallbackLocale: locale,
  allowComposition: true,
  globalInjection: true,
  messages: locales
})

const app = createApp(Automator)
app.use(router)
app.use(i18n)
app.mount('#app')
