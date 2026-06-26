import { type FC, useEffect, useRef, useState } from 'react'
import { useInView, useReducedMotion } from 'framer-motion'

interface AnimatedCounterProps {
  value: number
  suffix?: string
  prefix?: string
  /** Count-up duration in ms. */
  duration?: number
  className?: string
}

/**
 * Counts up from 0 → `value` the first time it scrolls into view.
 * If prefers-reduced-motion is set, the final value is shown immediately.
 */
export const AnimatedCounter: FC<AnimatedCounterProps> = ({
  value,
  suffix = '',
  prefix = '',
  duration = 1600,
  className,
}) => {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const reduce = useReducedMotion()
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    if (!inView || reduce) return

    let raf = 0
    let start: number | null = null
    const step = (ts: number) => {
      if (start === null) start = ts
      const progress = Math.min((ts - start) / duration, 1)
      // easeOutCubic for a smooth deceleration
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplay(Math.round(eased * value))
      if (progress < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [inView, reduce, value, duration])

  // With reduced motion, the final value is shown immediately (no count-up).
  const shown = reduce ? value : display

  return (
    <span ref={ref} className={className}>
      {prefix}
      {shown.toLocaleString('en-US')}
      {suffix}
    </span>
  )
}
