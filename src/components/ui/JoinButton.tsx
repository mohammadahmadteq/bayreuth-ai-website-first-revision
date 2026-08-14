import { type FC, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { IconArrowRight } from '@tabler/icons-react'

const MotionLink = motion.create(Link)
const MotionAnchor = motion.a

type Size = 'sm' | 'md' | 'lg'

const PADDING: Record<Size, string> = {
  sm: '11px 24px',
  md: '15px 32px',
  lg: '20px 44px',
}
const FONT: Record<Size, number> = { sm: 15, md: 16, lg: 18 }

interface JoinButtonProps {
  /** Internal route (default) — ignored when `href` is set. */
  to?: string
  /** External / mailto link. Renders an <a> instead of a router Link. */
  href?: string
  size?: Size
  withArrow?: boolean
  children?: ReactNode
  className?: string
}

/**
 * "Become a Member" — primary CTA. Solid teal→neon fill, strongest weight.
 * Always visually and functionally distinct from PartnerButton.
 */
export const JoinButton: FC<JoinButtonProps> = ({
  to = '/apply',
  href,
  size = 'md',
  withArrow = true,
  children,
  className,
}) => {
  const shared = {
    className: `btn-member${className ? ` ${className}` : ''}`,
    whileHover: { scale: 1.03 },
    whileTap: { scale: 0.97 },
    style: {
      display: 'inline-flex' as const,
      alignItems: 'center',
      gap: 8,
      padding: PADDING[size],
      fontSize: FONT[size],
      borderRadius: 9999,
      textDecoration: 'none' as const,
      whiteSpace: 'nowrap' as const,
    },
  }

  const content = (
    <>
      {children ?? 'Become a Member'}
      {withArrow && <IconArrowRight size={size === 'lg' ? 20 : 16} stroke={2.4} />}
    </>
  )

  if (href) {
    return (
      <MotionAnchor href={href} {...shared}>
        {content}
      </MotionAnchor>
    )
  }
  return (
    <MotionLink to={to} {...shared}>
      {content}
    </MotionLink>
  )
}
