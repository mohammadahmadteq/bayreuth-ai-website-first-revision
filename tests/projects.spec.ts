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

  const coffee = main.getByRole('article').filter({ hasText: 'Coffee consumption forecasting' })
  await expect(coffee.getByText('Concluded', { exact: true })).toBeVisible()
  await expect(coffee.getByText(/Frederik Hornung/)).toBeVisible()
})
