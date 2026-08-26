import { type FC, type CSSProperties } from 'react'
import { Box, Stack, Text } from '@mantine/core'
import type { EventItem } from '../../types/content'
import { sortEventsByDate } from '../../lib/utils'
import { EventListRow } from './EventListRow'

interface UpcomingEventsPanelProps {
  events: EventItem[]
  /** Total before filtering — shown in the footer count. */
  totalCount: number
  title: string
  selectedId?: string
  onSelect: (event: EventItem) => void
  /**
   * Caps the whole panel (heading + card) so it never grows past the calendar
   * column; the row list absorbs the difference by scrolling.
   */
  maxHeight?: CSSProperties['maxHeight']
}

export const UpcomingEventsPanel: FC<UpcomingEventsPanelProps> = ({
  events,
  totalCount,
  title,
  selectedId,
  onSelect,
  maxHeight,
}) => {
  const sorted = sortEventsByDate(events)

  return (
    <Stack gap={12} style={{ maxHeight, minHeight: 0 }}>
      <Text
        fz={12}
        fw={700}
        tt="uppercase"
        style={{ letterSpacing: '0.12em', color: 'var(--color-subtext)', flex: '0 0 auto' }}
      >
        {title}
      </Text>

      <Box
        className="glow-card"
        style={{
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          flex: '1 1 auto',
          minHeight: 0,
        }}
      >
        <Box
          className="scroll-panel"
          style={{
            flex: '1 1 auto',
            minHeight: 0,
            overflowY: 'auto',
            overscrollBehavior: 'contain',
          }}
        >
          {sorted.length === 0 ? (
            <Text style={{ color: 'var(--color-subtext)', textAlign: 'center', padding: 40 }}>
              No dates match this filter yet — check back soon.
            </Text>
          ) : (
            sorted.map((event, i) => (
              <Box
                key={event.id}
                style={{ borderTop: i === 0 ? 'none' : '1px solid var(--border)' }}
              >
                <EventListRow event={event} active={event.id === selectedId} onSelect={onSelect} />
              </Box>
            ))
          )}
        </Box>

        <Box
          style={{
            flex: '0 0 auto',
            borderTop: '1px solid var(--border)',
            padding: '13px 18px',
            background: 'var(--color-surface)',
          }}
        >
          <Text fz={13} fw={600} style={{ color: 'var(--color-subtext)' }}>
            Showing {sorted.length} of {totalCount} dates
          </Text>
        </Box>
      </Box>
    </Stack>
  )
}
