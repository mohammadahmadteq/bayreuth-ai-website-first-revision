import { type FC } from 'react'
import { Container, Stack } from '@mantine/core'
import { Hero } from '../components/home/Hero'
import { StatsCounter } from '../components/home/StatsCounter'
import { MissionStrip } from '../components/home/MissionStrip'
import { FeaturedNext } from '../components/home/FeaturedNext'
import { PartnerTeaser } from '../components/home/PartnerTeaser'
import { PhotoRail } from '../components/home/PhotoRail'
import { ApplicationForm } from '../components/home/ApplicationForm'
import { ErrorBoundary } from '../components/ErrorBoundary'
import { events, stats } from '../data'

export const HomePage: FC = () => {
  return (
    <>
      <ErrorBoundary label="Hero">
        <Hero />
      </ErrorBoundary>

      <Container size={1280} px={24}>
        <Stack gap={104} py={{ base: 64, md: 96 }}>
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

          <ErrorBoundary label="Application form">
            <ApplicationForm />
          </ErrorBoundary>

          <ErrorBoundary label="Partner teaser">
            <PartnerTeaser />
          </ErrorBoundary>
        </Stack>
      </Container>
    </>
  )
}
