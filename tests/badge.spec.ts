import { expect, test } from '@playwright/test'

test('badge renders and releases its canvas across route changes', async ({ page }, testInfo) => {
  const errors: string[] = []
  page.on('pageerror', (error) => errors.push(error.message))
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  const badge = page.getByRole('img', { name: /Bayreuth AI Association member badge/ })
  const canvas = badge.locator('canvas')
  await expect(canvas).toHaveCount(1)
  await expect(canvas).toBeVisible()
  await badge.scrollIntoViewIfNeeded()
  await expect.poll(() => canvas.evaluate((element) => element.width)).toBeGreaterThan(0)
  await canvas.screenshot({ path: testInfo.outputPath('badge.png') })

  await page.locator('main').getByRole('link', { name: 'Join Us', exact: true }).first().click()
  await expect(page.getByRole('heading', { name: 'Join the association.' })).toBeVisible()
  await expect(page.locator('canvas')).toHaveCount(0)
  await expect(page.locator('body')).toHaveCSS('cursor', 'auto')
  await page
    .getByRole('navigation')
    .getByRole('link', { name: /^Bayreuth AI Association/ })
    .click()
  await expect(canvas).toHaveCount(1)
  await expect(canvas).toBeVisible()
  expect(errors).toEqual([])
})

test('badge falls back to a photo without WebGL', async ({ page }) => {
  await page.addInitScript(() => {
    HTMLCanvasElement.prototype.getContext = new Proxy(HTMLCanvasElement.prototype.getContext, {
      apply(target, canvas, args) {
        if (args[0] === 'webgl' || args[0] === 'webgl2') return null
        return Reflect.apply(target, canvas, args)
      },
    })
  })
  await page.goto('/')
  await expect(page.locator('canvas')).toHaveCount(0)
  const photo = page.getByRole('img', {
    name: 'a photo of the Bayreuth AI Association members',
    exact: true,
  })
  await expect(photo).toBeVisible()
  await expect
    .poll(() => photo.evaluate((element) => (element as HTMLImageElement).naturalWidth))
    .toBeGreaterThan(0)
})
