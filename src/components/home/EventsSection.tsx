import { type FC } from 'react'
import { Box, SimpleGrid, Stack } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import type { EventItem } from '../../types/content'
import { getUpcomingEvents } from '../../lib/events'
import { parseEventDate } from '../../lib/dates'
import { MiniMonthCalendar } from '../dates/MiniMonthCalendar'
import { EventCard } from '../dates/EventCard'
import { FeaturedNext } from './FeaturedNext'
import { SectionHeading } from '../ui/SectionHeading'
import { FadeInWhenVisible } from '../ui/FadeInWhenVisible'

interface EventsSectionProps {
  events: EventItem[]
}

export const EventsSection: FC<EventsSectionProps> = ({ events }) => {
  const isMobile = useMediaQuery('(max-width: 767px)')

  const now = new Date()
  const [next, ...rest] = getUpcomingEvents(events, now)
  const calendarMonth = next ? parseEventDate(next.date) : now

  const upcomingList = (
    <Stack gap={16}>
      <FeaturedNext event={next} />
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
