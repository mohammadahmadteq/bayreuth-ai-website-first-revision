import { i18n } from '@lingui/core'
import { messages } from '../locales/en/messages.po'

// The site is English-only. Lingui stays wired up so text can be marked for
// translation later without changing the provider setup.
i18n.loadAndActivate({ locale: 'en', messages })
