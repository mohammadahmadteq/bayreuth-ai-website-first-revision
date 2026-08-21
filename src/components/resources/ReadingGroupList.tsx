import { type FC } from 'react'
import { Group, Stack, Text } from '@mantine/core'

const SYLLABUS = [
  { week: 1, title: 'The Alignment Problem' },
  { week: 2, title: 'Reward Misspecification' },
  { week: 3, title: 'RLHF & Preference Learning' },
  { week: 4, title: 'Interpretability' },
  { week: 5, title: 'Scalable Oversight' },
  { week: 6, title: 'Governance & Deployment' },
]

export const ReadingGroupList: FC = () => {
  return (
    <Stack gap={0}>
      {SYLLABUS.map((s) => (
        <Group
          key={s.week}
          gap={16}
          wrap="nowrap"
          style={{ padding: '14px 4px', borderBottom: '1px solid var(--border)' }}
        >
          <Text ff='"Source Sans 3", sans-serif' fw={700} fz={13} style={{ color: 'var(--teal)' }}>
            W{s.week}
          </Text>
          <Text fz={15} style={{ color: 'var(--color-text)' }}>
            {s.title}
          </Text>
        </Group>
      ))}
    </Stack>
  )
}
