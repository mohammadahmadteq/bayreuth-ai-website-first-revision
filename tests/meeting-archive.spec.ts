import { readFileSync } from 'node:fs'
import { expect, test } from '@playwright/test'
import { parseMeetingArchive } from '../src/lib/meetingArchive'

test('every line of the meeting archive parses', () => {
  const markdown = readFileSync(new URL('../src/data/meeting-archive.md', import.meta.url), 'utf8')
  const { tracks, problems } = parseMeetingArchive(markdown)
  expect(problems).toEqual([])
  expect(tracks.map((track) => track.title)).toEqual([
    'Guest talks and technical sessions',
    'Community meetings, socials and workshops',
  ])
})

test('archive entries are sorted and grouped by their own date', () => {
  const { tracks, problems } = parseMeetingArchive(
    [
      '<!--',
      '- **Month DD, YYYY:** Title — Speaker',
      '-->',
      '# Talks',
      '## 🗓️ 2024',
      '* **July 2, 2024:** Scikit-learn "on steroids" — Andreas Karasenko',
      '- **May 07, 2024:** Getting started — Andreas Karasenko (part of a lecture series)',
      '- **June 03, 2025:** AI Stammtisch - June Edition',
      '- **February 30, 2024:** A day that does not exist',
      'Loose text',
      '# A track without entries',
    ].join('\n'),
  )
  expect(tracks).toEqual([
    {
      title: 'Talks',
      years: [
        {
          year: 2024,
          entries: [
            {
              date: '2024-05-07',
              title: 'Getting started',
              speaker: 'Andreas Karasenko (part of a lecture series)',
            },
            {
              date: '2024-07-02',
              title: 'Scikit-learn "on steroids"',
              speaker: 'Andreas Karasenko',
            },
          ],
        },
        // Listed under 2024 by mistake; a plain hyphen does not start a speaker.
        { year: 2025, entries: [{ date: '2025-06-03', title: 'AI Stammtisch - June Edition' }] },
      ],
    },
  ])
  expect(problems).toEqual([
    'line 8: dated 2025 but listed under 2024',
    'line 9: not a date: February 30, 2024',
    'line 10: not an entry: Loose text',
  ])
})

test('meetings page shows the archive by track and year', async ({ page }) => {
  await page.goto('/meetings')
  await expect(page.getByRole('heading', { name: 'What has happened so far.' })).toBeVisible()

  const talksTab = 'Guest talks and technical sessions'
  const talks = page.getByRole('tabpanel', { name: talksTab })
  await expect(page.getByRole('tab', { name: talksTab })).toHaveAttribute('aria-selected', 'true')
  await expect(talks.getByRole('heading', { name: '2024' })).toBeVisible()
  await expect(talks.getByText('Basics of PyTorch')).toBeVisible()
  await expect(talks.locator('time[datetime="2024-06-04"]')).toHaveText('4 June')

  const communityTab = 'Community meetings, socials and workshops'
  await page.getByRole('tab', { name: communityTab }).click()
  await expect(
    page.getByRole('tabpanel', { name: communityTab }).getByText('Winterdorf Social Outing'),
  ).toBeVisible()
  await expect(talks).toBeHidden()
})
