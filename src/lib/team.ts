import type { TeamMember } from '../types/content'

/** Established board positions, in the order the board is listed. */
const POSITIONS = ['president', 'vice president', 'treasurer']

const normalize = (role: string) => role.trim().toLowerCase()
const byName = (a: TeamMember, b: TeamMember) => a.name.localeCompare(b.name, 'de')

export function isEstablishedPosition(role: string): boolean {
  return POSITIONS.includes(normalize(role))
}

/**
 * Former members are marked through their role ("Former Board Member", "Alumni"),
 * because the content tables have no separate status field.
 */
export function isFormerMember(member: TeamMember): boolean {
  return /^(former\b|alumn)/.test(normalize(member.role))
}

/**
 * Splits the team into the page's sections without mutating the input. Former
 * members are matched first, so a board flag left on an alumnus cannot pull them
 * back onto the board. The board follows position precedence; the other sections
 * are alphabetical, which keeps the order identical between the local fallback
 * and the database (the admin portal cannot reorder rows).
 */
export function groupTeam(members: TeamMember[]) {
  const rank = (member: TeamMember) => {
    const index = POSITIONS.indexOf(normalize(member.role))
    return index === -1 ? POSITIONS.length : index
  }
  const current = members.filter((member) => !isFormerMember(member))
  return {
    board: current
      .filter((member) => member.isBoardMember)
      .sort((a, b) => rank(a) - rank(b) || byName(a, b)),
    core: current.filter((member) => !member.isBoardMember).sort(byName),
    former: members.filter(isFormerMember).sort(byName),
  }
}
