import { type FC } from 'react'
import { Group, SimpleGrid, Stack, Text } from '@mantine/core'
import {
  IconBuilding,
  IconDatabase,
  IconPresentation,
  IconUsersGroup,
  type TablerIcon,
} from '@tabler/icons-react'
import { FadeInWhenVisible } from '../ui/FadeInWhenVisible'

interface Way {
  icon: TablerIcon
  title: string
  body: string
}

const WAYS: Way[] = [
  {
    icon: IconPresentation,
    title: 'Give a talk',
    body: 'Speak at one of our Thursday meetings.',
  },
  {
    icon: IconBuilding,
    title: 'Host a company visit',
    body: 'Show our members around your company.',
  },
  {
    icon: IconDatabase,
    title: 'Suggest a project',
    body: 'Bring a dataset or a problem for one of our projects.',
  },
  {
    icon: IconUsersGroup,
    title: 'Meet students',
    body: 'Get to know members looking for internships or thesis topics.',
  },
]

export const PartnerBenefitsList: FC = () => {
  return (
    <SimpleGrid cols={{ base: 1, sm: 2 }} spacing={20}>
      {WAYS.map((b, i) => (
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
                background: 'rgba(var(--teal-rgb),0.1)',
                border: '1px solid rgba(var(--teal-rgb),0.25)',
              }}
            >
              <b.icon size={22} color="var(--teal)" stroke={1.7} />
            </Group>
            <Stack gap={6}>
              <Text
                fw={700}
                ff='"Source Sans 3", sans-serif'
                fz={18}
                style={{ color: 'var(--color-text)' }}
              >
                {b.title}
              </Text>
              <Text fz={16} style={{ color: 'var(--color-subtext)', lineHeight: 1.6 }}>
                {b.body}
              </Text>
            </Stack>
          </Group>
        </FadeInWhenVisible>
      ))}
    </SimpleGrid>
  )
}
