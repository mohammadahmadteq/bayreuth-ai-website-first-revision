import { type FC } from 'react'
import { Container } from '@mantine/core'
import { PageHeader } from '../components/layout/PageHeader'
import { Timeline } from '../components/dates/Timeline'
import { ErrorBoundary } from '../components/ErrorBoundary'
import { events } from '../data'

export const DatesPage: FC = () => {
  return (
    <>
      <PageHeader
        eyebrow="Important Dates"
        title="What’s coming up."
        subtitle="Talks, workshops, dinners, and socials — chronologically. Tap any event to see the full details."
      />
      <Container size={760} px={24} py={{ base: 56, md: 88 }}>
        <ErrorBoundary label="Timeline">
          <Timeline events={events} />
        </ErrorBoundary>
      </Container>
    </>
  )
}
