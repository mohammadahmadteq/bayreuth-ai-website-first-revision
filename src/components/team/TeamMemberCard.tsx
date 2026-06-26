import { type FC } from 'react'
import { Box, Stack, Text, ActionIcon } from '@mantine/core'
import { IconBrandLinkedin } from '@tabler/icons-react'
import type { TeamMember } from '../../types/content'
import { asset } from '../../lib/utils'

interface TeamMemberCardProps {
  member: TeamMember
}

export const TeamMemberCard: FC<TeamMemberCardProps> = ({ member }) => {
  return (
    <Stack
      gap={0}
      className="glow-card glow-card--lift"
      style={{ overflow: 'hidden', height: '100%' }}
    >
      <Box style={{ position: 'relative', aspectRatio: '1 / 1', overflow: 'hidden' }}>
        <img
          src={asset(member.imageUrl)}
          alt={`Portrait of ${member.name}`}
          loading="lazy"
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
        <Box
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(10,10,15,0.85), transparent 55%)',
          }}
        />
      </Box>
      <Stack gap={6} style={{ padding: 18 }}>
        <Text
          fw={700}
          ff="Space Grotesk, sans-serif"
          fz={18}
          style={{ color: 'var(--color-text)' }}
        >
          {member.name}
        </Text>
        <Text fz={13} fw={600} style={{ color: 'var(--teal)' }}>
          {member.role}
        </Text>
        <Text fz={14} style={{ color: 'var(--color-subtext)', lineHeight: 1.55 }}>
          {member.bio}
        </Text>
        {member.linkedin && (
          <ActionIcon
            component="a"
            href={member.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            variant="subtle"
            aria-label={`${member.name} on LinkedIn`}
            mt={4}
            style={{ color: 'var(--color-subtext)' }}
          >
            <IconBrandLinkedin size={20} />
          </ActionIcon>
        )}
      </Stack>
    </Stack>
  )
}
