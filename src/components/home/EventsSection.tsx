import { type FC } from 'react'
import { Box, SimpleGrid, Stack } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import type { EventItem } from '../../types/content'
import { getUpcomingEvents } from '../../lib/events'
import { parseEventDate } from '../../lib/dates'
import { useElementHeight } from '../../hooks/useElementHeight'
import { MiniMonthCalendar } from '../dates/MiniMonthCalendar'
import { EventCard } from '../dates/EventCard'
import { FeaturedNext } from './FeaturedNext'
import { SectionHeading } from '../ui/SectionHeading'

interface EventsSectionProps {
  events: EventItem[]
}

// Room around the list for the cards' hover lift and focus rings, which its scroll box would clip.
const BLEED = 4

export const EventsSection: FC<EventsSectionProps> = ({ events }) => {
  const isMobile = useMediaQuery('(max-width: 767px)')
  const [calendarRef, calendarHeight] = useElementHeight<HTMLDivElement>()

  const now = new Date()
  const [next, ...rest] = getUpcomingEvents(events, now)
  const calendarMonth = next ? parseEventDate(next.date) : now

  // Scrolls within the calendar's height, like the list on the Meetings page. The cards don't
  // fade in one by one: inside the box they'd only appear after a delay while scrolling.
  const upcomingList = (
    <Stack
      gap={16}
      className="scroll-panel"
      style={{
        maxHeight: isMobile ? 460 : calendarHeight ? calendarHeight + 2 * BLEED : undefined,
        overflowY: 'auto',
        margin: -BLEED,
        padding: BLEED,
      }}
    >
      <FeaturedNext event={next} />
      {rest.map((e) => (
        <EventCard key={e.id} event={e} />
      ))}
    </Stack>
  )

  return (
    <Box>
      <SectionHeading eyebrow="Events & calendar" title="What's coming up." />

      {isMobile ? (
        <Box mt={40}>{upcomingList}</Box>
      ) : (
        <SimpleGrid cols={2} spacing={32} mt={40} style={{ alignItems: 'start' }}>
          <Box ref={calendarRef}>
            <MiniMonthCalendar events={events} month={calendarMonth} />
          </Box>
          {upcomingList}
        </SimpleGrid>
      )}
    </Box>
  )
}
