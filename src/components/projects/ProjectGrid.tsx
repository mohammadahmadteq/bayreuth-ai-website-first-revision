import { type FC } from 'react'
import { Stack, Text } from '@mantine/core'
import { motion, useReducedMotion } from 'framer-motion'
import type { Project } from '../../types/content'
import { ProjectCard } from './ProjectCard'

interface ProjectGridProps {
  projects: Project[]
}

export const ProjectGrid: FC<ProjectGridProps> = ({ projects }) => {
  const reduce = useReducedMotion()

  if (projects.length === 0) {
    return (
      <Text style={{ color: 'var(--color-subtext)', textAlign: 'center', padding: 48 }}>
        No projects to show yet — our first showcase is coming soon.
      </Text>
    )
  }

  return (
    <Stack gap={28}>
      {projects.map((p) => (
        <motion.div
          key={p.id}
          initial={reduce ? false : { opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, ease: [0.2, 0, 0, 1] }}
        >
          <ProjectCard project={p} />
        </motion.div>
      ))}
    </Stack>
  )
}
