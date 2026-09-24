import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import { mountBadge } from '../lib/badge/mountBadge'

export function useBadgeScene(logoSrc: string, photoSrc: string) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [webglFailed, setWebglFailed] = useState(false)
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    const container = containerRef.current
    if (!container || webglFailed) return

    let active = true
    const unmount = mountBadge(container, {
      logoSrc,
      photoSrc,
      reduceMotion: Boolean(reduceMotion),
      onRendererError: () => {
        queueMicrotask(() => {
          if (active) setWebglFailed(true)
        })
      },
    })
    return () => {
      active = false
      unmount?.()
    }
  }, [logoSrc, photoSrc, reduceMotion, webglFailed])

  return { containerRef, webglFailed }
}
