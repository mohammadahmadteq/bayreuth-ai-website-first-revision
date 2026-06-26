import { useLingui } from '@lingui/react'
import { activateLocale, type Locale, SUPPORTED_LOCALES } from '../services/i18n'

export function useLocale() {
  const { i18n } = useLingui()
  return {
    locale: i18n.locale as Locale,
    setLocale: activateLocale,
    locales: SUPPORTED_LOCALES,
  }
}
