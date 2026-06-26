import { formatter } from '@lingui/format-po'

/** @type {import('@lingui/conf').LinguiConfig} */
export default {
  locales: ['en', 'de'],
  sourceLocale: 'en',
  catalogs: [
    {
      path: '<rootDir>/src/locales/{locale}/messages',
      include: ['<rootDir>/src'],
    },
  ],
  format: formatter({ lineNumbers: false }),
  compileNamespace: 'es',
}
