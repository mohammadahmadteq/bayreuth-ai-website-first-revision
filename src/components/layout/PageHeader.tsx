import { type FC, type ReactNode } from 'react'
import { Box, Container, Text } from '@mantine/core'
import { motion, useReducedMotion } from 'framer-motion'

interface PageHeaderProps {
  eyebrow: string
  title: ReactNode
  subtitle?: ReactNode
}

/** Consistent top-of-page header for inner routes, with a structured grid backdrop. */
export const PageHeader: FC<PageHeaderProps> = ({ eyebrow, title, subtitle }) => {
  const reduce = useReducedMotion()
  return (
    <Box
      style={{
        position: 'relative',
        overflow: 'hidden',
        borderBottom: '1px solid var(--border)',
        paddingTop: 'clamp(56px, 9vh, 110px)',
        paddingBottom: 'clamp(40px, 6vh, 72px)',
      }}
    >
      <Box
        className="grid-bg"
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.6,
          pointerEvents: 'none',
          maskImage: 'radial-gradient(ellipse 60% 80% at 30% 0%, black, transparent 75%)',
          WebkitMaskImage: 'radial-gradient(ellipse 60% 80% at 30% 0%, black, transparent 75%)',
        }}
      />
      <Container size={1280} px={24} style={{ position: 'relative', zIndex: 1 }}>
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.2, 0, 0, 1] }}
        >
          <Text
            ff="Space Grotesk, sans-serif"
            fw={700}
            fz={13}
            tt="uppercase"
            style={{ letterSpacing: '0.18em', color: 'var(--teal)', marginBottom: 14 }}
          >
            {eyebrow}
          </Text>
          <Text
            component="h1"
            ff="Space Grotesk, sans-serif"
            style={{
              fontSize: 'clamp(36px, 6.5vw, 72px)',
              fontWeight: 700,
              lineHeight: 1,
              letterSpacing: '-0.03em',
              color: 'var(--color-text)',
              margin: 0,
              maxWidth: 900,
            }}
          >
            {title}
          </Text>
          {subtitle && (
            <Text
              style={{
                color: 'var(--color-subtext)',
                fontSize: 'clamp(16px, 2.2vw, 20px)',
                lineHeight: 1.6,
                maxWidth: 680,
                marginTop: 22,
              }}
            >
              {subtitle}
            </Text>
          )}
        </motion.div>
      </Container>
    </Box>
  )
}
