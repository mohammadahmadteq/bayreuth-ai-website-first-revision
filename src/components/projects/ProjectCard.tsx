import { type FC } from 'react'
import { Anchor, Box, Group, Stack, Text } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import { IconArrowUpRight } from '@tabler/icons-react'
import type { Project, ProjectStatus } from '../../types/content'
import { Badge } from '../ui/Badge'
import { asset } from '../../lib/utils'

interface ProjectCardProps {
  project: Project
}

const STATUS_LABEL: Record<ProjectStatus, string> = {
  'in-progress': 'In progress',
  concluded: 'Concluded',
}

const LINK_STYLE = {
  color: 'var(--teal)',
  fontWeight: 600,
  textDecoration: 'underline',
  textUnderlineOffset: 3,
}

// Content stays visible at all times (no hover reveal) so touch screens see it,
// and the card is not one big link, which lets it hold the press links.
export const ProjectCard: FC<ProjectCardProps> = ({ project }) => {
  const isMobile = useMediaQuery('(max-width: 767px)')
  const sideBySide = Boolean(project.imageUrl) && !isMobile

  return (
    <Box
      component="article"
      className="glow-card"
      style={{
        overflow: 'hidden',
        display: 'grid',
        gridTemplateColumns: sideBySide ? 'minmax(0, 1.1fr) minmax(0, 1fr)' : '1fr',
      }}
    >
      {project.imageUrl && (
        <Box
          style={{
            display: 'grid',
            placeItems: 'center',
            padding: 16,
            background: '#fff',
            borderRight: sideBySide ? '1px solid var(--border)' : undefined,
            borderBottom: sideBySide ? undefined : '1px solid var(--border)',
          }}
        >
          {/* Charts must not be cropped, so the image keeps its own proportions. */}
          <img
            src={asset(project.imageUrl)}
            alt={project.imageAlt ?? project.title}
            loading="lazy"
            style={{ width: '100%', height: 'auto', display: 'block' }}
          />
        </Box>
      )}

      <Stack gap={14} style={{ padding: 'clamp(20px, 3vw, 32px)' }}>
        <Group gap={8}>
          <Badge variant="teal">{project.category}</Badge>
          {project.status && (
            <Badge variant={project.status === 'in-progress' ? 'accent' : 'muted'}>
              {STATUS_LABEL[project.status]}
            </Badge>
          )}
        </Group>

        <Text
          component="h2"
          m={0}
          fw={700}
          ff='"Source Sans 3", sans-serif'
          fz="clamp(22px, 2.6vw, 28px)"
          style={{ color: 'var(--color-text)', lineHeight: 1.15 }}
        >
          {project.title}
        </Text>

        <Text fz={16} style={{ color: 'var(--color-subtext)', lineHeight: 1.65 }}>
          {project.description}
        </Text>

        {project.tags.length > 0 && (
          <Group gap={6}>
            {project.tags.map((tag) => (
              <Badge key={tag} variant="muted">
                {tag}
              </Badge>
            ))}
          </Group>
        )}

        {project.authors.length > 0 && (
          <Text fz={14} style={{ color: 'var(--color-subtext)', lineHeight: 1.6 }}>
            <Text span fw={600} fz={14} style={{ color: 'var(--color-text)' }}>
              Contributors:{' '}
            </Text>
            {project.authors.join(', ')}
          </Text>
        )}

        {project.press && project.press.length > 0 && (
          <Stack gap={6}>
            <Text fz={14} fw={600} style={{ color: 'var(--color-text)' }}>
              In the press
            </Text>
            <Group gap="6px 18px">
              {project.press.map((item) => (
                <Anchor
                  key={item.url}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  fz={14}
                  style={LINK_STYLE}
                >
                  {item.label}
                </Anchor>
              ))}
            </Group>
          </Stack>
        )}

        {project.link && (
          <Anchor
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            fz={15}
            style={{ ...LINK_STYLE, display: 'inline-flex', alignItems: 'center', gap: 4 }}
          >
            Read more
            <IconArrowUpRight size={16} />
          </Anchor>
        )}
      </Stack>
    </Box>
  )
}
