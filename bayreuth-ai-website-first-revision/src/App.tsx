import { type FC, useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { Navbar } from './components/layout/Navbar'
import { Footer } from './components/layout/Footer'
import { PageTransition } from './components/layout/PageTransition'
import { ErrorBoundary } from './components/ErrorBoundary'
import { HomePage } from './pages/HomePage'
import { MeetingsPage } from './pages/MeetingsPage'
import { TeamPage } from './pages/TeamPage'
import { DatesPage } from './pages/DatesPage'
import { ResourcesPage } from './pages/ResourcesPage'
import { ProjectsPage } from './pages/ProjectsPage'
import { PartnersPage } from './pages/PartnersPage'
import { ApplyPage } from './pages/ApplyPage'
import { NotFoundPage } from './pages/NotFoundPage'

/** Scroll to top on every route change (unless reduced motion / hash nav). */
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
        <Route
          path="/"
          element={
            <PageTransition>
              <HomePage />
            </PageTransition>
          }
        />
        <Route
          path="/meetings"
          element={
            <PageTransition>
              <MeetingsPage />
            </PageTransition>
          }
        />
        <Route
          path="/team"
          element={
            <PageTransition>
              <TeamPage />
            </PageTransition>
          }
        />
        <Route
          path="/dates"
          element={
            <PageTransition>
              <DatesPage />
            </PageTransition>
          }
        />
        <Route
          path="/resources"
          element={
            <PageTransition>
              <ResourcesPage />
            </PageTransition>
          }
        />
        <Route
          path="/projects"
          element={
            <PageTransition>
              <ProjectsPage />
            </PageTransition>
          }
        />
        <Route
          path="/partners"
          element={
            <PageTransition>
              <PartnersPage />
            </PageTransition>
          }
        />
        <Route
          path="/apply"
          element={
            <PageTransition>
              <ApplyPage />
            </PageTransition>
          }
        />
        <Route
          path="*"
          element={
            <PageTransition>
              <NotFoundPage />
            </PageTransition>
          }
        />
      </Routes>
    </AnimatePresence>
  )
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Navbar />
      <main style={{ paddingTop: 68, position: 'relative', overflow: 'clip' }}>
        <ErrorBoundary label="Page">
          <AnimatedRoutes />
        </ErrorBoundary>
      </main>
      <Footer />
    </>
  )
}
