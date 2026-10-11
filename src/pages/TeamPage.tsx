import { type FC } from 'react'
import { Container, Stack } from '@mantine/core'
import { PageHeader } from '../components/layout/PageHeader'
import { TeamGrid } from '../components/team/TeamGrid'
import { FoundingMembers } from '../components/team/FoundingMembers'
import { ErrorBoundary } from '../components/ErrorBoundary'
import { useSiteContent } from '../hooks/useSiteContent'
import { founders } from '../data'

export const TeamPage: FC = () => {
  const { team } = useSiteContent()
  return (
    <>
      <PageHeader
        eyebrow="Team"
        title="The people behind it."
        subtitle="A volunteer board and an active community of students from across the University of Bayreuth keep the association running."
      />
      <Container size={1280} px={24} py={{ base: 32, md: 48 }}>
        <Stack gap={64}>
          <ErrorBoundary label="Team">
            <TeamGrid members={team} />
          </ErrorBoundary>
          <ErrorBoundary label="Founding members">
            <FoundingMembers names={founders} />
          </ErrorBoundary>
        </Stack>
      </Container>
    </>
  )
}
