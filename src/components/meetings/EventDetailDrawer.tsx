import { type FC } from 'react'
import { Box, Drawer, Group, Stack, Text } from '@mantine/core'
import { IconCalendarPlus, IconClock, IconMapPin, IconUsers } from '@tabler/icons-react'
import type { EventItem } from '../../types/content'
import { downloadICS } from '../../lib/ics'
import { Badge } from '../ui/Badge'
import { JoinButton } from '../ui/JoinButton'

interface EventDetailDrawerProps {
  event: EventItem | null
  onClose: () => void
}

export const EventDetailDrawer: FC<EventDetailDrawerProps> = ({ event, onClose }) => {
  const date = event ? new Date(event.date) : null

  return (
    <Drawer
      opened={Boolean(event)}
      onClose={onClose}
      position="right"
      size={460}
      padding={0}
      withCloseButton
      title=""
      overlayProps={{ backgroundOpacity: 0.45, blur: 3 }}
      styles={{
        content: { background: 'var(--color-bg)', display: 'flex', flexDirection: 'column' },
        header: { background: 'var(--color-bg)', paddingInline: 24, paddingBlock: 16 },
        close: { color: 'var(--color-subtext)' },
        body: { flex: 1, minHeight: 0, overflowY: 'auto', padding: '0 24px 24px' },
      }}
    >
      {event && date && (
        <Stack gap={24}>
          <Group gap={18} align="flex-start" wrap="nowrap">
            <Stack gap={0} align="center" style={{ minWidth: 52, flexShrink: 0 }}>
              <Text
                ff='"Source Sans 3", sans-serif'
                fw={700}
                fz={32}
                style={{ color: 'var(--color-text)', lineHeight: 1 }}
              >
                {date.toLocaleDateString('en-GB', { day: '2-digit' })}
              </Text>
              <Text fw={700} fz={11} style={{ color: 'var(--teal)', letterSpacing: '0.08em' }}>
                {date.toLocaleDateString('en-GB', { month: 'short' }).toUpperCase()}
              </Text>
              <Text
                fw={600}
                fz={11}
                style={{ color: 'var(--color-subtext)', letterSpacing: '0.08em' }}
              >
                {date.toLocaleDateString('en-GB', { weekday: 'short' }).toUpperCase()}
              </Text>
            </Stack>

            <Stack gap={10} style={{ minWidth: 0 }}>
              <Box>
                <Badge variant={event.isFeatured ? 'accent' : 'muted'}>{event.category}</Badge>
              </Box>
              <Text
                component="h2"
                ff='"Source Sans 3", sans-serif'
                fw={700}
                fz={26}
                style={{
                  color: 'var(--color-text)',
                  lineHeight: 1.15,
                  letterSpacing: '-0.02em',
                  margin: 0,
                }}
              >
                {event.title}
              </Text>
            </Stack>
          </Group>

          <Stack gap={12}>
            <DetailRow icon={IconClock} value={event.time} />
            <DetailRow icon={IconMapPin} value={event.location} />
            <DetailRow icon={IconUsers} value="Open to everyone — no preparation required" />
          </Stack>

          <Stack gap={10} pt={20} style={{ borderTop: '1px solid var(--border)' }}>
            <Text fw={700} fz={15} style={{ color: 'var(--color-text)' }}>
              About this date
            </Text>
            <Text fz={15} style={{ color: 'var(--color-subtext)', lineHeight: 1.65 }}>
              {event.description}
            </Text>
          </Stack>

          <Group gap={12} pt={8}>
            <JoinButton size="sm" withArrow={false} onClick={() => downloadICS([event], event.id)}>
              <IconCalendarPlus size={17} stroke={2} />
              Add to calendar
            </JoinButton>
          </Group>
        </Stack>
      )}
    </Drawer>
  )
}

const DetailRow: FC<{ icon: typeof IconClock; value: string }> = ({ icon: Icon, value }) => (
  <Group gap={12} wrap="nowrap" align="flex-start">
    <Icon size={18} color="var(--teal)" stroke={1.8} style={{ flexShrink: 0, marginTop: 1 }} />
    <Text fz={15} style={{ color: 'var(--color-text)', lineHeight: 1.5 }}>
      {value}
    </Text>
  </Group>
)
