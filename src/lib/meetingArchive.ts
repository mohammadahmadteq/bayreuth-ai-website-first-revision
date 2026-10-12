import type { ArchiveEntry, ArchiveTrack } from '../types/content'

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

// "- **May 07, 2024:** Title — Speaker", with `*` or `-` as the bullet.
const ENTRY = /^[*-]\s+\*\*([A-Za-z]+)\s+(\d{1,2}),\s+(\d{4}):\*\*\s*(.*)$/
const SPEAKER_SEPARATOR = ' — '

export interface ParsedArchive {
  tracks: ArchiveTrack[]
  /** Lines that could not be read as intended, by line number. Empty for a valid file. */
  problems: string[]
}

function toIsoDate(month: string, day: number, year: number): string | null {
  const monthIndex = MONTHS.indexOf(month)
  const date = new Date(Date.UTC(year, monthIndex, day))
  // Rejects unknown month names and days the month does not have.
  if (monthIndex === -1 || date.getUTCDate() !== day) return null
  return date.toISOString().slice(0, 10)
}

/**
 * Reads src/data/meeting-archive.md. Each `#` heading starts a track, `##`
 * headings name the years and each bullet is one meeting. Entries are sorted
 * and grouped by their own date, so a bullet under the wrong year heading still
 * lands in the right place; it is reported in `problems` all the same. HTML
 * comments are skipped, and tracks without entries are left out.
 */
export function parseMeetingArchive(markdown: string): ParsedArchive {
  const drafts: Array<{ title: string; entries: ArchiveEntry[] }> = []
  const problems: string[] = []
  let headingYear: number | null = null
  let inComment = false

  markdown.split(/\r?\n/).forEach((raw, index) => {
    const line = raw.trim()
    const at = `line ${index + 1}`
    if (inComment || line.startsWith('<!--')) {
      inComment = !line.includes('-->')
      return
    }
    if (line === '') return

    if (line.startsWith('## ')) {
      const year = line.match(/\b\d{4}\b/)
      headingYear = year ? Number(year[0]) : null
      if (!year) problems.push(`${at}: year heading without a year`)
      return
    }
    if (line.startsWith('# ')) {
      drafts.push({ title: line.slice(2).trim(), entries: [] })
      headingYear = null
      return
    }

    const match = line.match(ENTRY)
    const draft = drafts.at(-1)
    if (!match || !draft) {
      problems.push(`${at}: not an entry: ${line}`)
      return
    }
    const [, month, day, year, text] = match
    const date = toIsoDate(month, Number(day), Number(year))
    if (!date) {
      problems.push(`${at}: not a date: ${month} ${day}, ${year}`)
      return
    }
    if (headingYear !== null && headingYear !== Number(year)) {
      problems.push(`${at}: dated ${year} but listed under ${headingYear}`)
    }
    const [title, ...speaker] = text.split(SPEAKER_SEPARATOR)
    if (title.trim() === '') {
      problems.push(`${at}: entry without a title`)
      return
    }
    draft.entries.push({
      date,
      title: title.trim(),
      speaker: speaker.join(SPEAKER_SEPARATOR).trim() || undefined,
    })
  })

  const tracks = drafts
    .filter((draft) => draft.entries.length > 0)
    .map(({ title, entries }) => {
      const years: ArchiveTrack['years'] = []
      // ISO dates sort as strings; the sort is stable for meetings on the same day.
      for (const entry of [...entries].sort((a, b) => a.date.localeCompare(b.date))) {
        const year = Number(entry.date.slice(0, 4))
        if (years.at(-1)?.year !== year) years.push({ year, entries: [] })
        years[years.length - 1].entries.push(entry)
      }
      return { title, years }
    })

  return { tracks, problems }
}
