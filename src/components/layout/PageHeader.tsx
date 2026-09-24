import { type FC, type ReactNode } from 'react'
import { Box, Container, Text } from '@mantine/core'
import { motion, useReducedMotion } from 'framer-motion'

interface PageHeaderProps {
  eyebrow: string
  title: ReactNode
  subtitle?: ReactNode
}

export const PageHeader: FC<PageHeaderProps> = ({ eyebrow, title, subtitle }) => {
  const reduce = useReducedMotion()
  return (
    <Box
      style={{
        position: 'relative',
        overflow: 'hidden',
        borderBottom: '1px solid var(--border)',
        /* Floor clears the fixed navbar — the tightening happens below the title. */
        paddingTop: 'clamp(94px, 9vh, 112px)',
        paddingBottom: 'clamp(28px, 4vh, 48px)',
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
            ff='"Source Sans 3", sans-serif'
            fw={700}
            fz={13}
            tt="uppercase"
            style={{ letterSpacing: '0.18em', color: 'var(--teal)', marginBottom: 10 }}
          >
            {eyebrow}
          </Text>
          <Text
            component="h1"
            ff='"Source Sans 3", sans-serif'
            style={{
              fontSize: 'clamp(28px, 4.6vw, 58px)',
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: '-0.03em',
              color: 'var(--color-text)',
              margin: 0,
              maxWidth: 820,
            }}
          >
            {title}
          </Text>
          {subtitle && (
            <Text
              style={{
                color: 'var(--color-subtext)',
                fontSize: 'clamp(15px, 1.7vw, 18px)',
                lineHeight: 1.55,
                maxWidth: 620,
                marginTop: 14,
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
