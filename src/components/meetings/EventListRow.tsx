import { type FC } from 'react'
import { Box, Group, Stack, Text, UnstyledButton } from '@mantine/core'
import { IconChevronRight, IconClock, IconMapPin } from '@tabler/icons-react'
import type { EventItem } from '../../types/content'
import { Badge } from '../ui/Badge'

interface EventListRowProps {
  event: EventItem
  active: boolean
  onSelect: (event: EventItem) => void
}

/** One row of the meetings list: date block · title + meta · category · chevron. */
export const EventListRow: FC<EventListRowProps> = ({ event, active, onSelect }) => {
  const date = new Date(event.date)
  const day = date.toLocaleDateString('en-GB', { day: '2-digit' })
  const month = date.toLocaleDateString('en-GB', { month: 'short' }).toUpperCase()
  const weekday = date.toLocaleDateString('en-GB', { weekday: 'short' }).toUpperCase()

  return (
    <UnstyledButton
      onClick={() => onSelect(event)}
      className="event-row"
      data-active={active || undefined}
      style={{ display: 'block', width: '100%', padding: '16px 18px' }}
    >
      <Group gap={16} wrap="nowrap" align="center">
        <Stack gap={0} align="center" style={{ minWidth: 42, flexShrink: 0 }}>
          <Text
            ff='"Source Sans 3", sans-serif'
            fw={700}
            fz={22}
            style={{ color: 'var(--color-text)', lineHeight: 1.1 }}
          >
            {day}
          </Text>
          <Text fw={700} fz={10} style={{ color: 'var(--teal)', letterSpacing: '0.08em' }}>
            {month}
          </Text>
          <Text fw={600} fz={10} style={{ color: 'var(--color-subtext)', letterSpacing: '0.08em' }}>
            {weekday}
          </Text>
        </Stack>

        <Stack gap={7} style={{ flex: 1, minWidth: 0 }}>
          <Text
            fw={700}
            ff='"Source Sans 3", sans-serif'
            fz={16}
            style={{ color: 'var(--color-text)', lineHeight: 1.3 }}
            lineClamp={2}
          >
            {event.title}
          </Text>
          <Group gap={16} wrap="wrap">
            <Group gap={5} wrap="nowrap">
              <IconClock size={14} color="var(--color-subtext)" style={{ flexShrink: 0 }} />
              <Text fz={13} style={{ color: 'var(--color-subtext)' }}>
                {event.time}
              </Text>
            </Group>
            <Group gap={5} wrap="nowrap" style={{ minWidth: 0 }}>
              <IconMapPin size={14} color="var(--color-subtext)" style={{ flexShrink: 0 }} />
              <Text fz={13} style={{ color: 'var(--color-subtext)' }} lineClamp={1}>
                {event.location}
              </Text>
            </Group>
          </Group>
          <Box>
            <Badge variant={event.isFeatured ? 'accent' : 'muted'}>{event.category}</Badge>
          </Box>
        </Stack>

        <IconChevronRight
          size={18}
          color="var(--color-subtext)"
          style={{ flexShrink: 0 }}
          stroke={2}
        />
      </Group>
    </UnstyledButton>
  )
}
