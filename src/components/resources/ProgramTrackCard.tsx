import { type FC } from 'react'
import { Link } from 'react-router-dom'
import { Group, Text } from '@mantine/core'
import {
  IconBook2,
  IconTool,
  IconRoute,
  IconArrowUpRight,
  type TablerIcon,
} from '@tabler/icons-react'
import type { Program, ProgramFormat } from '../../types/content'

const FORMAT_ICON: Record<ProgramFormat, TablerIcon> = {
  'reading-group': IconBook2,
  workshop: IconTool,
  track: IconRoute,
}

interface ProgramTrackCardProps {
  program: Program
}

export const ProgramTrackCard: FC<ProgramTrackCardProps> = ({ program }) => {
  const Icon = FORMAT_ICON[program.format]
  return (
    <Link to="/apply" style={{ textDecoration: 'none' }}>
      <Group
        justify="space-between"
        wrap="nowrap"
        className="glow-card glow-card--lift"
        style={{ padding: '18px 22px' }}
      >
        <Group gap={14} wrap="nowrap">
          <Icon size={20} color="var(--teal)" stroke={1.7} style={{ flexShrink: 0 }} />
          <Text
            fw={700}
            ff='"Source Sans 3", sans-serif'
            fz={16}
            style={{ color: 'var(--color-text)' }}
          >
            {program.title}
          </Text>
        </Group>
        <IconArrowUpRight size={18} color="var(--teal)" style={{ flexShrink: 0 }} />
      </Group>
    </Link>
  )
}
