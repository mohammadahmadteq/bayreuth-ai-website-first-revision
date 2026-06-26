import { type FC } from 'react'
import { SimpleGrid, Stack, Text } from '@mantine/core'
import {
  IconUsers,
  IconFlag,
  IconCalendarEvent,
  IconWorld,
  IconChartBar,
  type TablerIcon,
} from '@tabler/icons-react'
import type { Stat } from '../../types/content'
import { AnimatedCounter } from '../ui/AnimatedCounter'
import { FadeInWhenVisible } from '../ui/FadeInWhenVisible'

const ICONS: Record<string, TablerIcon> = {
  users: IconUsers,
  flag: IconFlag,
  calendar: IconCalendarEvent,
  globe: IconWorld,
}

interface StatsCounterProps {
  stats: Stat[]
}

/** Horizontal row of animated count-up stats, driven entirely by stats.json. */
export const StatsCounter: FC<StatsCounterProps> = ({ stats }) => {
  return (
    <SimpleGrid cols={{ base: 2, md: 4 }} spacing={{ base: 16, md: 28 }}>
      {stats.map((stat, i) => {
        const Icon = (stat.icon && ICONS[stat.icon]) || IconChartBar
        return (
          <FadeInWhenVisible key={stat.id} delay={i * 0.08}>
            <Stack
              gap={6}
              align="center"
              className="glow-card"
              style={{
                padding: 'clamp(20px, 3vw, 32px) 16px',
                textAlign: 'center',
                height: '100%',
              }}
            >
              <Icon size={24} color="var(--teal)" stroke={1.6} />
              <Text
                style={{
                  fontFamily: 'Space Grotesk, sans-serif',
                  fontSize: 'clamp(34px, 5vw, 52px)',
                  fontWeight: 700,
                  lineHeight: 1.5,
                  color: 'var(--color-text)',
                }}
              >
                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              </Text>
              <Text
                style={{ color: 'var(--color-subtext)', fontSize: 13, letterSpacing: '0.02em' }}
              >
                {stat.label}
              </Text>
            </Stack>
          </FadeInWhenVisible>
        )
      })}
    </SimpleGrid>
  )
}