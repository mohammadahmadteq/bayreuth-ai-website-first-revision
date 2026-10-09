import type { TeamMember } from '../types/content'

/** Established board positions, in the order the board is listed. */
const POSITIONS = ['president', 'vice president', 'treasurer']

const normalize = (role: string) => role.trim().toLowerCase()

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
 * back onto the board. The board follows position precedence whatever order the
 * rows arrive in; every other section keeps the content order (`sort_order` in
 * Supabase, array order in team.json).
 */
export function groupTeam(members: TeamMember[]) {
  const rank = (member: TeamMember) => {
    const index = POSITIONS.indexOf(normalize(member.role))
    return index === -1 ? POSITIONS.length : index
  }
  const current = members.filter((member) => !isFormerMember(member))
  return {
    // Array sort is stable, so other board roles keep their content order.
    board: current.filter((member) => member.isBoardMember).sort((a, b) => rank(a) - rank(b)),
    core: current.filter((member) => !member.isBoardMember),
    former: members.filter(isFormerMember),
  }
}
