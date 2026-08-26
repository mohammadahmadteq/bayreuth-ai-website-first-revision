import { type FC, useMemo, useState } from 'react'
import { Box, Container, Stack } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import { PageHeader } from '../components/layout/PageHeader'
import { EventFilterBar } from '../components/meetings/EventFilterBar'
import { UpcomingEventsPanel } from '../components/meetings/UpcomingEventsPanel'
import { EventDetailDrawer } from '../components/meetings/EventDetailDrawer'
import { CalendarSubscribeBanner } from '../components/meetings/CalendarSubscribeBanner'
import { MiniMonthCalendar } from '../components/dates/MiniMonthCalendar'
import { FadeInWhenVisible } from '../components/ui/FadeInWhenVisible'
import { ErrorBoundary } from '../components/ErrorBoundary'
import { useEventFilter } from '../hooks/useEventFilter'
import { useElementHeight } from '../hooks/useElementHeight'
import { getNextEvent, sortEventsByDate } from '../lib/utils'
import type { EventItem } from '../types/content'
import { events } from '../data'

export const MeetingsPage: FC = () => {
  const isMobile = useMediaQuery('(max-width: 767px)')
  const { category, setCategory, timeframe, setTimeframe, filteredEvents } = useEventFilter(events)
  const [selected, setSelected] = useState<EventItem | null>(null)
  const [calendarRef, calendarHeight] = useElementHeight<HTMLDivElement>()

  // Open the calendar on whichever month the list currently starts in.
  const calendarMonth = useMemo(() => {
    const anchor = getNextEvent(filteredEvents) ?? sortEventsByDate(filteredEvents)[0]
    return anchor ? new Date(anchor.date) : new Date()
  }, [filteredEvents])

  const listTitle = timeframe === 'past' ? 'Past dates' : 'Upcoming dates'

  const selectDayEvent = (date: Date) => {
    const match = filteredEvents.find((e) => new Date(e.date).toDateString() === date.toDateString())
    if (match) setSelected(match)
  }

  return (
    <>
      <PageHeader
        eyebrow="Meetings"
        title="Meetings"
        subtitle="All upcoming meetings and events at a glance."
      />

      <Container size={1120} px={24} py={{ base: 28, md: 40 }}>
        <ErrorBoundary label="Meetings calendar">
          <Stack gap={20}>
            <EventFilterBar
              category={category}
              onCategoryChange={setCategory}
              timeframe={timeframe}
              onTimeframeChange={setTimeframe}
            />

            <Box
              style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : 'minmax(300px, 1fr) 1.15fr',
                gap: 20,
                alignItems: 'start',
              }}
            >
              <Box ref={calendarRef}>
                <MiniMonthCalendar
                  events={filteredEvents}
                  month={calendarMonth}
                  selectedDate={selected?.date}
                  onSelectDay={selectDayEvent}
                />
              </Box>

              <UpcomingEventsPanel
                events={filteredEvents}
                totalCount={events.length}
                title={listTitle}
                selectedId={selected?.id}
                onSelect={setSelected}
                maxHeight={isMobile ? 460 : calendarHeight}
              />
            </Box>

            <FadeInWhenVisible>
              <CalendarSubscribeBanner events={events} />
            </FadeInWhenVisible>
          </Stack>
        </ErrorBoundary>
      </Container>

      <EventDetailDrawer event={selected} onClose={() => setSelected(null)} />
    </>
  )
}
