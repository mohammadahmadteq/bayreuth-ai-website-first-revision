import { expect, test } from '@playwright/test'

test('projects page shows each project with its status, contributors and press coverage', async ({
  page,
}) => {
  await page.goto('/projects')
  const main = page.locator('main')
  await expect(main.getByRole('heading', { level: 2 })).toHaveText([
    'Kreuzsteinbad pool visitors forecasting',
    'Rebuilding our website with agentic AI',
    'ML4Mensa',
    'Coffee consumption forecasting',
  ])

  const pool = main.getByRole('article').filter({ hasText: 'Kreuzsteinbad pool visitors' })
  await expect(pool.getByText('In progress', { exact: true })).toBeVisible()
  await expect(pool.getByText(/Contributors:.*Simon Reif/)).toBeVisible()

  const website = main.getByRole('article').filter({ hasText: 'Rebuilding our website' })
  await expect(website.getByText('Concluded', { exact: true })).toBeVisible()
  await expect(website.getByText(/Contributors:.*Tizian Küffner/)).toBeVisible()
  const poster = website.getByRole('link', { name: 'Poster (PDF)' })
  await expect(poster).toHaveAttribute('href', /\/projects\/AI_Day_2026_poster_AIAssociation\.pdf$/)
  // The PDF signature proves the file itself is served, not the app's fallback page.
  const response = await page.request.get((await poster.getAttribute('href'))!)
  expect((await response.body()).subarray(0, 4).toString('latin1')).toBe('%PDF')

  const ml4mensa = main.getByRole('article').filter({ hasText: 'ML4Mensa' })
  await expect(ml4mensa.getByText('Concluded', { exact: true })).toBeVisible()
  await expect(ml4mensa.getByText(/Contributors:.*Mohammad Ahmad/)).toBeVisible()
  await expect(
    ml4mensa.getByRole('link', { name: 'Bayreuther Tagblatt (German)' }),
  ).toHaveAttribute('href', /bayreuther-tagblatt\.de/)
  await expect(ml4mensa.getByText('Prizes', { exact: true })).toBeVisible()
  // Newest first; the German LinkedIn post is marked like the German press links.
  const prizes = ml4mensa.getByRole('link', { name: /prize/i })
  await expect(prizes).toHaveText([
    'Sustainability Transfer Prize 2026 of the University of Bayreuth, endowed with €5,000',
    /^First place and audience prize for MetricMeals at the Ideenwettbewerb 2025\/2026,.*\(German\)$/,
  ])
  await expect(prizes.first()).toHaveAttribute(
    'href',
    'https://ubtaktuell.uni-bayreuth.de/en/sustainability-prizes-2026',
  )
  await expect(prizes.last()).toHaveAttribute(
    'href',
    'https://www.linkedin.com/posts/iei-uni-bayreuth_ieiabrunibayreuth-ieiabrbayreuth-riaabrbayreuth-activity-7417886242563997696-kbYt',
  )

  const coffee = main.getByRole('article').filter({ hasText: 'Coffee consumption forecasting' })
  await expect(coffee.getByText('Concluded', { exact: true })).toBeVisible()
  await expect(coffee.getByText(/Frederik Hornung/)).toBeVisible()
})
