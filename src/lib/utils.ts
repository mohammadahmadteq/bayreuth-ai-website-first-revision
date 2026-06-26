import type { EventItem } from '../types/content'

/** Join class names, dropping falsy values. */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(' ')
}

/** Format an ISO date string as e.g. "9 Jul 2026". */
export function formatDate(iso: string, locale = 'en-GB'): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString(locale, { day: 'numeric', month: 'short', year: 'numeric' })
}

/** Format an ISO date as a short month + day, e.g. { month: "JUL", day: "9" }. */
export function splitDate(iso: string, locale = 'en-GB'): { month: string; day: string } {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return { month: '', day: iso }
  return {
    month: d.toLocaleDateString(locale, { month: 'short' }).toUpperCase(),
    day: d.toLocaleDateString(locale, { day: 'numeric' }),
  }
}

/** Chronologically sorted copy (ascending) of events. */
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
