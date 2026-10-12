import { expect, test } from '@playwright/test'

test('home page renders the association content', async ({ page }) => {
  // Fixed between the Mensaabend and the kick-off, so the next event is stable.
  await page.clock.setFixedTime(new Date('2026-10-13T12:00:00Z'))
  await page.goto('/')

  await expect(
    page.getByRole('navigation').getByRole('img', { name: 'Bayreuth AI Association', exact: true }),
  ).toBeVisible()
  await expect(page.getByRole('heading', { name: /Exploring AI\. Together\./ })).toBeVisible()
  const heroPhoto = page.getByRole('img', { name: /^Group photo of Bayreuth AI Association/ })
  await expect(heroPhoto).toBeVisible()
  await expect
    .poll(() => heroPhoto.evaluate((img) => (img as HTMLImageElement).naturalWidth))
    .toBeGreaterThan(0)
  await expect(
    page.getByText('Room S93, GW I - University of Bayreuth', { exact: true }).first(),
  ).toBeVisible()
  await expect(page.getByText('Moments from our meetings, socials and events.')).toBeVisible()
  // The strip renders its photos twice for the loop; only one set is exposed.
  await expect(page.getByRole('button', { name: /^Open photo:/ })).toHaveCount(11)
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

test.describe('with a German browser', () => {
  test.use({ locale: 'de-DE' })

  test('the site stays in English', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('html')).toHaveAttribute('lang', 'en')
    await expect(page.getByRole('button', { name: /^Switch to/ })).toHaveCount(0)
  })
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
