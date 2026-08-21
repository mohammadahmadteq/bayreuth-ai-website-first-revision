import { type FC } from 'react'
import { Box, Group, SimpleGrid, Stack, Text } from '@mantine/core'
import { IconCode, IconPresentation, IconMessageCircle2, IconUsersGroup } from '@tabler/icons-react'
import { FadeInWhenVisible } from '../ui/FadeInWhenVisible'
import { SectionHeading } from '../ui/SectionHeading'

const ACTIVITIES = [
  {
    icon: IconCode,
    title: 'Projects',
    body: 'Hands-on builds, research, and hackathon prototypes.',
  },
  {
    icon: IconPresentation,
    title: 'Talks & Workshops',
    body: 'Sessions on tools, papers, and applied techniques.',
  },
  {
    icon: IconMessageCircle2,
    title: 'Discussions',
    body: 'Open exchange on where AI is heading and why it matters.',
  },
  {
    icon: IconUsersGroup,
    title: 'Community',
    body: 'A standing group of students who meet regularly.',
  },
]

/** "What we do" — the association's core activities, presented lightweight. */
export const MissionStrip: FC = () => {
  return (
    <Box>
      <SectionHeading eyebrow="What we do" title="Projects, talks, discussions, community." />

      <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing={32} mt={40}>
        {ACTIVITIES.map((a, i) => (
          <FadeInWhenVisible key={a.title} delay={i * 0.06}>
            <Stack gap={10}>
              <Group gap={10} wrap="nowrap">
                <a.icon size={20} color="var(--teal)" stroke={1.8} />
                <Text
                  fw={600}
                  ff='"Source Sans 3", sans-serif'
                  fz={16}
                  style={{ color: 'var(--color-text)' }}
                >
                  {a.title}
                </Text>
              </Group>
              <Text style={{ color: 'var(--color-subtext)', fontSize: 16, lineHeight: 1.6 }}>
                {a.body}
              </Text>
            </Stack>
          </FadeInWhenVisible>
        ))}
      </SimpleGrid>
    </Box>
  )
}
