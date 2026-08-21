import { type FC } from 'react'
import { Container, Stack } from '@mantine/core'
import { Hero } from '../components/home/Hero'
import { MissionStrip } from '../components/home/MissionStrip'
import { OpenToEveryoneSection } from '../components/home/OpenToEveryoneSection'
import { EventsSection } from '../components/home/EventsSection'
import { ProjectsSpotlight } from '../components/home/ProjectsSpotlight'
import { PhotoRail } from '../components/home/PhotoRail'
import { PartnersStrip } from '../components/home/PartnersStrip'
import { JoinSection } from '../components/home/JoinSection'
import { ErrorBoundary } from '../components/ErrorBoundary'
import { events, projects, partners } from '../data'

export const HomePage: FC = () => {
  return (
    <>
      <ErrorBoundary label="Hero">
        <Hero />
      </ErrorBoundary>

      <Container size={1280} px={24}>
        <Stack gap={64} py={{ base: 48, md: 72 }}>

          <ErrorBoundary label="What we do">
            <MissionStrip />
          </ErrorBoundary>

            <ErrorBoundary label="Community">
            <PhotoRail />
          </ErrorBoundary>

          <ErrorBoundary label="Open to everyone">
            <OpenToEveryoneSection />
          </ErrorBoundary>

          <ErrorBoundary label="Events">
            <EventsSection events={events} />
          </ErrorBoundary>

          <ErrorBoundary label="Projects">
            <ProjectsSpotlight projects={projects} />
          </ErrorBoundary>

        

          <ErrorBoundary label="Join">
            <JoinSection />
          </ErrorBoundary>


          <ErrorBoundary label="Partners">
            <PartnersStrip partners={partners} />
          </ErrorBoundary>

        </Stack>
      </Container>
    </>
  )
}
