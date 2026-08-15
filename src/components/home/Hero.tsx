import { type FC, Suspense, lazy } from 'react'
import { Box, Group, Stack, Text } from '@mantine/core'
import { IconCalendarTime, IconMapPin, IconSparkles } from '@tabler/icons-react'
import { motion, useReducedMotion } from 'framer-motion'
import { useMediaQuery } from '@mantine/hooks'
import { HeroParallaxLayer } from './HeroParallaxLayer'

// Lazy so three.js stays out of the main bundle
const Logo3DCard = lazy(() =>
  import('./Logo3DCard').then((m) => ({ default: m.Logo3DCard })),
)
import { JoinButton } from '../ui/JoinButton'
import { PartnerButton } from '../ui/PartnerButton'
import { Badge } from '../ui/Badge'
import { asset } from '../../lib/utils'

export const Hero: FC = () => {
  const reduce = useReducedMotion()
  const isMobile = useMediaQuery('(max-width: 767px)')

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: reduce ? 0 : 0.1, delayChildren: 0.05 } },
  }
  const item = {
    hidden: { opacity: 0, y: reduce ? 0 : 18 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.2, 0, 0, 1] as const } },
  }

  return (
    <Box
      component="section"
      className="noise-bg chrome-scope"
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'flex-start',
        overflow: 'hidden',
        padding: isMobile ? '32px 24px 56px' : '40px 24px 72px',
      }}
    >
      <div className="hero-gradient-bg" aria-hidden="true" />
      <HeroParallaxLayer />

      <Box
        style={{
          position: 'relative',
          zIndex: 2,
          width: '100%',
          maxWidth: 1280,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'minmax(0, 1.15fr) minmax(0, 0.85fr)',
          gap: 'clamp(40px, 4vw, 64px)',
          // Stretch so the badge column matches the text column's height and
          // the two bottom edges land on the same line.
          alignItems: isMobile ? 'center' : 'stretch',
          minHeight: isMobile ? undefined : 'min(66vh, 600px)',
        }}
      >
        <motion.div variants={container} initial="hidden" animate="show" style={{ height: '100%' }}>
          <Stack
            gap={0}
            align={isMobile ? 'center' : 'flex-start'}
            justify={isMobile ? 'flex-start' : 'space-between'}
            style={{ height: '100%' }}
          >
            <motion.div variants={item} style={{ marginBottom: 20 }}>
              <Badge variant="teal" leftSection={<IconSparkles size={13} />}>
                Everyone is welcome
              </Badge>
            </motion.div>

            <motion.h1
              variants={item}
              style={{
                fontFamily: 'Space Grotesk, sans-serif',
                fontSize: 'clamp(48px, 8vw, 112px)',
                lineHeight: 1.0,
                fontWeight: 700,
                color: 'var(--color-text)',
                margin: '0 0 28px',
                textAlign: isMobile ? 'center' : 'left',
              }}
            >
              Exploring AI.
              <br />
              <span className="gradient-text">Together.</span>
            </motion.h1>

            <motion.div variants={item}>
              <Text
                style={{
                  color: 'var(--hero-subtext)',
                  maxWidth: 560,
                  fontSize: 'clamp(17px, 1.7vw, 23px)',
                  lineHeight: 1.6,
                  marginBottom: 40,
                  textAlign: isMobile ? 'center' : 'left',
                }}
              >
                Bayreuth&apos;s student-run AI community — hands-on projects, talks, and open
                exchange.
              </Text>
            </motion.div>

            <motion.div variants={item}>
              <Group gap={14} justify={isMobile ? 'center' : 'flex-start'}>
                <JoinButton size="lg" />
                <PartnerButton size="lg" />
              </Group>
            </motion.div>

            <motion.div variants={item} style={{ marginTop: 36 }}>
              <Group
                gap={20}
                justify={isMobile ? 'center' : 'flex-start'}
                style={{ color: 'var(--color-subtext)', fontSize: 14.5 }}
              >
                <Group gap={6} wrap="nowrap">
                  <IconMapPin size={16} />
                  <span>University of Bayreuth · S122, GW I</span>
                </Group>
                <Group gap={6} wrap="nowrap">
                  <IconCalendarTime size={16} />
                  <span>Thursdays · 18:00</span>
                </Group>
              </Group>
            </motion.div>
          </Stack>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: reduce ? 1 : 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: reduce ? 0 : 0.25, ease: [0.2, 0, 0, 1] }}
          style={{ position: 'relative', justifySelf: 'center', width: '100%', height: '100%' }}
        >
          <div className="hero-card-glow" aria-hidden="true" />
          <Box
            style={{
              position: 'relative',
              width: '100%',
              // Fills the stretched grid row on desktop; explicit on mobile
              // where the badge stacks under the text.
              height: isMobile ? 'min(70vh, 540px)' : '100%',
              minHeight: isMobile ? undefined : 460,
              margin: '0 auto',
            }}
          >
            <Suspense fallback={null}>
              <Logo3DCard
                logoSrc={asset('/official/logo.svg')}
                photoSrc={asset('/official/ai-members.jpeg')}
                alt="Bayreuth AI Association member badge"
                photoAlt="a photo of the Bayreuth AI Association members"
              />
            </Suspense>
          </Box>
        </motion.div>
      </Box>
    </Box>
  )
}
