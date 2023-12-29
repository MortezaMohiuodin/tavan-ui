import fa from './fa'
import en from './en'
import { createI18n } from 'vue-i18n'

const messages = {
  en,
  fa,
}

// 2. Create i18n instance with options
const i18n = createI18n({
  legacy: false,
  locale: 'fa', // set locale
  globalInjection: true,
  fallbackLocale: 'en', // set fallback locale
  messages, // set locale messages
  // If you need to specify other options, you can set other options
  // ...
})

export default i18n
