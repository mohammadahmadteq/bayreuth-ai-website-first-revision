import { type FC } from 'react'
import { Container, Stack } from '@mantine/core'
import { PageHeader } from '../components/layout/PageHeader'
import { ProgramTrackCard } from '../components/resources/ProgramTrackCard'
import { ReadingGroupList } from '../components/resources/ReadingGroupList'
import { SectionHeading } from '../components/ui/SectionHeading'
import { FadeInWhenVisible } from '../components/ui/FadeInWhenVisible'
import { ErrorBoundary } from '../components/ErrorBoundary'
import { programs } from '../data'

export const ResourcesPage: FC = () => {
  return (
    <>
      <PageHeader eyebrow="Learning Resources" title="Learn with us." />

      <Container size={760} px={24} py={{ base: 56, md: 88 }}>
        <Stack gap={64}>
          <Stack gap={20}>
            <SectionHeading eyebrow="Programs" title="Tracks & workshops" />
            <ErrorBoundary label="Programs">
              <Stack gap={10}>
                {programs.map((p, i) => (
                  <FadeInWhenVisible key={p.id} delay={(i % 3) * 0.06}>
                    <ProgramTrackCard program={p} />
                  </FadeInWhenVisible>
                ))}
              </Stack>
            </ErrorBoundary>
          </Stack>

          <Stack gap={20}>
            <SectionHeading eyebrow="Curriculum" title="AI Safety Fundamentals — reading group" />
            <ErrorBoundary label="Reading group">
              <ReadingGroupList />
            </ErrorBoundary>
          </Stack>
        </Stack>
      </Container>
    </>
  )
}
