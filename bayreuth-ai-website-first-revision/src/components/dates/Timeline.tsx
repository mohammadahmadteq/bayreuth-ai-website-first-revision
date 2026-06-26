import { type FC, useRef } from 'react'
import { Box, Stack, Text } from '@mantine/core'
import { motion, useScroll, useSpring, useReducedMotion } from 'framer-motion'
import type { EventItem } from '../../types/content'
import { sortEventsByDate } from '../../lib/utils'
import { EventCard } from './EventCard'
import { FadeInWhenVisible } from '../ui/FadeInWhenVisible'

interface TimelineProps {
  events: EventItem[]
}

/** Vertical timeline with a scroll-linked progress line, sorted chronologically. */
export const Timeline: FC<TimelineProps> = ({ events }) => {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 60%', 'end 60%'],
  })
  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 })

  if (events.length === 0) {
    return (
      <Text style={{ color: 'var(--color-subtext)', textAlign: 'center', padding: 48 }}>
        No dates on the calendar yet — new events are added each semester.
      </Text>
    )
  }

  const sorted = sortEventsByDate(events)

  return (
    <Box ref={ref} style={{ position: 'relative', paddingLeft: 36 }}>
      {/* Track */}
      <Box
        style={{
          position: 'absolute',
          left: 11,
          top: 6,
          bottom: 6,
          width: 2,
          background: 'var(--border)',
        }}
      />
      {/* Progress overlay */}
      <motion.div
        style={{
          position: 'absolute',
          left: 11,
          top: 6,
          bottom: 6,
          width: 2,
          originY: 0,
          scaleY: reduce ? 1 : scaleY,
          background: 'linear-gradient(to bottom, var(--teal), var(--neon))',
        }}
      />

      <Stack gap={20}>
        {sorted.map((event, i) => (
          <Box key={event.id} style={{ position: 'relative' }}>
            {/* Node */}
            <Box
              style={{
                position: 'absolute',
                left: -36,
                top: 24,
                width: 24,
                height: 24,
                marginLeft: 0,
                transform: 'translateX(0)',
              }}
            >
              <Box
                style={{
                  position: 'absolute',
                  left: 4,
                  width: 16,
                  height: 16,
                  borderRadius: '50%',
                  background: 'var(--color-bg)',
                  border: `2px solid ${event.isFeatured ? 'var(--neon)' : 'var(--teal)'}`,
                  boxShadow: event.isFeatured ? '0 0 12px rgba(57,255,106,0.5)' : 'none',
                }}
              />
            </Box>
            <FadeInWhenVisible delay={i * 0.04} y={16}>
              <EventCard event={event} />
            </FadeInWhenVisible>
          </Box>
        ))}
      </Stack>
    </Box>
  )
}
