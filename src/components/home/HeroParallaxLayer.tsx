import { type FC } from 'react'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'

/**
 * Subtle parallax background for the hero — a structured grid plus two soft
 * glow orbs that drift on scroll. Decorative only (pointer-events: none),
 * static when reduced motion is requested.
 */
export const HeroParallaxLayer: FC = () => {
  const reduce = useReducedMotion()
  const { scrollY } = useScroll()
  const gridY = useTransform(scrollY, [0, 600], [0, 120])
  const glowY = useTransform(scrollY, [0, 600], [0, -80])

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    >
      <motion.div
        className="grid-bg"
        style={{
          position: 'absolute',
          inset: '-10% 0 0',
          height: '120%',
          opacity: 0.6,
          y: reduce ? 0 : gridY,
          maskImage: 'radial-gradient(ellipse 70% 60% at 50% 35%, black, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(ellipse 70% 60% at 50% 35%, black, transparent 80%)',
        }}
      />
      <motion.div
        style={{
          position: 'absolute',
          top: '-12%',
          left: '50%',
          width: 680,
          height: 680,
          marginLeft: -340,
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(45,224,200,0.16), rgba(57,255,106,0.06) 45%, transparent 70%)',
          filter: 'blur(20px)',
          y: reduce ? 0 : glowY,
        }}
      />
    </div>
  )
}
