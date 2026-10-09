import { type FC } from 'react'
import { Box, Group, Stack, Text } from '@mantine/core'
import { IconCalendarTime, IconMapPin } from '@tabler/icons-react'
import { motion, useReducedMotion } from 'framer-motion'
import { useMediaQuery } from '@mantine/hooks'
import { HeroParallaxLayer } from './HeroParallaxLayer'
import { JoinButton } from '../ui/JoinButton'
import { PartnerButton } from '../ui/PartnerButton'
import { Badge } from '../ui/Badge'
import { asset } from '../../lib/utils'
import { formatEventDate } from '../../lib/dates'
import type { EventItem } from '../../types/content'

export const Hero: FC<{ nextEvent?: EventItem }> = ({ nextEvent }) => {
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
      className="chrome-scope"
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
          // Stretch so the text column can spread its content over the full row.
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
              <Badge variant="teal">Everyone is welcome</Badge>
            </motion.div>

            <motion.h1
              variants={item}
              style={{
                fontFamily: '"Source Sans 3", sans-serif',
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
              <span style={{ color: 'var(--teal)' }}>Together.</span>
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
                  <span>{nextEvent?.location ?? 'University of Bayreuth'}</span>
                </Group>
                <Group gap={6} wrap="nowrap">
                  <IconCalendarTime size={16} />
                  <span>
                    {nextEvent
                      ? `${formatEventDate(nextEvent.date)} · ${nextEvent.time}`
                      : 'New dates coming soon'}
                  </span>
                </Group>
              </Group>
            </motion.div>
          </Stack>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: reduce ? 1 : 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: reduce ? 0 : 0.25, ease: [0.2, 0, 0, 1] }}
          // Centred rather than stretched: filling the taller text row would crop
          // the people at both ends of the group off the photo.
          style={{ alignSelf: 'center', width: '100%' }}
        >
          <img
            src={asset('/official/ai-assoc-group.jpg')}
            alt="Group photo of Bayreuth AI Association members on the campus steps"
            width={1400}
            height={1256}
            // Largest element above the fold, so fetch it ahead of other images.
            fetchPriority="high"
            style={{
              display: 'block',
              width: '100%',
              height: 'auto',
              borderRadius: 20,
              border: '1px solid rgba(var(--teal-rgb), 0.4)',
              boxShadow: '0 0 36px rgba(var(--teal-rgb), 0.25)',
            }}
          />
        </motion.div>
      </Box>
    </Box>
  )
}
