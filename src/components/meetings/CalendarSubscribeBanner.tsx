import { type FC } from 'react'
import { Box, Group, Stack, Text } from '@mantine/core'
import { IconCalendarPlus, IconCalendarWeek } from '@tabler/icons-react'
import type { EventItem } from '../../types/content'
import { downloadICS } from '../../lib/ics'
import { JoinButton } from '../ui/JoinButton'

interface CalendarSubscribeBannerProps {
  events: EventItem[]
}

/** Full-width strip under the calendar: grab every date as one .ics file. */
export const CalendarSubscribeBanner: FC<CalendarSubscribeBannerProps> = ({ events }) => (
  <Group
    className="glow-card"
    justify="space-between"
    align="center"
    wrap="wrap"
    gap={20}
    style={{ padding: 'clamp(18px, 2.4vw, 24px)' }}
  >
    <Group gap={16} wrap="nowrap" align="center" style={{ minWidth: 0 }}>
      <Box
        style={{
          width: 46,
          height: 46,
          borderRadius: 12,
          flexShrink: 0,
          display: 'grid',
          placeItems: 'center',
          background: 'rgba(var(--teal-rgb),0.1)',
          border: '1px solid rgba(var(--teal-rgb),0.25)',
        }}
      >
        <IconCalendarWeek size={22} color="var(--teal)" stroke={1.7} />
      </Box>
      <Stack gap={3} style={{ minWidth: 0 }}>
        <Text fw={700} fz={17} style={{ color: 'var(--color-text)' }}>
          Stay up to date
        </Text>
        <Text fz={14} style={{ color: 'var(--color-subtext)', lineHeight: 1.5 }}>
          Add our dates to your calendar and never miss an event.
        </Text>
      </Stack>
    </Group>

    <JoinButton
      size="sm"
      withArrow={false}
      onClick={() => downloadICS(events, 'bayreuth-ai-association')}
    >
      <IconCalendarPlus size={17} stroke={2} />
      Add to calendar
    </JoinButton>
  </Group>
)
