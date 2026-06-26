import { type FC, type ReactNode } from 'react'
import { Box, Text } from '@mantine/core'
import { FadeInWhenVisible } from './FadeInWhenVisible'

interface SectionHeadingProps {
  /** Small uppercase kicker above the title. */
  eyebrow?: string
  title: ReactNode
  subtitle?: ReactNode
  align?: 'left' | 'center'
}

export const SectionHeading: FC<SectionHeadingProps> = ({
  eyebrow,
  title,
  subtitle,
  align = 'left',
}) => {
  return (
    <FadeInWhenVisible>
      <Box
        style={{
          textAlign: align,
          maxWidth: align === 'center' ? 720 : undefined,
          margin: align === 'center' ? '0 auto' : undefined,
        }}
      >
        {eyebrow && (
          <Text
            component="p"
            style={{
              fontFamily: 'Space Grotesk, sans-serif',
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: 'var(--teal)',
              margin: '0 0 14px',
            }}
          >
            {eyebrow}
          </Text>
        )}
        <Text
          component="h2"
          style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontSize: 'clamp(28px, 4.5vw, 46px)',
            fontWeight: 700,
            lineHeight: 1.05,
            letterSpacing: '-0.02em',
            color: 'var(--color-text)',
            margin: 0,
          }}
        >
          {title}
        </Text>
        {subtitle && (
          <Text
            component="p"
            style={{
              color: 'var(--color-subtext)',
              fontSize: 'clamp(15px, 2vw, 18px)',
              lineHeight: 1.65,
              maxWidth: 640,
              margin: align === 'center' ? '18px auto 0' : '18px 0 0',
            }}
          >
            {subtitle}
          </Text>
        )}
      </Box>
    </FadeInWhenVisible>
  )
}
