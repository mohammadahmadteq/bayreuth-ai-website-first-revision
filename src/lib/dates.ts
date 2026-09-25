export function parseEventDate(iso: string): Date {
  return new Date(/^\d{4}-\d{2}-\d{2}$/.test(iso) ? `${iso}T00:00:00` : iso)
}

export function formatEventDate(iso: string): string {
  return parseEventDate(iso).toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export function splitDate(iso: string, locale = 'en-GB'): { month: string; day: string } {
  const d = parseEventDate(iso)
  if (Number.isNaN(d.getTime())) return { month: '', day: iso }
  return {
    month: d.toLocaleDateString(locale, { month: 'short' }).toUpperCase(),
    day: d.toLocaleDateString(locale, { day: 'numeric' }),
  }
}
