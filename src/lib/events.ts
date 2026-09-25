import type { EventItem, CategoryFilter, Timeframe } from '../types/content'
import { parseEventDate } from './dates'

export function sortEventsByDate(events: EventItem[]): EventItem[] {
  return [...events].sort(
    (a, b) => parseEventDate(a.date).getTime() - parseEventDate(b.date).getTime(),
  )
}

export function getUpcomingEvents(events: EventItem[], now: Date = new Date()): EventItem[] {
  return sortEventsByDate(filterEvents(events, 'all', 'upcoming', now))
}

/**
 * The next chronological event relative to `now` (defaults to current time).
 * Falls back to the most recent event if none are upcoming.
 */
export function getNextEvent(events: EventItem[], now: Date = new Date()): EventItem | undefined {
  const sorted = sortEventsByDate(events)
  const upcoming = getUpcomingEvents(sorted, now)[0]
  return upcoming ?? sorted[sorted.length - 1]
}

function matchesTimeframe(event: EventItem, timeframe: Timeframe, now: Date): boolean {
  const date = parseEventDate(event.date)
  const today = new Date(now)
  today.setHours(0, 0, 0, 0)
  switch (timeframe) {
    case 'upcoming':
      return date.getTime() >= today.getTime()
    case 'past':
      return date.getTime() < today.getTime()
    case 'month':
      return date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth()
    default:
      return true
  }
}

export function filterEvents(
  events: EventItem[],
  category: CategoryFilter,
  timeframe: Timeframe,
  now: Date,
): EventItem[] {
  return events.filter(
    (event) =>
      (category === 'all' || event.category === category) &&
      matchesTimeframe(event, timeframe, now),
  )
}
