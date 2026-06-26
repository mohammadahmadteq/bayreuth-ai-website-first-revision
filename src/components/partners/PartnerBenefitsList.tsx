import { type FC } from 'react'
import { Group, SimpleGrid, Stack, Text } from '@mantine/core'
import {
  IconUsersGroup,
  IconSpeakerphone,
  IconPresentation,
  IconBriefcase,
  type TablerIcon,
} from '@tabler/icons-react'
import { FadeInWhenVisible } from '../ui/FadeInWhenVisible'

interface Benefit {
  icon: TablerIcon
  title: string
  body: string
}

const BENEFITS: Benefit[] = [
  {
    icon: IconUsersGroup,
    title: 'Access to a talent pool',
    body: 'Connect with motivated, interdisciplinary students for internships, theses, and hires.',
  },
  {
    icon: IconSpeakerphone,
    title: 'Branding at events',
    body: 'Your logo and presence at talks, workshops, and our annual hackathon.',
  },
  {
    icon: IconPresentation,
    title: 'Co-hosted workshops',
    body: 'Run a session on your tech stack or research and engage directly with members.',
  },
  {
    icon: IconBriefcase,
    title: 'Real-world projects',
    body: 'Bring a problem to our project teams and see student-built prototypes in a semester.',
  },
]

export const PartnerBenefitsList: FC = () => {
  return (
    <SimpleGrid cols={{ base: 1, sm: 2 }} spacing={20}>
      {BENEFITS.map((b, i) => (
        <FadeInWhenVisible key={b.title} delay={(i % 2) * 0.08}>
          <Group
            gap={16}
            align="flex-start"
            wrap="nowrap"
            className="glow-card"
            style={{ padding: 24, height: '100%' }}
          >
            <Group
              style={{
                width: 46,
                height: 46,
                borderRadius: 12,
                flexShrink: 0,
                display: 'grid',
                placeItems: 'center',
                background: 'rgba(57,255,106,0.1)',
                border: '1px solid rgba(57,255,106,0.25)',
              }}
            >
              <b.icon size={22} color="var(--neon)" stroke={1.7} />
            </Group>
            <Stack gap={6}>
              <Text
                fw={700}
                ff="Space Grotesk, sans-serif"
                fz={18}
                style={{ color: 'var(--color-text)' }}
              >
                {b.title}
              </Text>
              <Text fz={14} style={{ color: 'var(--color-subtext)', lineHeight: 1.6 }}>
                {b.body}
              </Text>
            </Stack>
          </Group>
        </FadeInWhenVisible>
      ))}
    </SimpleGrid>
  )
}
