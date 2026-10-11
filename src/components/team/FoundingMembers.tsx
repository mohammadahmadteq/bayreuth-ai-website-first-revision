import { type FC } from 'react'
import { Stack } from '@mantine/core'
import { TeamSectionTitle } from './TeamSectionTitle'

export const FoundingMembers: FC<{ names: string[] }> = ({ names }) => {
  if (names.length === 0) return null
  return (
    <Stack gap={24}>
      <TeamSectionTitle id="founding-members">Founding members</TeamSectionTitle>
      <ul
        aria-labelledby="founding-members"
        style={{
          // A minimum column width instead of breakpoints: up to three columns on
          // wide screens, a single column on phones.
          columns: '220px 3',
          columnGap: 32,
          margin: 0,
          padding: 0,
          listStylePosition: 'inside',
          color: 'var(--color-text)',
          fontSize: 16,
          lineHeight: 2,
        }}
      >
        {names.map((name) => (
          <li key={name}>{name}</li>
        ))}
      </ul>
    </Stack>
  )
}
