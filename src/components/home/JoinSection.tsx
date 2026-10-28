import { type FC } from 'react'
import { Link } from 'react-router-dom'
import { Box, Group, Stack, Text } from '@mantine/core'
import { IconBrandWhatsapp, IconCalendarTime } from '@tabler/icons-react'
import { JoinButton } from '../ui/JoinButton'
import { SectionHeading } from '../ui/SectionHeading'
import { WHATSAPP_URL } from '../../lib/utils'
import { formatEventDate } from '../../lib/dates'
import type { EventItem } from '../../types/content'

export const JoinSection: FC<{ nextEvent?: EventItem }> = ({ nextEvent }) => {
  return (
    <Stack gap={28} id="join">
      <SectionHeading
        eyebrow="Join in"
        title="Join the WhatsApp group, then come to our next event."
        subtitle={
          nextEvent
            ? `${nextEvent.title} · ${formatEventDate(nextEvent.date)} · ${nextEvent.time}`
            : 'Join the group to hear when our next event is announced.'
        }
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
              Our meetings and events are open to everyone. They’re generally free and you don’t
              need to sign up, so just come along when you’re ready. If you take part regularly, you
              can also{' '}
              <Link to="/apply" className="inline-link">
                become an official member
              </Link>
              .
            </Text>
          </Stack>

          <JoinButton href={WHATSAPP_URL} size="lg" withArrow={false}>
            <IconBrandWhatsapp size={20} stroke={2.2} />
            Join Us on WhatsApp
          </JoinButton>

          <Group gap={8} justify="center">
            <IconCalendarTime size={16} color="var(--color-subtext)" />
            <Text fz={16} style={{ color: 'var(--color-subtext)' }}>
              {nextEvent
                ? `Next up: ${formatEventDate(nextEvent.date)} · ${nextEvent.time} · ${nextEvent.location}`
                : 'No upcoming events scheduled yet — check back soon.'}
            </Text>
          </Group>
        </Stack>
      </Box>
    </Stack>
  )
}
