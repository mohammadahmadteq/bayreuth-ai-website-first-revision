import { type FC } from 'react'
import { Group, Stack, Text } from '@mantine/core'
import { IconBook2, IconTool, IconRoute, IconUsers, type TablerIcon } from '@tabler/icons-react'
import type { Program, ProgramFormat, ProgramLevel } from '../../types/content'
import { Badge } from '../ui/Badge'

const FORMAT_ICON: Record<ProgramFormat, TablerIcon> = {
  'reading-group': IconBook2,
  workshop: IconTool,
  track: IconRoute,
}

const FORMAT_LABEL: Record<ProgramFormat, string> = {
  'reading-group': 'Reading Group',
  workshop: 'Workshop',
  track: 'Track',
}

const LEVEL_VARIANT: Record<ProgramLevel, 'teal' | 'neon' | 'muted'> = {
  beginner: 'neon',
  intermediate: 'teal',
  advanced: 'muted',
}

interface ProgramTrackCardProps {
  program: Program
}

export const ProgramTrackCard: FC<ProgramTrackCardProps> = ({ program }) => {
  const Icon = FORMAT_ICON[program.format]
  return (
    <Stack gap={14} className="glow-card glow-card--lift" style={{ padding: 26, height: '100%' }}>
      <Group justify="space-between" align="flex-start">
        <Group gap={10}>
          <Icon size={22} color="var(--teal)" stroke={1.7} />
          <Text
            fz={12}
            fw={700}
            tt="uppercase"
            style={{ letterSpacing: '0.1em', color: 'var(--color-subtext)' }}
          >
            {FORMAT_LABEL[program.format]}
          </Text>
        </Group>
        <Badge variant={LEVEL_VARIANT[program.level]}>{program.level}</Badge>
      </Group>

      <Text fw={700} ff="Space Grotesk, sans-serif" fz={20} style={{ color: 'var(--color-text)' }}>
        {program.title}
      </Text>
      <Text fz={14} style={{ color: 'var(--color-subtext)', lineHeight: 1.6, flex: 1 }}>
        {program.description}
      </Text>

      <Group
        justify="space-between"
        mt={4}
        style={{ borderTop: '1px solid var(--border)', paddingTop: 14 }}
      >
        <Text fz={13} style={{ color: 'var(--color-subtext)' }}>
          {program.schedule}
        </Text>
        {typeof program.capacity === 'number' && (
          <Group gap={5}>
            <IconUsers size={14} color="var(--color-subtext)" />
            <Text fz={13} style={{ color: 'var(--color-subtext)' }}>
              {program.capacity} spots
            </Text>
          </Group>
        )}
      </Group>
    </Stack>
  )
}
