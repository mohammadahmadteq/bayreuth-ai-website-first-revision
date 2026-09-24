import { type FC } from 'react'
import { useBadgeScene } from '../../hooks/useBadgeScene'
import { OVERSCAN } from '../../lib/badge/constants'

interface Logo3DCardProps {
  /** URL of the SVG logo used as the badge's issuer mark. */
  logoSrc: string
  /** Photo shown dimmed in the badge's portrait window, revealed in full on flip. */
  photoSrc: string
  alt?: string
  photoAlt?: string
}

export const Logo3DCard: FC<Logo3DCardProps> = ({ logoSrc, photoSrc, alt = '', photoAlt = '' }) => {
  const { containerRef, webglFailed } = useBadgeScene(logoSrc, photoSrc)

  if (webglFailed) {
    return (
      <img
        src={photoSrc}
        alt={photoAlt || alt}
        style={{
          width: '100%',
          maxWidth: 420,
          margin: '0 auto',
          display: 'block',
          borderRadius: 16,
          border: '1px solid rgba(var(--teal-rgb), 0.4)',
          boxShadow: '0 0 36px rgba(var(--teal-rgb), 0.25)',
        }}
      />
    )
  }

  const overhang = `${((OVERSCAN - 1) / 2) * -100}%`
  return (
    <div
      role="img"
      aria-label={`${alt}${photoAlt ? ` — click to flip and reveal ${photoAlt}` : ''}`}
      style={{ position: 'relative', width: '100%', height: '100%' }}
    >
      <div
        ref={containerRef}
        style={{ position: 'absolute', inset: overhang, pointerEvents: 'none' }}
      />
    </div>
  )
}
