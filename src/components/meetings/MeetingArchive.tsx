import { type FC } from 'react'
import { Stack, Tabs } from '@mantine/core'
import { SectionHeading } from '../ui/SectionHeading'
import { formatDayMonth } from '../../lib/dates'
import type { ArchiveTrack } from '../../types/content'

export const MeetingArchive: FC<{ tracks: ArchiveTrack[] }> = ({ tracks }) => {
  if (tracks.length === 0) return null

  return (
    <Stack gap={28}>
      <SectionHeading eyebrow="Archive" title="What has happened so far." />

      <Tabs defaultValue="0" unstyled classNames={{ list: 'archive-tabs', tab: 'archive-tab' }}>
        <Tabs.List>
          {tracks.map((track, index) => (
            <Tabs.Tab key={track.title} value={String(index)}>
              {track.title}
            </Tabs.Tab>
          ))}
        </Tabs.List>

        {tracks.map((track, index) => (
          <Tabs.Panel key={track.title} value={String(index)}>
            <div className="archive-years">
              {track.years.map(({ year, entries }) => (
                <div key={year}>
                  <h3 className="archive-year__label">{year}</h3>
                  <ol className="archive-year__list">
                    {entries.map((entry) => (
                      <li key={`${entry.date} ${entry.title}`}>
                        <time dateTime={entry.date}>{formatDayMonth(entry.date)}</time>
                        <p className="archive-entry__title">{entry.title}</p>
                        {entry.speaker && <p className="archive-entry__speaker">{entry.speaker}</p>}
                      </li>
                    ))}
                  </ol>
                </div>
              ))}
            </div>
          </Tabs.Panel>
        ))}
      </Tabs>
    </Stack>
  )
}
