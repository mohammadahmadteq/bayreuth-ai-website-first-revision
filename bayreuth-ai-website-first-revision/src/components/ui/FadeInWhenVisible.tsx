import { type FC, type ReactNode } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

interface FadeInWhenVisibleProps {
  children: ReactNode
  /** Stagger delay in seconds. */
  delay?: number
  /** Travel distance in px before settling. */
  y?: number
  className?: string
}

/**
 * Reusable scroll-reveal wrapper. Fades + slides its children in once when
 * they enter the viewport. Respects prefers-reduced-motion (renders statically).
 */
export const FadeInWhenVisible: FC<FadeInWhenVisibleProps> = ({
  children,
  delay = 0,
  y = 24,
  className,
}) => {
  const reduce = useReducedMotion()

  if (reduce) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, delay, ease: [0.2, 0, 0, 1] }}
    >
      {children}
    </motion.div>
  )
}
