import { type FC } from 'react'
import { Container, Grid, Stack, Text } from '@mantine/core'
import { PageHeader } from '../components/layout/PageHeader'
import { MeetingInfoCard } from '../components/meetings/MeetingInfoCard'
import { FadeInWhenVisible } from '../components/ui/FadeInWhenVisible'
import { JoinButton } from '../components/ui/JoinButton'

export const MeetingsPage: FC = () => {
  return (
    <>
      <PageHeader
        eyebrow="Meetings"
        title="Every other Thursday, we get together."
        subtitle="Our meetings are the heart of the association — part seminar, part build night, part community. Newcomers are always welcome; no preparation required."
      />

      <Container size={1280} px={24} py={{ base: 56, md: 88 }}>
        <Grid gutter={40} align="center">
          <Grid.Col span={{ base: 12, md: 6 }}>
            <FadeInWhenVisible>
              <Stack gap={18}>
                <Text
                  ff="Space Grotesk, sans-serif"
                  fw={700}
                  fz="clamp(24px, 4vw, 34px)"
                  style={{ color: 'var(--color-text)', lineHeight: 1.15 }}
                >
                  A calm, structured rhythm.
                </Text>
                <Text style={{ color: 'var(--color-subtext)', fontSize: 16, lineHeight: 1.7 }}>
                  Each session opens with a short talk — a paper, a tool, or a member’s project —
                  followed by hands-on hacking time where teams work on ongoing projects. We close
                  with open discussion: what we’re reading, what’s confusing, what’s exciting.
                </Text>
                <Text style={{ color: 'var(--color-subtext)', fontSize: 16, lineHeight: 1.7 }}>
                  You don’t need to be a programmer, and you don’t need to know any maths. Curiosity
                  is the only prerequisite. Drop in once to see if it’s for you.
                </Text>
                <JoinButton />
              </Stack>
            </FadeInWhenVisible>
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <FadeInWhenVisible delay={0.1}>
              <MeetingInfoCard />
            </FadeInWhenVisible>
          </Grid.Col>
        </Grid>
      </Container>
    </>
  )
}
