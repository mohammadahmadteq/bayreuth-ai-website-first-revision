import { type FC } from 'react'
import { Box, SimpleGrid, Stack, Text } from '@mantine/core'
import { SectionHeading } from '../ui/SectionHeading'

/**
 * "Open to everyone" — concise, credible framing for both tracks the
 * association serves. No per-major pill wall; just the two things a visitor
 * actually needs to hear.
 */
export const OpenToEveryoneSection: FC = () => {
  return (
    <Box>
      <SectionHeading
        eyebrow="Open to everyone"
        title="Any background. Any level."
        subtitle="AI touches every discipline — so does our community. Business, law, economics, philosophy, computer science, and everything between."
      />

      <SimpleGrid cols={{ base: 1, md: 2 }} spacing={32} mt={40}>
        <Stack
          gap={10}
          className="glow-card"
          style={{ padding: 'clamp(24px, 3vw, 32px)' }}
        >
          <Text fw={600} ff='"Source Sans 3", sans-serif' fz={17} style={{ color: 'var(--color-text)' }}>
            New to AI
          </Text>
          <Text style={{ color: 'var(--color-subtext)', fontSize: 15, lineHeight: 1.65 }}>
            No programming, maths, or AI background required to join. Come as you are, ask
            questions, and learn alongside people who started the same way.
          </Text>
        </Stack>

        <Stack
          gap={10}
          className="glow-card"
          style={{ padding: 'clamp(24px, 3vw, 32px)' }}
        >
          <Text fw={600} ff='"Source Sans 3", sans-serif' fz={17} style={{ color: 'var(--color-text)' }}>
            Already experienced
          </Text>
          <Text style={{ color: 'var(--color-subtext)', fontSize: 15, lineHeight: 1.65 }}>
            Contribute to real projects, review code, experiment with models, and work with
            other technically strong members on things worth building.
          </Text>
        </Stack>
      </SimpleGrid>
    </Box>
  )
}
