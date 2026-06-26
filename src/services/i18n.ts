import { i18n } from '@lingui/core'
import { messages as enMessages } from '../locales/en/messages.po'
import { messages as deMessages } from '../locales/de/messages.po'

export const SUPPORTED_LOCALES = ['en', 'de'] as const
export type Locale = (typeof SUPPORTED_LOCALES)[number]

export const LOCALE_LABELS: Record<Locale, string> = {
  en: 'English',
  de: 'Deutsch',
}

const STORAGE_KEY = 'bayreuth-ai-locale'

i18n.load({ en: enMessages, de: deMessages })

export function getInitialLocale(): Locale {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored && (SUPPORTED_LOCALES as readonly string[]).includes(stored)) {
      return stored as Locale
    }
  } catch {
    // localStorage may be unavailable (private mode, SSR)
  }
  const browser =
    typeof navigator !== 'undefined' ? navigator.language.split('-')[0].toLowerCase() : 'en'
  return browser === 'de' ? 'de' : 'en'
}

export function activateLocale(locale: Locale): void {
  i18n.activate(locale)
  try {
    localStorage.setItem(STORAGE_KEY, locale)
  } catch {
    // ignore
  }
  if (typeof document !== 'undefined') {
    document.documentElement.lang = locale
  }
}

activateLocale(getInitialLocale())
