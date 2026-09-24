import { expect, test } from '@playwright/test'

test('home page renders the association content', async ({ page }) => {
  await page.goto('/')

  await expect(
    page.getByRole('navigation').getByRole('img', { name: 'Bayreuth AI Association', exact: true }),
  ).toBeVisible()
  await expect(page.getByRole('heading', { name: /Exploring AI\. Together\./ })).toBeVisible()
  await expect(page.getByText('University of Bayreuth · S122, GW I')).toBeVisible()
  await expect(page.getByText('People, projects, and moments from the association.')).toBeVisible()
  await expect(
    page.getByRole('img', { name: 'Bayreuth AI Association members together' }),
  ).toBeVisible()
  await expect(page.getByRole('link', { name: 'Join Us on WhatsApp' })).toHaveAttribute(
    'href',
    /^https:\/\/chat\.whatsapp\.com\//,
  )
})

test('primary navigation works on desktop and mobile', async ({ page, isMobile }) => {
  await page.goto('/')
  await page.locator('main').getByRole('link', { name: 'Join Us', exact: true }).first().click()
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

test('mobile navigation closes after routing', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'mobile-only interaction')

  await page.goto('/')
  await page.getByRole('button', { name: 'Open menu' }).click()
  await page.getByLabel('Menu', { exact: true }).getByRole('link', { name: 'Team' }).click()
  await expect(page).toHaveURL(/\/team$/)
  await expect(page.getByText('Renato Mio').first()).toBeVisible()
  await expect(page.getByLabel('Menu', { exact: true })).not.toBeVisible()
})

test('language preference survives a reload', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'Switch to Deutsch' }).click()
  await expect(page.locator('html')).toHaveAttribute('lang', 'de')
  await page.reload()
  await expect(page.getByRole('button', { name: 'Switch to Deutsch' })).toHaveAttribute(
    'aria-pressed',
    'true',
  )
  await page.getByRole('button', { name: 'Switch to English' }).click()
  await expect(page.locator('html')).toHaveAttribute('lang', 'en')
})

test('legacy dates route redirects and unknown routes recover', async ({ page }) => {
  await page.goto('/dates')
  await expect(page).toHaveURL(/\/meetings$/)
  await expect(page.getByRole('heading', { name: 'Meetings', exact: true })).toBeVisible()
  await page.goto('/missing-page')
  await expect(page.getByText('This page wandered off.')).toBeVisible()
  await page.getByRole('link', { name: 'Back to Home' }).click()
  await expect(page.getByRole('heading', { name: /Exploring AI\. Together\./ })).toBeVisible()
})
