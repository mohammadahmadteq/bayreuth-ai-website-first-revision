import { expect, test } from '@playwright/test'
import { groupTeam, isEstablishedPosition } from '../src/lib/team'
import type { TeamMember } from '../src/types/content'

const member = (name: string, role: string, isBoardMember = false): TeamMember => ({
  id: name,
  name,
  role,
  bio: '',
  imageUrl: '/official/logo.svg',
  isBoardMember,
})

test('team sections follow board precedence and otherwise keep content order', () => {
  const secretary = member('Ada Example', 'Secretary', true)
  const vicePresident = member('Renato Mio', 'Vice President', true)
  const treasurer = member('Pascal Lange', 'Treasurer', true)
  const president = member('Pascal Fechner', 'President', true)
  const tizian = member('Tizian Küffner', 'Core Team')
  const jamil = member('Jamil Shihada', 'Core Team')
  // A board flag left on a former member must not pull them back onto the board.
  const felicitas = member('Felicitas Feick', 'Former Board Member', true)
  const andreas = member('Andreas Karasenko', 'Alumni')
  const members = [
    secretary,
    vicePresident,
    felicitas,
    tizian,
    treasurer,
    president,
    andreas,
    jamil,
  ]
  const original = [...members]

  expect(groupTeam(members)).toEqual({
    board: [president, vicePresident, treasurer, secretary],
    core: [tizian, jamil],
    former: [felicitas, andreas],
  })
  expect(members).toEqual(original)
})

test('team page lists the board, the core team in content order, then alumni', async ({ page }) => {
  await page.goto('/team')
  const main = page.locator('main')
  await expect(main.getByRole('heading', { level: 2 })).toHaveText(['Board', 'Core Team', 'Alumni'])
  for (const position of ['President', 'Vice President', 'Treasurer']) {
    await expect(main.getByText(position, { exact: true })).toBeVisible()
  }

  const names = await main
    .getByRole('img', { name: /^Portrait of / })
    .evaluateAll((images) =>
      images.map((image) => image.getAttribute('alt')?.replace('Portrait of ', '')),
    )
  expect(names).toEqual([
    'Pascal Fechner',
    'Renato Mio',
    'Pascal Lange',
    'Nico Höllerich',
    'Mohammad Ahmad',
    'Laura Hafner',
    'Mina Mohammed',
    'Jamil Shihada',
    'Tizian Küffner',
    'Felipe Calgaro',
    'Andreas Karasenko',
    'Felicitas Feick',
  ])
})

test('only established positions get the board badge', () => {
  expect(isEstablishedPosition(' vice president ')).toBe(true)
  expect(isEstablishedPosition('Treasurer')).toBe(true)
  expect(isEstablishedPosition('Core Team')).toBe(false)
  expect(isEstablishedPosition('Former President')).toBe(false)
})
