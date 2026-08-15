import { type FC, type ReactNode } from 'react'

type Variant = 'teal' | 'neon' | 'muted'

const STYLES: Record<Variant, { color: string; bg: string; border: string }> = {
  teal: {
    color: 'var(--teal)',
    bg: 'rgba(var(--teal-rgb), 0.1)',
    border: 'rgba(var(--teal-rgb), 0.3)',
  },
  neon: {
    color: 'var(--neon)',
    bg: 'rgba(var(--neon-rgb), 0.1)',
    border: 'rgba(var(--neon-rgb), 0.3)',
  },
  muted: {
    color: 'var(--color-subtext)',
    bg: 'var(--color-surface-strong)',
    border: 'var(--border)',
  },
}

interface BadgeProps {
  children: ReactNode
  variant?: Variant
  leftSection?: ReactNode
}

export const Badge: FC<BadgeProps> = ({ children, variant = 'teal', leftSection }) => {
  const s = STYLES[variant]
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '4px 11px',
        borderRadius: 9999,
        fontSize: 12,
        fontWeight: 600,
        fontFamily: 'Space Grotesk, sans-serif',
        letterSpacing: '0.02em',
        color: s.color,
        background: s.bg,
        border: `1px solid ${s.border}`,
        lineHeight: 1.4,
        whiteSpace: 'nowrap',
      }}
    >
      {leftSection}
      {children}
    </span>
  )
}
