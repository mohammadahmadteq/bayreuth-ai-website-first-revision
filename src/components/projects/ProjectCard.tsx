import { type FC, useState } from 'react'
import { Box, Group, Stack, Text } from '@mantine/core'
import { IconExternalLink, IconArrowUpRight } from '@tabler/icons-react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import type { Project } from '../../types/content'
import { Badge } from '../ui/Badge'
import { asset } from '../../lib/utils'

interface ProjectCardProps {
  project: Project
}

export const ProjectCard: FC<ProjectCardProps> = ({ project }) => {
  const [hovered, setHovered] = useState(false)
  const reduce = useReducedMotion()
  const showOverlay = hovered || reduce

  const Wrapper = project.link ? 'a' : 'div'
  const wrapperProps = project.link
    ? { href: project.link, target: '_blank', rel: 'noopener noreferrer' }
    : {}

  return (
    <Box
      component={Wrapper}
      {...wrapperProps}
      className="glow-card"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      style={{
        display: 'block',
        position: 'relative',
        overflow: 'hidden',
        textDecoration: 'none',
        aspectRatio: '4 / 3',
        cursor: project.link ? 'pointer' : 'default',
      }}
    >
      <img
        src={asset(project.imageUrl)}
        alt={project.title}
        loading="lazy"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transform: showOverlay && !reduce ? 'scale(1.06)' : 'scale(1)',
          transition: 'transform 0.6s cubic-bezier(0.2,0,0,1)',
        }}
      />
      <Box
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(to top, rgba(10,10,15,0.95) 8%, rgba(10,10,15,0.5) 45%, rgba(10,10,15,0.15))',
        }}
      />

      {/* Always-visible footer */}
      <Stack gap={8} style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: 20 }}>
        <Group gap={8}>
          <Badge variant="teal">{project.category}</Badge>
        </Group>
        <Group justify="space-between" align="center" wrap="nowrap">
          <Text
            fw={700}
            ff="Space Grotesk, sans-serif"
            fz="clamp(18px, 2.4vw, 22px)"
            style={{ color: '#fff', lineHeight: 1.1 }}
          >
            {project.title}
          </Text>
          {project.link && (
            <IconArrowUpRight size={20} color="var(--teal)" style={{ flexShrink: 0 }} />
          )}
        </Group>

        {/* Hover-reveal detail */}
        <AnimatePresence initial={false}>
          {showOverlay && (
            <motion.div
              initial={reduce ? false : { opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: [0.2, 0, 0, 1] }}
              style={{ overflow: 'hidden' }}
            >
              <Text
                fz={14}
                style={{ color: 'rgba(236,236,242,0.85)', lineHeight: 1.55, marginTop: 4 }}
              >
                {project.description}
              </Text>
              <Group gap={6} mt={12}>
                {project.tags.slice(0, 4).map((tag) => (
                  <Badge key={tag} variant="muted">
                    {tag}
                  </Badge>
                ))}
              </Group>
              <Group gap={6} mt={12}>
                {project.link && <IconExternalLink size={14} color="var(--teal)" />}
                <Text fz={12} style={{ color: 'rgba(236,236,242,0.6)' }}>
                  {project.authors.join(' · ')}
                </Text>
              </Group>
            </motion.div>
          )}
        </AnimatePresence>
      </Stack>
    </Box>
  )
}
