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
        subtitle="Research, tools, papers, and hackathon prototypes — made by members across semesters. Filter by category and hover a card for details."
      />
      <Container size={1280} px={24} py={{ base: 56, md: 88 }}>
        <ErrorBoundary label="Projects">
          <ProjectGrid projects={projects} />
        </ErrorBoundary>
      </Container>
    </>
  )
}
