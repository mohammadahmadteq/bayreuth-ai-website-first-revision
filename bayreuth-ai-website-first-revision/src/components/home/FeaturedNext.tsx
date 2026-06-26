import { type FC } from 'react'
import { Link } from 'react-router-dom'
import { Box, Group, Stack, Text } from '@mantine/core'
import { IconCalendarEvent, IconClock, IconMapPin, IconArrowRight } from '@tabler/icons-react'
import type { EventItem } from '../../types/content'
import { getNextEvent, splitDate } from '../../lib/utils'
import { FadeInWhenVisible } from '../ui/FadeInWhenVisible'
import { Badge } from '../ui/Badge'

interface FeaturedNextProps {
  events: EventItem[]
}

/** Highlights the next chronological event, computed from events.json. */
export const FeaturedNext: FC<FeaturedNextProps> = ({ events }) => {
  const next = getNextEvent(events)

  if (!next) {
    return (
      <Box className="glow-card" style={{ padding: 32, textAlign: 'center' }}>
        <Text style={{ color: 'var(--color-subtext)' }}>
          No upcoming events scheduled yet — check back soon.
        </Text>
      </Box>
    )
  }

  const { month, day } = splitDate(next.date)

  return (
    <FadeInWhenVisible>
      <Box
        component={Link}
        to="/dates"
        className="glow-card glow-card--lift"
        style={{
          display: 'block',
          padding: 'clamp(22px, 3vw, 34px)',
          textDecoration: 'none',
          overflow: 'hidden',
        }}
      >
        <Group justify="space-between" align="flex-start" mb={18} wrap="nowrap">
          <Badge
            variant="neon"
            leftSection={
              <span
                className="live-dot"
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: 99,
                  background: 'var(--neon)',
                  display: 'inline-block',
                }}
              />
            }
          >
            Next up
          </Badge>
          <IconArrowRight size={20} color="var(--teal)" />
        </Group>

        <Group align="center" gap={22} wrap="nowrap">
          {/* Date block */}
          <Stack
            gap={0}
            align="center"
            justify="center"
            style={{
              minWidth: 76,
              padding: '12px 8px',
              borderRadius: 14,
              background: 'rgba(45,224,200,0.08)',
              border: '1px solid rgba(45,224,200,0.2)',
            }}
          >
            <Text
              ff="Space Grotesk, sans-serif"
              fw={700}
              fz={12}
              style={{ color: 'var(--teal)', letterSpacing: '0.1em' }}
            >
              {month}
            </Text>
            <Text
              ff="Space Grotesk, sans-serif"
              fw={700}
              fz={30}
              style={{ color: 'var(--color-text)', lineHeight: 1 }}
            >
              {day}
            </Text>
          </Stack>

          <Stack gap={8} style={{ minWidth: 0 }}>
            <Text
              fw={700}
              ff="Space Grotesk, sans-serif"
              fz="clamp(18px, 2.4vw, 24px)"
              style={{ color: 'var(--color-text)' }}
            >
              {next.title}
            </Text>
            <Group gap={18} wrap="wrap">
              <Group gap={6}>
                <IconClock size={15} color="var(--color-subtext)" />
                <Text fz={13} style={{ color: 'var(--color-subtext)' }}>
                  {next.time}
                </Text>
              </Group>
              <Group gap={6} wrap="nowrap">
                <IconMapPin size={15} color="var(--color-subtext)" style={{ flexShrink: 0 }} />
                <Text fz={13} style={{ color: 'var(--color-subtext)' }} lineClamp={1}>
                  {next.location}
                </Text>
              </Group>
              <Group gap={6}>
                <IconCalendarEvent size={15} color="var(--color-subtext)" />
                <Text fz={13} tt="capitalize" style={{ color: 'var(--color-subtext)' }}>
                  {next.category}
                </Text>
              </Group>
            </Group>
          </Stack>
        </Group>
      </Box>
    </FadeInWhenVisible>
  )
}
