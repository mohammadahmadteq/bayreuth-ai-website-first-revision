import { type FC } from 'react'
import { Box, Group, SimpleGrid, Stack, Text } from '@mantine/core'
import { IconCode, IconPresentation, IconMessageCircle2, IconUsersGroup } from '@tabler/icons-react'
import { FadeInWhenVisible } from '../ui/FadeInWhenVisible'
import { SectionHeading } from '../ui/SectionHeading'

const ACTIVITIES = [
  {
    icon: IconCode,
    title: 'Projects',
    body: 'Turn ideas into reality through hands-on AI projects and collaboration.',
  },
  {
    icon: IconPresentation,
    title: 'Talks & Workshops',
    body: 'Discover new AI tools, explore real-world applications and learn from experts.',
  },
  {
    icon: IconMessageCircle2,
    title: 'Discussions',
    body: 'Exchange ideas, ask questions and explore the future of AI together.',
  },
  {
    icon: IconUsersGroup,
    title: 'Community',
    body: 'Connect with students from different backgrounds who share a curiosity for AI.',
  },
]

export const MissionStrip: FC = () => {
  return (
    <Box>
      <SectionHeading eyebrow="What we do" title="Talks, coding projects and socials." />

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
