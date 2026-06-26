import { type FC, useMemo, useState } from 'react'
import { SimpleGrid, Stack, Text } from '@mantine/core'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import type { Project } from '../../types/content'
import { ProjectCard } from './ProjectCard'
import { ProjectFilterBar, type ProjectFilter } from './ProjectFilterBar'

interface ProjectGridProps {
  projects: Project[]
}

const ALL = 'all'

export const ProjectGrid: FC<ProjectGridProps> = ({ projects }) => {
  const reduce = useReducedMotion()
  const [active, setActive] = useState<ProjectFilter>(ALL)

  const filters = useMemo(() => {
    const categories = Array.from(new Set(projects.map((p) => p.category)))
    return [ALL, ...categories]
  }, [projects])

  const visible = useMemo(
    () => (active === ALL ? projects : projects.filter((p) => p.category === active)),
    [projects, active],
  )

  if (projects.length === 0) {
    return (
      <Text style={{ color: 'var(--color-subtext)', textAlign: 'center', padding: 48 }}>
        No projects to show yet — our first showcase is coming soon.
      </Text>
    )
  }

  return (
    <Stack gap={32}>
      <ProjectFilterBar filters={filters} active={active} onChange={setActive} />

      <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing={20}>
        <AnimatePresence mode="popLayout">
          {visible.map((p) => (
            <motion.div
              key={p.id}
              layout={!reduce}
              initial={reduce ? false : { opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={reduce ? undefined : { opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.3, ease: [0.2, 0, 0, 1] }}
            >
              <ProjectCard project={p} />
            </motion.div>
          ))}
        </AnimatePresence>
      </SimpleGrid>
    </Stack>
  )
}
