import { type FC } from 'react'
import { Link } from 'react-router-dom'
import { Box, Group, SimpleGrid, Text } from '@mantine/core'
import { IconArrowRight } from '@tabler/icons-react'
import type { Project } from '../../types/content'
import { ProjectMiniCard } from '../projects/ProjectMiniCard'
import { SectionHeading } from '../ui/SectionHeading'
import { FadeInWhenVisible } from '../ui/FadeInWhenVisible'
import { DataWaveTrace } from '../ui/DataWaveTrace'

interface ProjectsSpotlightProps {
  projects: Project[]
}

const SPOTLIGHT_COUNT = 3

/** Most recent projects first; layout adapts to however many exist. */
export const ProjectsSpotlight: FC<ProjectsSpotlightProps> = ({ projects }) => {
  if (projects.length === 0) {
    return (
      <Box>
        <SectionHeading eyebrow="Projects" title="Ideas, shipped." />
        <Text
          mt={24}
          className="glow-card"
          style={{ color: 'var(--color-subtext)', textAlign: 'center', padding: 48 }}
        >
          No projects to show yet — our first showcase is coming soon.
        </Text>
      </Box>
    )
  }

  const featured = [...projects]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, SPOTLIGHT_COUNT)

  return (
    <Box>
      <SectionHeading
        eyebrow="Projects"
        title="Ideas, shipped."
        subtitle="We turn AI ideas into working projects — from demand forecasting to data pipelines and beyond."
      />

      <Box mt={28}>
        <DataWaveTrace />
      </Box>

      <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing={20} mt={40}>
        {featured.map((p, i) => (
          <FadeInWhenVisible key={p.id} delay={i * 0.08}>
            <ProjectMiniCard project={p} />
          </FadeInWhenVisible>
        ))}
      </SimpleGrid>

      <Group justify="center" mt={32}>
        <Link
          to="/projects"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            color: 'var(--teal)',
            fontWeight: 600,
            fontSize: 15,
            textDecoration: 'none',
          }}
        >
          View all projects
          <IconArrowRight size={16} />
        </Link>
      </Group>
    </Box>
  )
}
