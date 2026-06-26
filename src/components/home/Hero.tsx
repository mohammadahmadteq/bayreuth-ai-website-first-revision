import { type FC } from 'react'
import { Box, Group, Image, Stack, Text } from '@mantine/core'
import { IconCalendarTime, IconMapPin } from '@tabler/icons-react'
import { motion, useReducedMotion } from 'framer-motion'
import { HeroParallaxLayer } from './HeroParallaxLayer'
import { JoinButton } from '../ui/JoinButton'
import { PartnerButton } from '../ui/PartnerButton'
import { Badge } from '../ui/Badge'

const HEADLINE = ['Exploring', 'AI.']
const HEADLINE_ACCENT = 'Together.'

export const Hero: FC = () => {
  const reduce = useReducedMotion()

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: reduce ? 0 : 0.08, delayChildren: 0.1 } },
  }
  const word = {
    hidden: { opacity: 0, y: reduce ? 0 : '0.5em' },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.2, 0, 0, 1] as const } },
  }

  return (
    <Box
      component="section"
      className="noise-bg"
      style={{
        position: 'relative',
        minHeight: 'calc(100vh - 68px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: 'clamp(48px, 9vh, 96px) 24px',
        overflow: 'hidden',
      }}
    >
      <Box
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'linear-gradient(180deg, rgba(10,10,15,0.72), rgba(10,10,15,0.9)), url("/official/ai-members.jpeg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.72,
        }}
      />
      <HeroParallaxLayer />

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{ position: 'relative', zIndex: 2, marginBottom: 24 }}
      >
        <Badge variant="teal" leftSection={<IconMapPin size={13} />}>
          University of Bayreuth · Room S122, GW I
        </Badge>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        style={{ position: 'relative', zIndex: 2, marginBottom: 24 }}
      >
        <Image
          src="/official/bayreuth-ai-logo.png"
          alt="Bayreuth AI Association logo"
          fit="contain"
          style={{
            width: 'min(620px, 88vw)',
            background: 'rgba(255,255,255,0.92)',
            borderRadius: 8,
            padding: 'clamp(12px, 2.4vw, 22px)',
            border: '1px solid rgba(255,255,255,0.18)',
            boxShadow: '0 28px 90px -46px rgba(0,0,0,0.9)',
          }}
        />
      </motion.div>

      <motion.h1
        variants={container}
        initial="hidden"
        animate="show"
        style={{
          fontFamily: 'Space Grotesk, sans-serif',
          fontSize: 'clamp(44px, 9vw, 116px)',
          lineHeight: 0.98,
          letterSpacing: 0,
          fontWeight: 700,
          color: 'var(--color-text)',
          margin: '0 0 28px',
          maxWidth: 1100,
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0 0.28em',
          justifyContent: 'center',
        }}
      >
        {HEADLINE.map((w) => (
          <motion.span key={w} variants={word} style={{ display: 'inline-block' }}>
            {w}
          </motion.span>
        ))}
        <motion.span variants={word} className="gradient-text" style={{ display: 'inline-block' }}>
          {HEADLINE_ACCENT}
        </motion.span>
      </motion.h1>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: reduce ? 0 : 0.5, duration: 0.7 }}
        style={{ position: 'relative', zIndex: 2 }}
      >
        <Stack gap={16} align="center" style={{ marginBottom: 34 }}>
          <Text
            style={{
              color: 'rgba(236,236,242,0.92)',
              maxWidth: 720,
              margin: '0 auto',
              fontSize: 'clamp(16px, 2.2vw, 20px)',
              lineHeight: 1.6,
            }}
          >
            A student-led association at the University of Bayreuth where curiosity meets
            collaboration: hands-on AI projects, practical applications, talks, and open exchange.
          </Text>
          <Group gap={10} justify="center">
            <Badge variant="neon" leftSection={<IconCalendarTime size={13} />}>
              Thursdays · 18:00-19:30
            </Badge>
            <Badge variant="teal">Open to every background</Badge>
          </Group>
        </Stack>

        <Group justify="center" gap={14} style={{ position: 'relative', zIndex: 2 }}>
          <JoinButton size="lg" />
          <PartnerButton size="lg" />
        </Group>
      </motion.div>
    </Box>
  )
}
