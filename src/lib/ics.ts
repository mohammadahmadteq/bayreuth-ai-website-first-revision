import type { EventItem } from '../types/content'

/** Escape a value for an iCalendar text field (RFC 5545 §3.3.11). */
function escapeText(value: string): string {
  return value
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n')
}

function pad(n: number): string {
  return String(n).padStart(2, '0')
}

/** "2026-07-09" + "18:00" → "20260709T180000" (floating local time — no TZ conversion). */
function toICSStamp(isoDate: string, clock: string): string {
  const [y, m, d] = isoDate.split('-').map(Number)
  const [hh, mm] = clock.split(':').map(Number)
  return `${y}${pad(m)}${pad(d)}T${pad(hh)}${pad(mm)}00`
}

/**
 * Event times are authored as "18:00-19:30" (occasionally with an en dash).
 * Falls back to a one-hour slot when no end time is given.
 */
function splitTimeRange(time: string): { start: string; end: string } {
  const [rawStart, rawEnd] = time.split(/[-–—]/).map((s) => s.trim())
  const start = /^\d{1,2}:\d{2}$/.test(rawStart ?? '') ? rawStart : '18:00'
  if (rawEnd && /^\d{1,2}:\d{2}$/.test(rawEnd)) return { start, end: rawEnd }
  const [hh, mm] = start.split(':').map(Number)
  return { start, end: `${pad((hh + 1) % 24)}:${pad(mm)}` }
}

function toVEvent(event: EventItem, stamp: string): string[] {
  const { start, end } = splitTimeRange(event.time)
  return [
    'BEGIN:VEVENT',
    `UID:${event.id}@bayreuth-ai-association`,
    `DTSTAMP:${stamp}`,
    `DTSTART:${toICSStamp(event.date, start)}`,
    `DTEND:${toICSStamp(event.date, end)}`,
    `SUMMARY:${escapeText(event.title)}`,
    `DESCRIPTION:${escapeText(event.description)}`,
    `LOCATION:${escapeText(event.location)}`,
    'END:VEVENT',
  ]
}

export function buildICS(events: EventItem[]): string {
  const now = new Date()
  const stamp = `${now.getUTCFullYear()}${pad(now.getUTCMonth() + 1)}${pad(now.getUTCDate())}T${pad(
    now.getUTCHours(),
  )}${pad(now.getUTCMinutes())}${pad(now.getUTCSeconds())}Z`

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Bayreuth AI Association//Events//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    ...events.flatMap((e) => toVEvent(e, stamp)),
    'END:VCALENDAR',
  ].join('\r\n')
}

export function downloadICS(events: EventItem[], filename: string): void {
  const blob = new Blob([buildICS(events)], { type: 'text/calendar;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename.endsWith('.ics') ? filename : `${filename}.ics`
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}
