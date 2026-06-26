import { type FC } from 'react'
import { Container } from '@mantine/core'
import { PageHeader } from '../components/layout/PageHeader'
import { TeamGrid } from '../components/team/TeamGrid'
import { ErrorBoundary } from '../components/ErrorBoundary'
import { team } from '../data'

export const TeamPage: FC = () => {
  return (
    <>
      <PageHeader
        eyebrow="Team"
        title="The people behind it."
        subtitle="A volunteer board and an active community of students from across the University of Bayreuth keep the association running."
      />
      <Container size={1280} px={24} py={{ base: 56, md: 88 }}>
        <ErrorBoundary label="Team">
          <TeamGrid members={team} />
        </ErrorBoundary>
      </Container>
    </>
  )
}
