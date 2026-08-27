import { type CSSProperties, type FC, useState } from 'react'
import { Box, Group, Stack, Text, UnstyledButton } from '@mantine/core'
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react'
import type { EventItem } from '../../types/content'

interface MiniMonthCalendarProps {
  events: EventItem[]
  /** Month to display initially; defaults to the current month. */
  month?: Date
  /** Called when a day carrying an event is clicked. */
  onSelectDay?: (date: Date) => void
  /** ISO date of the currently highlighted event, if any. */
  selectedDate?: string
}

const WEEKDAY_LABELS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']

/** Monday-first day-of-week index (0 = Monday) for a given date. */
function mondayIndex(d: Date): number {
  return (d.getDay() + 6) % 7
}

function sameMonth(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth()
}

function monthKey(d: Date): string {
  return `${d.getFullYear()}-${d.getMonth()}`
}

/**
 * Compact, self-built month grid — deliberately plain (no external calendar
 * library) so it reads as part of the site's own design system rather than an
 * embedded widget. Days carrying an event get a dot; today gets a filled disc.
 */
export const MiniMonthCalendar: FC<MiniMonthCalendarProps> = ({
  events,
  month,
  onSelectDay,
  selectedDate,
}) => {
  const today = new Date()
  const [viewMonth, setViewMonth] = useState(() => month ?? today)

  // Follow the owning page when it retargets the calendar (e.g. after filtering),
  // while still letting the arrows browse freely from there.
  const targetKey = month ? monthKey(month) : null
  const [lastTargetKey, setLastTargetKey] = useState(targetKey)
  if (month && targetKey !== lastTargetKey) {
    setLastTargetKey(targetKey)
    setViewMonth(month)
  }

  const year = viewMonth.getFullYear()
  const monthIndex = viewMonth.getMonth()
  const isCurrentMonth = sameMonth(today, viewMonth)

  const firstOfMonth = new Date(year, monthIndex, 1)
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate()
  const leadingBlanks = mondayIndex(firstOfMonth)

  const eventDays = new Set(
    events
      .filter((e) => sameMonth(new Date(e.date), viewMonth))
      .map((e) => new Date(e.date).getDate()),
  )

  const selectedDay =
    selectedDate && sameMonth(new Date(selectedDate), viewMonth)
      ? new Date(selectedDate).getDate()
      : undefined

  const cells: Array<number | null> = [
    ...Array.from({ length: leadingBlanks }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]

  const shiftMonth = (delta: number) => setViewMonth(new Date(year, monthIndex + delta, 1))

  return (
    <Stack gap={12} className="glow-card" style={{ padding: 'clamp(16px, 1.8vw, 20px)' }}>
      <Group justify="space-between" align="center" wrap="nowrap">
        <CalendarNavButton label="Previous month" onClick={() => shiftMonth(-1)}>
          <IconChevronLeft size={17} stroke={2} />
        </CalendarNavButton>
        <Text
          ff='"Source Sans 3", sans-serif'
          fw={700}
          fz={16}
          style={{ color: 'var(--color-text)' }}
        >
          {viewMonth.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}
        </Text>
        <CalendarNavButton label="Next month" onClick={() => shiftMonth(1)}>
          <IconChevronRight size={17} stroke={2} />
        </CalendarNavButton>
      </Group>

      <Box style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 3 }}>
        {WEEKDAY_LABELS.map((w) => (
          <Text
            key={w}
            fz={11}
            fw={700}
            tt="uppercase"
            style={{
              color: 'var(--color-subtext)',
              textAlign: 'center',
              letterSpacing: '0.06em',
              opacity: 0.7,
              paddingBottom: 4,
            }}
          >
            {w}
          </Text>
        ))}

        {cells.map((day, i) => {
          if (day === null) return <Box key={`blank-${i}`} />

          const hasEvent = eventDays.has(day)
          const isToday = isCurrentMonth && day === today.getDate()
          const isSelected = day === selectedDay
          const interactive = hasEvent && Boolean(onSelectDay)

          const cellStyle: CSSProperties = {
            position: 'relative',
            height: 38,
            width: 38,
            margin: '0 auto',
            display: 'grid',
            placeItems: 'center',
            borderRadius: '50%',
            fontFamily: '"Source Sans 3", sans-serif',
            fontSize: 13,
            fontWeight: isToday || isSelected ? 700 : 500,
            cursor: interactive ? 'pointer' : 'default',
            color: isToday ? 'var(--on-teal)' : 'var(--color-text)',
            background: isToday ? 'var(--teal)' : 'transparent',
            border: `1px solid ${isSelected && !isToday ? 'var(--teal)' : 'transparent'}`,
            boxShadow: isSelected && isToday ? '0 0 0 3px rgba(var(--teal-rgb),0.25)' : 'none',
            transition: 'background-color 0.18s ease, border-color 0.18s ease',
          }

          const cellContent = (
            <>
              {day}
              {hasEvent && (
                <Box
                  style={{
                    position: 'absolute',
                    bottom: 3,
                    width: 4,
                    height: 4,
                    borderRadius: '50%',
                    background: isToday ? 'var(--on-teal)' : 'var(--teal)',
                  }}
                />
              )}
            </>
          )

          return interactive ? (
            <UnstyledButton
              key={day}
              onClick={() => onSelectDay?.(new Date(year, monthIndex, day))}
              aria-label={`Events on ${day}`}
              style={cellStyle}
            >
              {cellContent}
            </UnstyledButton>
          ) : (
            <Box key={day} style={cellStyle}>
              {cellContent}
            </Box>
          )
        })}
      </Box>

      <Group
        justify="space-between"
        align="center"
        wrap="nowrap"
        gap={12}
        pt={10}
        style={{ borderTop: '1px solid var(--border)' }}
      >
        <Group gap={7} wrap="nowrap">
          <Box style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--teal)' }} />
          <Text fz={12} style={{ color: 'var(--color-subtext)' }}>
            Day with an event
          </Text>
        </Group>
        <Text fz={12} style={{ color: 'var(--color-subtext)', whiteSpace: 'nowrap' }}>
          Today:{' '}
          {today.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
        </Text>
      </Group>
    </Stack>
  )
}

const CalendarNavButton: FC<{
  label: string
  onClick: () => void
  children: React.ReactNode
}> = ({ label, onClick, children }) => (
  <UnstyledButton
    onClick={onClick}
    aria-label={label}
    style={{
      width: 32,
      height: 32,
      borderRadius: '50%',
      display: 'grid',
      placeItems: 'center',
      color: 'var(--color-subtext)',
      border: '1px solid var(--border)',
      transition: 'border-color 0.2s ease, color 0.2s ease',
    }}
  >
    {children}
  </UnstyledButton>
)
