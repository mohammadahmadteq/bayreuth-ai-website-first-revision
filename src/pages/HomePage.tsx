import { type FC } from 'react'
import { Container, Stack } from '@mantine/core'
import { Hero } from '../components/home/Hero'
import { StatsCounter } from '../components/home/StatsCounter'
import { MissionStrip } from '../components/home/MissionStrip'
import { FeaturedNext } from '../components/home/FeaturedNext'
import { PhotoRail } from '../components/home/PhotoRail'
import { JoinSection } from '../components/home/JoinSection'
import { ErrorBoundary } from '../components/ErrorBoundary'
import { events, stats } from '../data'

export const HomePage: FC = () => {
  return (
    <>
      <ErrorBoundary label="Hero">
        <Hero />
      </ErrorBoundary>

      <Container size={1280} px={24}>
        <Stack gap={64} py={{ base: 48, md: 72 }}>
          <ErrorBoundary label="Stats">
            <StatsCounter stats={stats} />
          </ErrorBoundary>

          <ErrorBoundary label="Mission">
            <MissionStrip />
          </ErrorBoundary>

          <ErrorBoundary label="Photos">
            <PhotoRail />
          </ErrorBoundary>

          <ErrorBoundary label="Upcoming event">
            <FeaturedNext events={events} />
          </ErrorBoundary>

          <ErrorBoundary label="Join">
            <JoinSection />
          </ErrorBoundary>
        </Stack>
      </Container>
    </>
  )
}
