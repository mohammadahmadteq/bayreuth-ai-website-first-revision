import { type FC, type ReactNode } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { asset } from '../../lib/utils'

interface PageTransitionProps {
  children: ReactNode
}

const DURATION = 0.4

/**
 * Wraps a route's content for smooth enter/exit transitions via AnimatePresence.
 * A small, low-opacity logo mark cross-fades over the same duration as the
 * content transition — a subtle branded touch, not an added loading step.
 * Falls back to a static container when reduced motion is requested.
 */
export const PageTransition: FC<PageTransitionProps> = ({ children }) => {
  const reduce = useReducedMotion()

  if (reduce) return <div>{children}</div>

  return (
    <>
      <motion.img
        src={asset('/official/logo.svg')}
        alt=""
        aria-hidden="true"
        className="page-transition-mark"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.5, 0] }}
        transition={{ duration: DURATION, ease: [0.2, 0, 0, 1] }}
        style={{ width: 48, height: 48 }}
      />
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={{ duration: DURATION, ease: [0.2, 0, 0, 1] }}
      >
        {children}
      </motion.div>
    </>
  )
}
