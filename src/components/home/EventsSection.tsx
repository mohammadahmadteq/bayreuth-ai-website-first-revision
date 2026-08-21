import { type FC } from 'react'
import { Box, SimpleGrid, Stack } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import type { EventItem } from '../../types/content'
import { getNextEvent, sortEventsByDate } from '../../lib/utils'
import { MiniMonthCalendar } from '../dates/MiniMonthCalendar'
import { EventCard } from '../dates/EventCard'
import { FeaturedNext } from './FeaturedNext'
import { SectionHeading } from '../ui/SectionHeading'
import { FadeInWhenVisible } from '../ui/FadeInWhenVisible'

interface EventsSectionProps {
  events: EventItem[]
}

/**
 * Desktop: compact month calendar next to the next-up highlight and any
 * further upcoming events. Mobile: the upcoming-events list only, no month
 * grid (per the brief — a full desktop calendar doesn't fit a narrow screen).
 */
export const EventsSection: FC<EventsSectionProps> = ({ events }) => {
  const isMobile = useMediaQuery('(max-width: 767px)')

  const now = new Date()
  const next = getNextEvent(events)
  const rest = sortEventsByDate(events).filter(
    (e) => e.id !== next?.id && new Date(e.date).getTime() >= now.getTime(),
  )
  const calendarMonth = next ? new Date(next.date) : now

  const upcomingList = (
    <Stack gap={16}>
      <FeaturedNext events={events} />
      {rest.map((e, i) => (
        <FadeInWhenVisible key={e.id} delay={i * 0.06}>
          <EventCard event={e} />
        </FadeInWhenVisible>
      ))}
    </Stack>
  )

  return (
    <Box>
      <SectionHeading
        eyebrow="Events & calendar"
        title="What's coming up."
        subtitle="Meetings, talks, and workshops — updated each semester."
      />

      {isMobile ? (
        <Box mt={40}>{upcomingList}</Box>
      ) : (
        <SimpleGrid cols={2} spacing={32} mt={40} style={{ alignItems: 'start' }}>
          <MiniMonthCalendar events={events} month={calendarMonth} />
          {upcomingList}
        </SimpleGrid>
      )}
    </Box>
  )
}
