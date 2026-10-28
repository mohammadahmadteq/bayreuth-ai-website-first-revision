import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { MantineProvider } from '@mantine/core'
import { I18nProvider } from '@lingui/react'
import { i18n } from '@lingui/core'
// Served from the site itself: loading fonts from Google's servers would send
// every visitor's IP address to Google. Same weights as the old Google Fonts link.
import '@fontsource/source-sans-3/400.css'
import '@fontsource/source-sans-3/500.css'
import '@fontsource/source-sans-3/600.css'
import '@fontsource/source-sans-3/700.css'
import '@mantine/core/styles.css'
import './styles/globals.css'
import './services/i18n' // side-effect: activates the English catalog
import { theme } from './theme/theme'
import App from './App'
import { SiteContentProvider } from './services/siteContent'
import { WebsiteLoader } from './components/layout/WebsiteLoader'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <I18nProvider i18n={i18n}>
      <MantineProvider theme={theme} defaultColorScheme="light" forceColorScheme="light">
        <BrowserRouter basename={import.meta.env.BASE_URL}>
          <SiteContentProvider>
            <WebsiteLoader>
              <App />
            </WebsiteLoader>
          </SiteContentProvider>
        </BrowserRouter>
      </MantineProvider>
    </I18nProvider>
  </StrictMode>,
)
