import { type FC } from 'react'
import { SimpleGrid, Stack, Text } from '@mantine/core'
import type { TeamMember } from '../../types/content'
import { groupTeam } from '../../lib/team'
import { TeamMemberCard } from './TeamMemberCard'
import { TeamSectionTitle } from './TeamSectionTitle'
import { FadeInWhenVisible } from '../ui/FadeInWhenVisible'

interface TeamGridProps {
  members: TeamMember[]
}

const Group: FC<{ title: string; members: TeamMember[] }> = ({ title, members }) => {
  if (members.length === 0) return null
  return (
    <Stack gap={24}>
      <TeamSectionTitle>{title}</TeamSectionTitle>
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

  const { board, core, former } = groupTeam(members)

  return (
    <Stack gap={64}>
      <Group title="Board" members={board} />
      <Group title="Core Team" members={core} />
      <Group title="Former organisers" members={former} />
    </Stack>
  )
}
