import { type FC } from 'react'
import { Container, Stack, Group } from '@mantine/core'
import { PageHeader } from '../components/layout/PageHeader'
import { MeetingInfoCard } from '../components/meetings/MeetingInfoCard'
import { Timeline } from '../components/dates/Timeline'
import { FadeInWhenVisible } from '../components/ui/FadeInWhenVisible'
import { JoinButton } from '../components/ui/JoinButton'
import { ErrorBoundary } from '../components/ErrorBoundary'
import { events } from '../data'

export const MeetingsPage: FC = () => {
  return (
    <>
      <PageHeader
        eyebrow="Meetings"
        title="Every other Thursday, we get together."
        subtitle="Newcomers always welcome — no preparation required."
      />

      <Container size={760} px={24} py={{ base: 56, md: 88 }}>
        <Stack gap={48}>
          <FadeInWhenVisible>
            <MeetingInfoCard />
          </FadeInWhenVisible>

          <Group justify="center">
            <JoinButton />
          </Group>

          <ErrorBoundary label="Timeline">
            <Timeline events={events} />
          </ErrorBoundary>
        </Stack>
      </Container>
    </>
  )
}
