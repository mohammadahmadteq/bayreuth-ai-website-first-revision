import { expect, test } from '@playwright/test'
import { photoThumbnail } from '../src/lib/photos'

test('community photos use their small copy in the strip', () => {
  expect(photoThumbnail('/official/community/2024-12-winterdorf-social.jpg')).toBe(
    '/official/community/2024-12-winterdorf-social-sm.jpg',
  )
  // Already small, outside the folder, or uploaded through the portal: unchanged.
  for (const url of [
    '/official/community/2024-12-winterdorf-social-sm.jpg',
    '/official/ai-members.jpeg',
    'https://example.supabase.co/storage/v1/object/public/site-images/photo.jpg',
  ]) {
    expect(photoThumbnail(url)).toBe(url)
  }
})

test.describe('community photo strip', () => {
  // A moving strip never holds still long enough for a stable click.
  test.use({ contextOptions: { reducedMotion: 'reduce' } })

  test('opens a photo enlarged, with the caption and close button on the photo', async ({
    page,
  }) => {
    const caption = 'Social at the Bayreuther Winterdorf, December 2024'
    const open = page.getByRole('button', { name: `Open photo: ${caption}` })
    await page.goto('/')
    await open.click()

    const dialog = page.getByRole('dialog', { name: caption })
    const photo = dialog.getByRole('img', { name: caption })
    await expect(photo).toHaveAttribute(
      'src',
      /\/official\/community\/2024-12-winterdorf-social\.jpg$/,
    )
    await expect
      .poll(() => photo.evaluate((img) => (img as HTMLImageElement).naturalWidth))
      .toBeGreaterThan(0)

    // No title band: the dialog's edges are the photo's, and the close button sits on it.
    const close = dialog.getByRole('button', { name: 'Close photo' })
    const [frame, image, button] = await Promise.all([
      dialog.boundingBox(),
      photo.boundingBox(),
      close.boundingBox(),
    ])
    expect(Math.abs(image!.y - frame!.y)).toBeLessThan(1)
    expect(Math.abs(image!.height - frame!.height)).toBeLessThan(1)
    expect(button!.y).toBeGreaterThan(image!.y)
    expect(button!.x + button!.width).toBeLessThan(image!.x + image!.width)

    await close.click()
    await expect(dialog).toBeHidden()
    await open.click()
    await expect(dialog).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(dialog).toBeHidden()
  })
})
