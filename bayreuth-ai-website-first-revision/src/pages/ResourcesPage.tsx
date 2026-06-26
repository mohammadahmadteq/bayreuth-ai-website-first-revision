import { type FC, useMemo, useState } from 'react'
import { Container, SimpleGrid, Stack } from '@mantine/core'
import { PageHeader } from '../components/layout/PageHeader'
import { ProgramTrackCard } from '../components/resources/ProgramTrackCard'
import { ReadingGroupList } from '../components/resources/ReadingGroupList'
import { ProjectFilterBar } from '../components/projects/ProjectFilterBar'
import { SectionHeading } from '../components/ui/SectionHeading'
import { FadeInWhenVisible } from '../components/ui/FadeInWhenVisible'
import { ErrorBoundary } from '../components/ErrorBoundary'
import { programs } from '../data'

const ALL = 'all'

export const ResourcesPage: FC = () => {
  const [level, setLevel] = useState(ALL)

  const levels = useMemo(() => [ALL, ...Array.from(new Set(programs.map((p) => p.level)))], [])
  const visible = useMemo(
    () => (level === ALL ? programs : programs.filter((p) => p.level === level)),
    [level],
  )

  return (
    <>
      <PageHeader
        eyebrow="Resources"
        title="Learn with us."
        subtitle="Structured tracks, hands-on workshops, and reading groups — from your first neural network to reproducing recent papers."
      />

      <Container size={1280} px={24} py={{ base: 56, md: 88 }}>
        <Stack gap={80}>
          <Stack gap={28}>
            <SectionHeading eyebrow="Programs" title="Tracks & workshops" />
            <ProjectFilterBar filters={levels} active={level} onChange={setLevel} />
            <ErrorBoundary label="Programs">
              <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing={20}>
                {visible.map((p, i) => (
                  <FadeInWhenVisible key={p.id} delay={(i % 3) * 0.06}>
                    <ProgramTrackCard program={p} />
                  </FadeInWhenVisible>
                ))}
              </SimpleGrid>
            </ErrorBoundary>
          </Stack>

          <Stack gap={28}>
            <SectionHeading
              eyebrow="Curriculum"
              title="AI Safety Fundamentals — reading group"
              subtitle="A structured six-week syllabus we run each autumn, inspired by clean curriculum design. Sessions are discussion-based; readings are shared in advance."
            />
            <ErrorBoundary label="Reading group">
              <ReadingGroupList />
            </ErrorBoundary>
          </Stack>
        </Stack>
      </Container>
    </>
  )
}
