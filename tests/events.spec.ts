import { expect, test } from '@playwright/test'
import { filterEvents, getNextEvent, getUpcomingEvents, sortEventsByDate } from '../src/lib/events'
import type { EventItem } from '../src/types/content'

const past: EventItem = {
  id: 'past',
  title: 'Earlier meeting',
  description: '',
  date: '2026-07-09',
  time: '18:00-19:30',
  location: 'Bayreuth',
  category: 'social',
  isFeatured: false,
}
const next: EventItem = { ...past, id: 'next', date: '2026-10-15', category: 'talk' }
const later: EventItem = { ...past, id: 'later', date: '2026-11-01', category: 'workshop' }
const events = [later, past, next]
const now = new Date('2026-10-01T12:00:00Z')

test('event ordering and selection preserve source data and past-event fallback', () => {
  expect(sortEventsByDate(events)).toEqual([past, next, later])
  expect(events).toEqual([later, past, next])
  expect(getNextEvent(events, now)).toEqual(next)
  expect(getNextEvent(events, new Date('2027-01-01'))).toEqual(later)
  expect(getNextEvent([], now)).toBeUndefined()
})

test('event filters combine category with timeframe', () => {
  expect(filterEvents(events, 'all', 'all', now)).toEqual(events)
  expect(filterEvents(events, 'all', 'upcoming', now)).toEqual([later, next])
  expect(filterEvents(events, 'all', 'past', now)).toEqual([past])
  expect(filterEvents(events, 'all', 'month', now)).toEqual([next])
  expect(filterEvents(events, 'workshop', 'upcoming', now)).toEqual([later])
  expect(filterEvents(events, 'talk', 'past', now)).toEqual([])
})

test('homepage upcoming events exclude past dates and retain events happening today', () => {
  expect(getUpcomingEvents([past], now)).toEqual([])
  expect(getUpcomingEvents([], now)).toEqual([])
  expect(getUpcomingEvents(events, new Date(2026, 9, 15, 12))).toEqual([next, later])
  expect(filterEvents(events, 'all', 'past', new Date(2026, 9, 15, 12))).toEqual([past])
})

test('meetings filters, calendar selection and downloads work together', async ({ page }) => {
  await page.clock.setFixedTime(new Date('2026-09-24T12:00:00Z'))
  await page.goto('/meetings')
  await expect(page.getByText('Showing 2 of 2 dates')).toBeVisible()
  await page.getByRole('button', { name: 'Talks', exact: true }).click()
  await expect(page.getByText('Showing 1 of 2 dates')).toBeVisible()
  await expect(page.getByText('October 2026', { exact: true })).toBeVisible()
  await page.getByRole('button', { name: 'Events on 15', exact: true }).click()
  await expect(page.getByRole('heading', { name: 'Regular AI Association meeting' })).toBeVisible()
  const downloadPromise = page.waitForEvent('download')
  await page.getByRole('dialog').getByRole('button', { name: 'Add to calendar' }).click()
  expect((await downloadPromise).suggestedFilename()).toBe('evt-regular-thursday-meeting.ics')
  await page.keyboard.press('Escape')
  await page.getByRole('button', { name: 'Workshops', exact: true }).click()
  await expect(page.getByText('No dates match this filter yet — check back soon.')).toBeVisible()
})

test('resource search returns results and restores the category view', async ({ page }) => {
  await page.goto('/resources')
  const search = page.getByRole('textbox', { name: 'Search resources' })
  await search.fill('  gradient descent  ')
  await expect(
    page.getByRole('link', { name: /Neural networks and gradient descent/ }),
  ).toBeVisible()
  await search.fill('no-such-resource-123')
  await expect(page.getByText('No resources match', { exact: false })).toBeVisible()
  await search.clear()
  await expect(page.getByRole('button', { name: /Machine Learning/ })).toHaveAttribute(
    'aria-expanded',
    'true',
  )
})
