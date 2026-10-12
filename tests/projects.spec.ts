import { expect, test } from '@playwright/test'

test('projects page shows both projects with contributors and press coverage', async ({ page }) => {
  await page.goto('/projects')
  const main = page.locator('main')
  await expect(main.getByRole('heading', { level: 2 })).toHaveText([
    'ML4Mensa',
    'Coffee consumption forecasting',
  ])

  const ml4mensa = main.getByRole('article').filter({ hasText: 'ML4Mensa' })
  await expect(ml4mensa.getByText('In progress', { exact: true })).toBeVisible()
  await expect(ml4mensa.getByText(/Contributors:.*Mohammad Ahmad/)).toBeVisible()
  await expect(
    ml4mensa.getByRole('link', { name: 'Bayreuther Tagblatt (German)' }),
  ).toHaveAttribute('href', /bayreuther-tagblatt\.de/)

  const coffee = main.getByRole('article').filter({ hasText: 'Coffee consumption forecasting' })
  await expect(coffee.getByText('Concluded', { exact: true })).toBeVisible()
  await expect(coffee.getByText(/Frederik Hornung/)).toBeVisible()
})
