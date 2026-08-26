import { useMemo, useState } from 'react'
import type { EventCategory, EventItem } from '../types/content'

export type CategoryFilter = 'all' | EventCategory
export type Timeframe = 'all' | 'upcoming' | 'month' | 'past'

interface UseEventFilterResult {
  category: CategoryFilter
  setCategory: (value: CategoryFilter) => void
  timeframe: Timeframe
  setTimeframe: (value: Timeframe) => void
  filteredEvents: EventItem[]
}

function matchesTimeframe(event: EventItem, timeframe: Timeframe, now: Date): boolean {
  const date = new Date(event.date)
  switch (timeframe) {
    case 'upcoming':
      return date.getTime() >= now.getTime()
    case 'past':
      return date.getTime() < now.getTime()
    case 'month':
      return date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth()
    default:
      return true
  }
}

/** Category + timeframe filter state for the meetings list, kept out of the UI layer. */
export function useEventFilter(events: EventItem[]): UseEventFilterResult {
  const [category, setCategory] = useState<CategoryFilter>('all')
  const [timeframe, setTimeframe] = useState<Timeframe>('all')

  const filteredEvents = useMemo(() => {
    const now = new Date()
    return events.filter(
      (e) =>
        (category === 'all' || e.category === category) && matchesTimeframe(e, timeframe, now),
    )
  }, [events, category, timeframe])

  return { category, setCategory, timeframe, setTimeframe, filteredEvents }
}
