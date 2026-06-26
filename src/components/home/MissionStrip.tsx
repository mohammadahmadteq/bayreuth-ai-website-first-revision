import { type FC } from 'react'
import { Box, SimpleGrid, Stack, Text } from '@mantine/core'
import { IconBulb, IconUsersGroup, IconShieldHalf } from '@tabler/icons-react'
import { FadeInWhenVisible } from '../ui/FadeInWhenVisible'
import { SectionHeading } from '../ui/SectionHeading'

const PILLARS = [
  {
    icon: IconBulb,
    title: 'Learn by building',
    body: 'We favour hands-on projects over passive lectures — you leave with something you actually made.',
  },
  {
    icon: IconUsersGroup,
    title: 'Open to every major',
    body: 'Computer scientists, biologists, economists, philosophers — AI is interdisciplinary, and so are we.',
  },
  {
    icon: IconShieldHalf,
    title: 'Thoughtful, not hype-driven',
    body: 'We care about doing AI well: rigorous, safe, and honest about what these systems can and cannot do.',
  },
]

export const MissionStrip: FC = () => {
  return (
    <Box>
      <SectionHeading
        eyebrow="Our mission"
        title="Serious about AI, warm about people."
        subtitle="The Bayreuth AI Association is a space for students to explore artificial intelligence together — academically credible, but genuinely welcoming."
      />

      <SimpleGrid cols={{ base: 1, md: 3 }} spacing={20} mt={48}>
        {PILLARS.map((p, i) => (
          <FadeInWhenVisible key={p.title} delay={i * 0.1}>
            <Stack
              gap={14}
              className="glow-card glow-card--lift"
              style={{ padding: 28, height: '100%' }}
            >
              <Box
                style={{
                  width: 46,
                  height: 46,
                  borderRadius: 12,
                  display: 'grid',
                  placeItems: 'center',
                  background: 'rgba(45,224,200,0.1)',
                  border: '1px solid rgba(45,224,200,0.25)',
                }}
              >
                <p.icon size={22} color="var(--teal)" stroke={1.7} />
              </Box>
              <Text
                fw={700}
                ff="Space Grotesk, sans-serif"
                fz={19}
                style={{ color: 'var(--color-text)' }}
              >
                {p.title}
              </Text>
              <Text style={{ color: 'var(--color-subtext)', fontSize: 15, lineHeight: 1.6 }}>
                {p.body}
              </Text>
            </Stack>
          </FadeInWhenVisible>
        ))}
      </SimpleGrid>
    </Box>
  )
}
