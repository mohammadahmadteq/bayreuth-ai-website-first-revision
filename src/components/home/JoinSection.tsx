import { type FC } from 'react'
import { Box, Group, Stack, Text } from '@mantine/core'
import { IconBrandWhatsapp, IconCalendarTime } from '@tabler/icons-react'
import { JoinButton } from '../ui/JoinButton'
import { SectionHeading } from '../ui/SectionHeading'
import { WHATSAPP_URL } from '../../lib/utils'

export const JoinSection: FC = () => {
  return (
    <Stack gap={28} id="join">
      <SectionHeading
        eyebrow="Join in"
        title="Join the WhatsApp group, then come to a Thursday meeting."
        subtitle="Meetings run every other Thursday, 18:00–19:30, in room S122, GW I."
      />

      <Box
        className="glow-card"
        style={{
          padding: 'clamp(40px, 7vw, 76px) clamp(24px, 4vw, 48px)',
          textAlign: 'center',
          background: 'rgba(var(--teal-rgb), 0.05)',
        }}
      >
        <Stack gap={26} align="center">
          <Stack gap={10} align="center">
            <Text
              ff='"Source Sans 3", sans-serif'
              fw={700}
              fz="clamp(24px, 4vw, 36px)"
              style={{ color: 'var(--color-text)' }}
            >
              No prior AI background required.
            </Text>
            <Text
              style={{
                color: 'var(--color-subtext)',
                lineHeight: 1.65,
                fontSize: 'clamp(15px, 1.6vw, 17px)',
                maxWidth: 520,
              }}
            >
              Beginners and builders alike — open, practical, interdisciplinary.
            </Text>
          </Stack>

          <JoinButton href={WHATSAPP_URL} size="lg" withArrow={false}>
            <IconBrandWhatsapp size={20} stroke={2.2} />
            Join Us on WhatsApp
          </JoinButton>

          <Group gap={8} justify="center">
            <IconCalendarTime size={16} color="var(--color-subtext)" />
            <Text fz={16} style={{ color: 'var(--color-subtext)' }}>
              Next up: every other Thursday, 18:00 · Room S122, GW I
            </Text>
          </Group>
        </Stack>
      </Box>
    </Stack>
  )
}
