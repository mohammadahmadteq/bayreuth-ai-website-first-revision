import { type FC } from 'react'
import { Box, Group, Stack, Text } from '@mantine/core'
import { IconFileText } from '@tabler/icons-react'
import { FadeInWhenVisible } from '../ui/FadeInWhenVisible'

interface Session {
  week: number
  title: string
  readings: string
}

// Curriculum content lives here until it graduates to a data file.
const SYLLABUS: Session[] = [
  {
    week: 1,
    title: 'The Alignment Problem',
    readings: 'Why AI safety? Outer vs. inner alignment; the case for caring.',
  },
  {
    week: 2,
    title: 'Reward Misspecification',
    readings: 'Specification gaming, reward hacking, and Goodhart’s law.',
  },
  {
    week: 3,
    title: 'RLHF & Preference Learning',
    readings: 'Learning from human feedback — strengths and failure modes.',
  },
  {
    week: 4,
    title: 'Interpretability',
    readings: 'Mechanistic interpretability and probing what models “know”.',
  },
  {
    week: 5,
    title: 'Scalable Oversight',
    readings: 'Debate, recursive reward modelling, and weak-to-strong generalisation.',
  },
  {
    week: 6,
    title: 'Governance & Deployment',
    readings: 'Evals, red-teaming, and responsible release practices.',
  },
]

export const ReadingGroupList: FC = () => {
  return (
    <Stack gap={12}>
      {SYLLABUS.map((s, i) => (
        <FadeInWhenVisible key={s.week} delay={i * 0.05} y={16}>
          <Group
            gap={20}
            align="flex-start"
            wrap="nowrap"
            className="glow-card"
            style={{ padding: '18px 22px' }}
          >
            <Box
              style={{
                minWidth: 44,
                height: 44,
                borderRadius: 10,
                display: 'grid',
                placeItems: 'center',
                background: 'var(--color-surface-strong)',
                border: '1px solid var(--border)',
              }}
            >
              <Text
                ff="Space Grotesk, sans-serif"
                fw={700}
                fz={12}
                style={{ color: 'var(--teal)' }}
              >
                W{s.week}
              </Text>
            </Box>
            <Stack gap={4}>
              <Text
                fw={700}
                ff="Space Grotesk, sans-serif"
                fz={16}
                style={{ color: 'var(--color-text)' }}
              >
                {s.title}
              </Text>
              <Group gap={7} align="flex-start" wrap="nowrap">
                <IconFileText
                  size={14}
                  color="var(--color-subtext)"
                  style={{ marginTop: 3, flexShrink: 0 }}
                />
                <Text fz={14} style={{ color: 'var(--color-subtext)', lineHeight: 1.5 }}>
                  {s.readings}
                </Text>
              </Group>
            </Stack>
          </Group>
        </FadeInWhenVisible>
      ))}
    </Stack>
  )
}
