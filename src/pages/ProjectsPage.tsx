import { type FC } from 'react'
import { Container } from '@mantine/core'
import { PageHeader } from '../components/layout/PageHeader'
import { ProjectGrid } from '../components/projects/ProjectGrid'
import { ErrorBoundary } from '../components/ErrorBoundary'
import { projects } from '../data'

export const ProjectsPage: FC = () => {
  return (
    <>
      <PageHeader
        eyebrow="Projects"
        title="What we’ve built."
        subtitle="Hands-on projects where members learn machine learning together on real-world data."
      />
      <Container size={1280} px={24} py={{ base: 32, md: 48 }}>
        <ErrorBoundary label="Projects">
          <ProjectGrid projects={projects} />
        </ErrorBoundary>
      </Container>
    </>
  )
}
