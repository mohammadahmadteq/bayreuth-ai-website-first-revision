import type { EventItem, CategoryFilter, Timeframe } from '../types/content'

export function sortEventsByDate(events: EventItem[]): EventItem[] {
  return [...events].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
}

/**
 * The next chronological event relative to `now` (defaults to current time).
 * Falls back to the most recent event if none are upcoming.
 */
export function getNextEvent(events: EventItem[], now: Date = new Date()): EventItem | undefined {
  const sorted = sortEventsByDate(events)
  const upcoming = sorted.find((e) => new Date(e.date).getTime() >= now.getTime())
  return upcoming ?? sorted[sorted.length - 1]
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
