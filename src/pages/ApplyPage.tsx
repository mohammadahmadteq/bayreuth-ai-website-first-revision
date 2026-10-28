import { type FC } from 'react'
import { Link } from 'react-router-dom'
import { Anchor, Box, Container, Group, List, Stack, Text, ThemeIcon } from '@mantine/core'
import { IconCheck, IconMail, IconCalendarHeart } from '@tabler/icons-react'
import { PageHeader } from '../components/layout/PageHeader'
import { JoinButton } from '../components/ui/JoinButton'
import { FadeInWhenVisible } from '../components/ui/FadeInWhenVisible'
import { useSiteContent } from '../hooks/useSiteContent'
import { formatEventDate } from '../lib/dates'
import { getUpcomingEvents } from '../lib/events'
import { MAILING_LIST_URL, WHATSAPP_URL } from '../lib/utils'

const APPLY_EMAIL = 'bayreuth.ai@gmail.com'

const INLINE_LINK = {
  color: 'var(--teal)',
  fontWeight: 600,
  textDecoration: 'underline',
  textUnderlineOffset: 3,
}

const REASONS = [
  'Work on AI projects with students from other disciplines.',
  'Hear guest talks from researchers and companies, and join our workshops.',
  'Meet students from across the university who share your curiosity.',
  'Find people to build projects with.',
]

const EXPECTATIONS = [
  'Come when you can. There’s no attendance requirement.',
  'Be kind, curious, and open to people from other backgrounds.',
  'No prior AI, maths, or coding experience required.',
  'Membership is 12 euros per calendar year, with discounts depending on your circumstances.',
]

// The first two come from § 4 of the statutes; project credit is the association's practice.
const MEMBER_BENEFITS = [
  'Vote, speak and put forward motions at the general meeting.',
  'Ask the board for a confirmation of your involvement or a letter of recommendation.',
  'Get credit for your contributions to our projects.',
]

export const ApplyPage: FC = () => {
  // Same source as the home page and footer, so they all name the same next date.
  const { events } = useSiteContent()
  const nextEvent = getUpcomingEvents(events)[0]

  return (
    <>
      <PageHeader
        eyebrow="Join Us"
        title="Join the association."
        subtitle="No matter your background, if you’re excited about AI, there’s a place for you in our community."
      />

      <Container size={920} px={24} py={{ base: 32, md: 48 }}>
        <Stack gap={64}>
          <FadeInWhenVisible>
            <Stack gap={18} className="glow-card" style={{ padding: 'clamp(24px, 4vw, 40px)' }}>
              <Text
                ff='"Source Sans 3", sans-serif'
                fw={700}
                fz={24}
                style={{ color: 'var(--color-text)' }}
              >
                Why join
              </Text>
              <List
                spacing="sm"
                icon={
                  <ThemeIcon
                    size={22}
                    radius="xl"
                    style={{
                      background: 'rgba(var(--teal-rgb),0.15)',
                      border: '1px solid rgba(var(--teal-rgb),0.3)',
                    }}
                  >
                    <IconCheck size={14} color="var(--teal)" />
                  </ThemeIcon>
                }
              >
                {REASONS.map((r) => (
                  <List.Item key={r}>
                    <Text component="span" style={{ color: 'var(--color-subtext)', fontSize: 15 }}>
                      {r}
                    </Text>
                  </List.Item>
                ))}
              </List>
            </Stack>
          </FadeInWhenVisible>

          <FadeInWhenVisible delay={0.08}>
            <Stack gap={18} className="glow-card" style={{ padding: 'clamp(24px, 4vw, 40px)' }}>
              <Text
                ff='"Source Sans 3", sans-serif'
                fw={700}
                fz={24}
                style={{ color: 'var(--color-text)' }}
              >
                What we expect
              </Text>
              <List
                spacing="sm"
                icon={
                  <ThemeIcon
                    size={22}
                    radius="xl"
                    style={{
                      background: 'rgba(var(--teal-dark-rgb),0.15)',
                      border: '1px solid rgba(var(--teal-dark-rgb),0.4)',
                    }}
                  >
                    <IconCheck size={14} color="var(--teal-dark)" />
                  </ThemeIcon>
                }
              >
                {EXPECTATIONS.map((e) => (
                  <List.Item key={e}>
                    <Text component="span" style={{ color: 'var(--color-subtext)', fontSize: 15 }}>
                      {e}
                    </Text>
                  </List.Item>
                ))}
              </List>
            </Stack>
          </FadeInWhenVisible>

          <FadeInWhenVisible delay={0.12}>
            <Stack
              gap={14}
              align="flex-start"
              className="glow-card"
              style={{ padding: 'clamp(24px, 4vw, 40px)' }}
            >
              <Text
                ff='"Source Sans 3", sans-serif'
                fw={700}
                fz={24}
                style={{ color: 'var(--color-text)' }}
              >
                Becoming a member
              </Text>
              <Text style={{ color: 'var(--color-subtext)', fontSize: 15, lineHeight: 1.6 }}>
                You don’t need to sign up for our meetings and events. To become a member of the
                association, fill in the membership application.
              </Text>
              <JoinButton to="/membership" size="sm">
                Apply for membership
              </JoinButton>
            </Stack>
          </FadeInWhenVisible>

          <FadeInWhenVisible delay={0.16}>
            <Box
              style={{
                textAlign: 'center',
                borderRadius: 12,
                padding: 'clamp(36px, 6vw, 64px) 24px',
                border: '1px solid var(--border-strong)',
                background: 'rgba(var(--teal-rgb),0.06)',
              }}
            >
              <Stack gap={22} align="center">
                <Text
                  ff='"Source Sans 3", sans-serif'
                  fw={700}
                  fz="clamp(24px, 4.5vw, 38px)"
                  style={{ color: 'var(--color-text)' }}
                >
                  The easiest first step is to come to a meeting.
                </Text>
                <Text
                  style={{
                    color: 'var(--color-subtext)',
                    fontSize: 16,
                    maxWidth: 520,
                    lineHeight: 1.6,
                  }}
                >
                  You can also join our{' '}
                  <Anchor
                    href={WHATSAPP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={INLINE_LINK}
                  >
                    WhatsApp group
                  </Anchor>{' '}
                  or sign up for the{' '}
                  <Anchor
                    href={MAILING_LIST_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={INLINE_LINK}
                  >
                    mailing list
                  </Anchor>
                  .
                </Text>
                <Group gap={14} justify="center">
                  <JoinButton
                    href={`mailto:${APPLY_EMAIL}?subject=I%27d%20like%20to%20join%20Bayreuth%20AI`}
                    withArrow={false}
                  >
                    <Group gap={8}>
                      <IconMail size={16} />
                      Email {APPLY_EMAIL}
                    </Group>
                  </JoinButton>
                </Group>
                <Stack gap={4} align="center">
                  <Group gap={8} justify="center">
                    <IconCalendarHeart size={16} color="var(--color-subtext)" />
                    <Text fz={14} style={{ color: 'var(--color-subtext)' }}>
                      {nextEvent ? `Next up: ${nextEvent.title}` : 'No upcoming dates yet.'}
                    </Text>
                  </Group>
                  {nextEvent && (
                    <Text fz={14} style={{ color: 'var(--color-subtext)' }}>
                      {formatEventDate(nextEvent.date)} · {nextEvent.time} · {nextEvent.location}
                    </Text>
                  )}
                  <Anchor component={Link} to="/meetings" fz={14} style={INLINE_LINK}>
                    See all dates
                  </Anchor>
                </Stack>
              </Stack>
            </Box>
          </FadeInWhenVisible>
        </Stack>
      </Container>
    </>
  )
}
