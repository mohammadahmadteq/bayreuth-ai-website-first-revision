import { expect, test } from '@playwright/test'

test('home page hydrates and renders the polished official content', async ({ page }) => {
  await page.goto('/')

  await expect(page.getByRole('img', { name: 'Bayreuth AI Association logo' }).first()).toBeVisible()
  await expect(page.getByRole('heading', { name: /Exploring AI\. Together\./ })).toBeVisible()
  await expect(page.getByText('University of Bayreuth · Room S122, GW I')).toBeVisible()
  await expect(page.getByText('People, projects, and moments from the association.')).toBeVisible()
  await expect(page.getByLabel('Bayreuth AI Association photo gallery')).toBeVisible()
  await expect(page.getByTitle('Bayreuth AI Association mailing list form')).toBeVisible()
})

test('primary interactions work after hydration', async ({ page, isMobile }) => {
  await page.goto('/')

  await page.getByRole('button', { name: 'Toggle color scheme' }).click()
  await expect(page.locator('html')).toHaveAttribute('data-mantine-color-scheme', /light|dark/)

  await page.getByRole('link', { name: /Become a Member/ }).first().click()
  await expect(page).toHaveURL(/\/apply$/)
  await expect(page.getByRole('heading', { name: 'Join the association.' })).toBeVisible()

  if (isMobile) {
    await page.getByRole('button', { name: 'Open menu' }).click()
    await page.getByLabel('Menu', { exact: true }).getByRole('link', { name: 'Projects' }).click()
  } else {
    await page.getByRole('navigation').getByRole('link', { name: 'Projects' }).click()
  }
  await expect(page).toHaveURL(/\/projects$/)
  await expect(page.getByText('ML4Mensa')).toBeVisible()
})

test('mobile navigation opens and routes correctly', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'mobile-only interaction')

  await page.goto('/')
  await page.getByRole('button', { name: 'Open menu' }).click()
  await expect(page.getByText('Menu')).toBeVisible()
  await page.getByLabel('Menu', { exact: true }).getByRole('link', { name: 'Team' }).click()
  await expect(page).toHaveURL(/\/team$/)
  await expect(page.getByText('Renato Mio').first()).toBeVisible()
})
