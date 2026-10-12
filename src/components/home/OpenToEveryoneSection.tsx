import { type FC } from 'react'
import { Box, SimpleGrid, Stack, Text } from '@mantine/core'
import { SectionHeading } from '../ui/SectionHeading'

export const OpenToEveryoneSection: FC = () => {
  return (
    <Box>
      <SectionHeading
        eyebrow="Open to everyone"
        title="Open to every background and level."
        subtitle="Whether you are new to AI or experienced, there is a place for you here."
      />

      <SimpleGrid cols={{ base: 1, md: 2 }} spacing={32} mt={40}>
        <Stack gap={10} className="glow-card" style={{ padding: 'clamp(24px, 3vw, 32px)' }}>
          <Text
            fw={600}
            ff='"Source Sans 3", sans-serif'
            fz={17}
            style={{ color: 'var(--color-text)' }}
          >
            New to AI
          </Text>
          <Text style={{ color: 'var(--color-subtext)', fontSize: 15, lineHeight: 1.65 }}>
            You don’t need any programming, maths or AI background to join. Ask questions and learn
            with people who started out the same way.
          </Text>
        </Stack>

        <Stack gap={10} className="glow-card" style={{ padding: 'clamp(24px, 3vw, 32px)' }}>
          <Text
            fw={600}
            ff='"Source Sans 3", sans-serif'
            fz={17}
            style={{ color: 'var(--color-text)' }}
          >
            Already experienced
          </Text>
          <Text style={{ color: 'var(--color-subtext)', fontSize: 15, lineHeight: 1.65 }}>
            Join a coding project, share what you know at a skill-sharing evening, or give a talk
            yourself.
          </Text>
        </Stack>
      </SimpleGrid>
    </Box>
  )
}
