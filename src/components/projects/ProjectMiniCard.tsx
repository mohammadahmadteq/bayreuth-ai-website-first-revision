import { type FC } from 'react'
import { Box, Group, Stack, Text } from '@mantine/core'
import { IconArrowUpRight } from '@tabler/icons-react'
import type { Project } from '../../types/content'
import { Badge } from '../ui/Badge'
import { asset } from '../../lib/utils'

interface ProjectMiniCardProps {
  project: Project
}

/** Compact photo-forward card for project grids — image up top, details below. */
export const ProjectMiniCard: FC<ProjectMiniCardProps> = ({ project }) => {
  const Wrapper = project.link ? 'a' : 'div'
  const wrapperProps = project.link
    ? { href: project.link, target: '_blank', rel: 'noopener noreferrer' }
    : {}

  return (
    <Box
      component={Wrapper}
      {...wrapperProps}
      className="glow-card glow-card--lift"
      style={{
        display: 'block',
        overflow: 'hidden',
        textDecoration: 'none',
        cursor: project.link ? 'pointer' : 'default',
        height: '100%',
      }}
    >
      <Box style={{ position: 'relative', aspectRatio: '4 / 3', overflow: 'hidden' }}>
        <img
          src={asset(project.imageUrl)}
          alt={project.title}
          loading="lazy"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <Box style={{ position: 'absolute', top: 10, left: 10 }}>
          <Badge variant="teal">{project.category}</Badge>
        </Box>
      </Box>

      <Stack gap={6} p={16}>
        <Group justify="space-between" align="center" wrap="nowrap" gap={8}>
          <Text
            fw={700}
            ff='"Source Sans 3", sans-serif'
            fz={18}
            style={{ color: 'var(--color-text)', lineHeight: 1.2 }}
          >
            {project.title}
          </Text>
          {project.link && (
            <IconArrowUpRight size={18} color="var(--teal)" style={{ flexShrink: 0 }} />
          )}
        </Group>
        <Text fz={16} lineClamp={2} style={{ color: 'var(--color-subtext)', lineHeight: 1.5 }}>
          {project.description}
        </Text>
      </Stack>
    </Box>
  )
}
