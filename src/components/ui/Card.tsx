import { type CSSProperties, type ReactNode, forwardRef } from 'react'
import { cn } from '../../lib/utils'

interface CardProps {
  children: ReactNode
  /** Add a hover lift effect. */
  lift?: boolean
  className?: string
  style?: CSSProperties
}

/**
 * Glass surface with a thin 1px border and a low-opacity teal glow on hover.
 * Pure presentation — receives content via children.
 */
export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ children, lift = false, className, style }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('glow-card', lift && 'glow-card--lift', className)}
        style={style}
      >
        {children}
      </div>
    )
  },
)

Card.displayName = 'Card'
