import { type FC } from 'react'
import { Box, Group, Stack, Text } from '@mantine/core'
import { IconMapPin, IconClock, IconCalendarRepeat, type TablerIcon } from '@tabler/icons-react'

interface InfoRow {
  icon: TablerIcon
  label: string
  value: string
}

const ROWS: InfoRow[] = [
  { icon: IconCalendarRepeat, label: 'When', value: 'Every other Thursday · 18:00–20:00' },
  { icon: IconMapPin, label: 'Where', value: 'Room S122, GW I — University of Bayreuth' },
  { icon: IconClock, label: 'Format', value: '20 min talk · project hacking · open discussion' },
]

export const MeetingInfoCard: FC = () => {
  return (
    <Stack gap={20} className="glow-card" style={{ padding: 'clamp(24px, 4vw, 40px)' }}>
      <Text ff="Space Grotesk, sans-serif" fw={700} fz={22} style={{ color: 'var(--color-text)' }}>
        Recurring meeting
      </Text>
      <Stack gap={18}>
        {ROWS.map((row) => (
          <Group key={row.label} gap={16} align="flex-start" wrap="nowrap">
            <Box
              style={{
                width: 42,
                height: 42,
                borderRadius: 12,
                flexShrink: 0,
                display: 'grid',
                placeItems: 'center',
                background: 'rgba(45,224,200,0.1)',
                border: '1px solid rgba(45,224,200,0.25)',
              }}
            >
              <row.icon size={20} color="var(--teal)" stroke={1.7} />
            </Box>
            <Stack gap={2}>
              <Text
                fz={12}
                tt="uppercase"
                fw={700}
                style={{ letterSpacing: '0.12em', color: 'var(--color-subtext)' }}
              >
                {row.label}
              </Text>
              <Text fz={16} fw={500} style={{ color: 'var(--color-text)' }}>
                {row.value}
              </Text>
            </Stack>
          </Group>
        ))}
      </Stack>
    </Stack>
  )
}
