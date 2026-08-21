import { type FC } from 'react'
import { Box, Group, Stack, Text } from '@mantine/core'
import type { EventItem } from '../../types/content'

interface MiniMonthCalendarProps {
  events: EventItem[]
  /** Month to display; defaults to the current month. */
  month?: Date
}

const WEEKDAY_LABELS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']

/** Monday-first day-of-week index (0 = Monday) for a given date. */
function mondayIndex(d: Date): number {
  return (d.getDay() + 6) % 7
}

/**
 * Compact, self-built month grid — deliberately plain (no external calendar
 * library) so it reads as part of the site's own design system rather than
 * an embedded widget. Marks days that have an event; today gets a ring.
 */
export const MiniMonthCalendar: FC<MiniMonthCalendarProps> = ({ events, month = new Date() }) => {
  const year = month.getFullYear()
  const monthIndex = month.getMonth()
  const today = new Date()
  const isCurrentMonth = today.getFullYear() === year && today.getMonth() === monthIndex

  const firstOfMonth = new Date(year, monthIndex, 1)
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate()
  const leadingBlanks = mondayIndex(firstOfMonth)

  const eventDays = new Set(
    events
      .filter((e) => {
        const d = new Date(e.date)
        return d.getFullYear() === year && d.getMonth() === monthIndex
      })
      .map((e) => new Date(e.date).getDate()),
  )

  const cells: Array<number | null> = [
    ...Array.from({ length: leadingBlanks }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]

  return (
    <Stack gap={16} className="glow-card" style={{ padding: 'clamp(20px, 2.5vw, 28px)' }}>
      <Text
        ff='"Source Sans 3", sans-serif'
        fw={600}
        fz={15}
        style={{ color: 'var(--color-text)' }}
      >
        {month.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}
      </Text>

      <Box style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
        {WEEKDAY_LABELS.map((w) => (
          <Text
            key={w}
            fz={11}
            fw={600}
            style={{ color: 'var(--color-subtext)', textAlign: 'center', opacity: 0.7 }}
          >
            {w}
          </Text>
        ))}
        {cells.map((day, i) => {
          if (day === null) return <Box key={`blank-${i}`} />
          const hasEvent = eventDays.has(day)
          const isToday = isCurrentMonth && day === today.getDate()
          return (
            <Group
              key={day}
              justify="center"
              align="center"
              style={{
                aspectRatio: '1 / 1',
                borderRadius: 6,
                fontSize: 12.5,
                color: hasEvent ? '#04140f' : 'var(--color-text)',
                background: hasEvent ? 'var(--teal)' : 'transparent',
                border: isToday && !hasEvent ? '1px solid var(--teal)' : '1px solid transparent',
                fontWeight: hasEvent ? 700 : 400,
              }}
            >
              {day}
            </Group>
          )
        })}
      </Box>
    </Stack>
  )
}
