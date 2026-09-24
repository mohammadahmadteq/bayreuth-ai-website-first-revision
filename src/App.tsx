import { type FC, useEffect } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { Navbar } from './components/layout/Navbar'
import { Footer } from './components/layout/Footer'
import { PageTransition } from './components/layout/PageTransition'
import { ErrorBoundary } from './components/ErrorBoundary'
import { HomePage } from './pages/HomePage'
import { MeetingsPage } from './pages/MeetingsPage'
import { TeamPage } from './pages/TeamPage'
import { ResourcesPage } from './pages/ResourcesPage'
import { ProjectsPage } from './pages/ProjectsPage'
import { PartnersPage } from './pages/PartnersPage'
import { ApplyPage } from './pages/ApplyPage'
import { QaPage } from './pages/QaPage'
import { NotFoundPage } from './pages/NotFoundPage'

const PAGE_ROUTES = [
  { path: '/', Page: HomePage },
  { path: '/meetings', Page: MeetingsPage },
  { path: '/team', Page: TeamPage },
  { path: '/resources', Page: ResourcesPage },
  { path: '/projects', Page: ProjectsPage },
  { path: '/partners', Page: PartnersPage },
  { path: '/apply', Page: ApplyPage },
  { path: '/qa', Page: QaPage },
  { path: '*', Page: NotFoundPage },
]

const ScrollToTop: FC = () => {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [pathname])
  return null
}

const AnimatedRoutes: FC = () => {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {PAGE_ROUTES.map(({ path, Page }) => (
          <Route
            key={path}
            path={path}
            element={
              <PageTransition>
                <Page />
              </PageTransition>
            }
          />
        ))}
        <Route path="/dates" element={<Navigate to="/meetings" replace />} />
      </Routes>
    </AnimatePresence>
  )
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Navbar />
      <main style={{ position: 'relative', overflow: 'clip' }}>
        <ErrorBoundary label="Page">
          <AnimatedRoutes />
        </ErrorBoundary>
      </main>
      <Footer />
    </>
  )
}
