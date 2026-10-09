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

test('team sections follow board precedence, then names, without mutating input', () => {
  const vicePresident = member('Renato Mio', 'Vice President', true)
  const president = member('Pascal Fechner', 'President', true)
  const secretary = member('Ada Example', 'Secretary', true)
  const tizian = member('Tizian Küffner', 'Core Team')
  const jamil = member('Jamil Shihada', 'Core Team')
  // A board flag left on a former member must not pull them back onto the board.
  const felicitas = member('Felicitas Feick', 'Former Board Member', true)
  const andreas = member('Andreas Karasenko', 'Alumni')
  const members = [vicePresident, felicitas, tizian, secretary, president, andreas, jamil]
  const original = [...members]

  expect(groupTeam(members)).toEqual({
    board: [president, vicePresident, secretary],
    core: [jamil, tizian],
    former: [andreas, felicitas],
  })
  expect(members).toEqual(original)
})

test('only established positions get the board badge', () => {
  expect(isEstablishedPosition(' vice president ')).toBe(true)
  expect(isEstablishedPosition('Treasurer')).toBe(true)
  expect(isEstablishedPosition('Core Team')).toBe(false)
  expect(isEstablishedPosition('Former President')).toBe(false)
})
