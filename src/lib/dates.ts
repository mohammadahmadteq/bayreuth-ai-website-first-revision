export function splitDate(iso: string, locale = 'en-GB'): { month: string; day: string } {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return { month: '', day: iso }
  return {
    month: d.toLocaleDateString(locale, { month: 'short' }).toUpperCase(),
    day: d.toLocaleDateString(locale, { day: 'numeric' }),
  }
}
