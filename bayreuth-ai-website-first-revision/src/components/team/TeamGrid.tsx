import { type FC } from 'react'
import { SimpleGrid, Stack, Text } from '@mantine/core'
import type { TeamMember } from '../../types/content'
import { TeamMemberCard } from './TeamMemberCard'
import { FadeInWhenVisible } from '../ui/FadeInWhenVisible'

interface TeamGridProps {
  members: TeamMember[]
}

const Group: FC<{ title: string; members: TeamMember[] }> = ({ title, members }) => {
  if (members.length === 0) return null
  return (
    <Stack gap={24}>
      <Text
        ff="Space Grotesk, sans-serif"
        fw={700}
        fz={13}
        tt="uppercase"
        style={{ letterSpacing: '0.16em', color: 'var(--teal)' }}
      >
        {title}
      </Text>
      <SimpleGrid cols={{ base: 1, xs: 2, md: 3, lg: 4 }} spacing={20}>
        {members.map((m, i) => (
          <FadeInWhenVisible key={m.id} delay={(i % 4) * 0.06}>
            <TeamMemberCard member={m} />
          </FadeInWhenVisible>
        ))}
      </SimpleGrid>
    </Stack>
  )
}

export const TeamGrid: FC<TeamGridProps> = ({ members }) => {
  if (members.length === 0) {
    return (
      <Text style={{ color: 'var(--color-subtext)', textAlign: 'center', padding: 48 }}>
        Team details are being updated — check back soon.
      </Text>
    )
  }

  const board = members.filter((m) => m.isBoardMember)
  const general = members.filter((m) => !m.isBoardMember)

  return (
    <Stack gap={64}>
      <Group title="Board" members={board} />
      <Group title="Team & Active Members" members={general} />
    </Stack>
  )
}
