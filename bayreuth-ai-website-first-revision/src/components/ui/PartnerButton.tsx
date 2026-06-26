import { type FC, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { IconHeartHandshake } from '@tabler/icons-react'

const MotionLink = motion.create(Link)
const MotionAnchor = motion.a

type Size = 'sm' | 'md' | 'lg'

const PADDING: Record<Size, string> = {
  sm: '7px 17px',
  md: '11px 25px',
  lg: '15px 35px',
}
const FONT: Record<Size, number> = { sm: 14, md: 15, lg: 17 }

interface PartnerButtonProps {
  /** Internal route (default) — ignored when `href` is set. */
  to?: string
  /** External / mailto link. Renders an <a> instead of a router Link. */
  href?: string
  size?: Size
  withIcon?: boolean
  children?: ReactNode
  className?: string
}

/**
 * "Become a Partner" — secondary CTA. Outline / ghost style, lower visual
 * weight. Deliberately distinct from the primary JoinButton.
 */
export const PartnerButton: FC<PartnerButtonProps> = ({
  to = '/partners',
  href,
  size = 'md',
  withIcon = true,
  children,
  className,
}) => {
  const shared = {
    className: `btn-partner${className ? ` ${className}` : ''}`,
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
      {withIcon && <IconHeartHandshake size={size === 'lg' ? 20 : 16} stroke={2} />}
      {children ?? 'Become a Partner'}
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
