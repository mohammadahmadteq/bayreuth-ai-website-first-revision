import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { MantineProvider, localStorageColorSchemeManager } from '@mantine/core'
import { I18nProvider } from '@lingui/react'
import { i18n } from '@lingui/core'
import '@mantine/core/styles.css'
import './styles/globals.css'
import './services/i18n' // side-effect: loads catalogs + activates initial locale
import { theme } from './theme/theme'
import App from './App'

const colorSchemeManager = localStorageColorSchemeManager({ key: 'bayreuth-ai-theme' })

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <I18nProvider i18n={i18n}>
      <MantineProvider
        theme={theme}
        colorSchemeManager={colorSchemeManager}
        defaultColorScheme="dark"
      >
        <BrowserRouter basename={import.meta.env.BASE_URL}>
          <App />
        </BrowserRouter>
      </MantineProvider>
    </I18nProvider>
  </StrictMode>,
)
