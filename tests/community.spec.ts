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

  test('opens a photo enlarged with its caption and closes on Escape', async ({ page }) => {
    const caption = 'Social at the Bayreuther Winterdorf, December 2024'
    await page.goto('/')
    await page.getByRole('button', { name: `Open photo: ${caption}` }).click()

    const dialog = page.getByRole('dialog', { name: caption })
    await expect(dialog.getByRole('img', { name: caption })).toHaveAttribute(
      'src',
      /\/official\/community\/2024-12-winterdorf-social\.jpg$/,
    )
    await page.keyboard.press('Escape')
    await expect(dialog).toBeHidden()
  })
})
