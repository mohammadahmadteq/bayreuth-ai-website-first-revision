import { useEffect, useState, type ReactNode } from 'react'
import { useSiteContent } from '../../hooks/useSiteContent'
import { asset } from '../../lib/utils'
import './WebsiteLoader.css'

export function WebsiteLoader({ children }: { children: ReactNode }) {
  const { isLoading } = useSiteContent()
  const [minimumElapsed, setMinimumElapsed] = useState(false)
  const [timedOut, setTimedOut] = useState(false)
  const [dismissed, setDismissed] = useState(false)
  const complete = minimumElapsed && (!isLoading || timedOut)

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const minimum = window.setTimeout(() => setMinimumElapsed(true), reducedMotion ? 0 : 1200)
    // Keep the site usable with its fallback content if a network request stalls.
    const maximum = window.setTimeout(() => setTimedOut(true), 6000)
    return () => {
      window.clearTimeout(minimum)
      window.clearTimeout(maximum)
    }
  }, [])

  useEffect(() => {
    if (!complete) return
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const timer = window.setTimeout(() => setDismissed(true), reducedMotion ? 0 : 500)
    return () => window.clearTimeout(timer)
  }, [complete])

  useEffect(() => {
    if (dismissed) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [dismissed])

  return (
    <>
      <div inert={!dismissed} aria-hidden={!dismissed ? true : undefined}>
        {children}
      </div>
      {!dismissed && (
        <div
          className={`website-loader${complete ? ' website-loader--complete' : ''}`}
          role="status"
          aria-live="polite"
          aria-label="Loading Bayreuth AI Association"
        >
          <div className="website-loader__content" aria-hidden="true">
            <div
              className="website-loader__logo"
              style={{ maskImage: `url("${asset('/official/logo.svg')}")` }}
            >
              <div className="website-loader__fill" />
            </div>
            <span className="website-loader__name">Bayreuth AI Association</span>
            <span className="website-loader__label">Loading…</span>
          </div>
        </div>
      )}
    </>
  )
}
