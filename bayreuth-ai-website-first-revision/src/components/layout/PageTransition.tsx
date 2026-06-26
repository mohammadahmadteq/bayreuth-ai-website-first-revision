import { type FC, type ReactNode } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

interface PageTransitionProps {
  children: ReactNode
}

/**
 * Wraps a route's content for smooth enter/exit transitions via AnimatePresence.
 * Falls back to a static container when reduced motion is requested.
 */
export const PageTransition: FC<PageTransitionProps> = ({ children }) => {
  const reduce = useReducedMotion()

  if (reduce) return <div>{children}</div>

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.4, ease: [0.2, 0, 0, 1] }}
    >
      {children}
    </motion.div>
  )
}
