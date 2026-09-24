import { useMemo, useState } from 'react'
import type { CategoryFilter, EventItem, Timeframe } from '../types/content'
import { filterEvents } from '../lib/events'

interface UseEventFilterResult {
  category: CategoryFilter
  setCategory: (value: CategoryFilter) => void
  timeframe: Timeframe
  setTimeframe: (value: Timeframe) => void
  filteredEvents: EventItem[]
}

export function useEventFilter(events: EventItem[]): UseEventFilterResult {
  const [category, setCategory] = useState<CategoryFilter>('all')
  const [timeframe, setTimeframe] = useState<Timeframe>('all')

  const filteredEvents = useMemo(
    () => filterEvents(events, category, timeframe, new Date()),
    [events, category, timeframe],
  )

  return { category, setCategory, timeframe, setTimeframe, filteredEvents }
}
