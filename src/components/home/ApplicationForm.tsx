import { type FC } from 'react'
import { Box, Group, Stack, Text } from '@mantine/core'
import { IconBrandWhatsapp, IconMailForward } from '@tabler/icons-react'
import { JoinButton } from '../ui/JoinButton'
import { SectionHeading } from '../ui/SectionHeading'

const FORM_URL =
  'https://docs.google.com/forms/d/e/1FAIpQLScTbesmOr2YlF4quGRcLc-6ytu5cvZp2n648GIOHrFjUx6PQg/viewform?embedded=true'

export const ApplicationForm: FC = () => {
  return (
    <Stack gap={28} id="join">
      <SectionHeading
        eyebrow="Join in"
        title="Start with the mailing list, then come to a Thursday meeting."
        subtitle="The association uses this official form for updates. Meetings during lecture period are every other Thursday from 18:00 to 19:30 in room S122, GW I."
      />
      <Box
        className="glow-card application-form"
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 0.9fr) minmax(320px, 1.1fr)',
          gap: 0,
          overflow: 'hidden',
        }}
      >
        <Stack
          gap={18}
          style={{
            padding: 'clamp(24px, 4vw, 40px)',
            borderRight: '1px solid var(--border)',
          }}
        >
          <Text ff="Space Grotesk, sans-serif" fw={700} fz={24} style={{ color: 'var(--color-text)' }}>
            No prior AI background required.
          </Text>
          <Text style={{ color: 'var(--color-subtext)', lineHeight: 1.65 }}>
            Whether you are just starting or already building with machine learning, the community is
            meant to be open, practical, and interdisciplinary.
          </Text>
          <Group gap={12}>
            <JoinButton
              href="https://chat.whatsapp.com/CYZelJF7rDYFkEuz94n86j"
              withArrow={false}
              size="sm"
            >
              <Group gap={8}>
                <IconBrandWhatsapp size={16} />
                WhatsApp group
              </Group>
            </JoinButton>
            <JoinButton
              href="https://docs.google.com/forms/d/e/1FAIpQLScTbesmOr2YlF4quGRcLc-6ytu5cvZp2n648GIOHrFjUx6PQg/viewform?usp=sf_link"
              withArrow={false}
              size="sm"
              className="btn-member--quiet"
            >
              <Group gap={8}>
                <IconMailForward size={16} />
                Open form
              </Group>
            </JoinButton>
          </Group>
        </Stack>

        <Box style={{ minHeight: 520, background: '#fff' }}>
          <iframe
            title="Bayreuth AI Association mailing list form"
            src={FORM_URL}
            style={{
              width: '100%',
              height: 520,
              border: 0,
              display: 'block',
            }}
          >
            Loading...
          </iframe>
        </Box>
      </Box>
    </Stack>
  )
}
