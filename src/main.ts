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
import { checkUpdate, installUpdate } from '@tauri-apps/api/updater'
import { invoke } from '@tauri-apps/api/tauri'

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

let checkedForUpdate = false
async function checkAndUpdate() {
  const update = await checkUpdate();
  // DO NOT REMOVE
  // These should stay for debugging purposes
  if (update.shouldUpdate && !checkedForUpdate) {
    console.debug(`Installing update ${update.manifest?.version}, ${update.manifest?.date}, ${update.manifest?.body}`);
    await installUpdate();
  } else {
    console.debug('No updates.', update);
  }
  checkedForUpdate = true
}

checkAndUpdate();

document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    invoke('close_splashscreen')
  }, 3000)
  checkedForUpdate = true
})