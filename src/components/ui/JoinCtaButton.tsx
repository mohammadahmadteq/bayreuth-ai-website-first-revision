import { type FC, type PointerEvent, type ReactNode, useCallback, useRef } from 'react'
import { useReducedMotion } from 'framer-motion'

interface JoinCtaButtonProps {
  /** External destination (WhatsApp invite, etc.). */
  href: string
  children: ReactNode
  /** Overrides the accessible name when the label alone is ambiguous. */
  ariaLabel?: string
}

/** Max tilt in degrees at the button's edges. */
const TILT_X = 13
const TILT_Y = 16

/**
 * Oversized primary CTA rendered as an extruded 3D "keycap": it lifts on
 * hover, presses in on click, and tilts toward the cursor. The tilt is the
 * only part that needs JS — everything else lives in `.btn-join-3d`.
 */
export const JoinCtaButton: FC<JoinCtaButtonProps> = ({ href, children, ariaLabel }) => {
  const ref = useRef<HTMLAnchorElement>(null)
  const reduce = useReducedMotion()

  const handleMove = useCallback(
    (e: PointerEvent<HTMLAnchorElement>) => {
      const el = ref.current
      if (!el || reduce) return
      const rect = el.getBoundingClientRect()
      const px = (e.clientX - rect.left) / rect.width - 0.5
      const py = (e.clientY - rect.top) / rect.height - 0.5
      el.style.setProperty('--j3d-ry', `${px * TILT_Y}deg`)
      el.style.setProperty('--j3d-rx', `${-py * TILT_X}deg`)
    },
    [reduce],
  )

  const handleLeave = useCallback(() => {
    const el = ref.current
    if (!el) return
    el.style.setProperty('--j3d-ry', '0deg')
    el.style.setProperty('--j3d-rx', '0deg')
  }, [])

  return (
    <a
      ref={ref}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="btn-join-3d"
      aria-label={ariaLabel}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      onBlur={handleLeave}
    >
      {children}
    </a>
  )
}
