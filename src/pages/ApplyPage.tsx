import { type FC } from 'react'
import { Box, Container, Group, List, Stack, Text, ThemeIcon } from '@mantine/core'
import { IconCheck, IconMail, IconCalendarHeart } from '@tabler/icons-react'
import { PageHeader } from '../components/layout/PageHeader'
import { JoinButton } from '../components/ui/JoinButton'
import { FadeInWhenVisible } from '../components/ui/FadeInWhenVisible'

const APPLY_EMAIL = 'bayreuth.ai@gmail.com'

const REASONS = [
  'Work on real AI projects with a supportive, interdisciplinary team.',
  'Learn through tracks, workshops, and reading groups at every level.',
  'Meet students from across the university who share your curiosity.',
  'Build a portfolio, find collaborators, and get mentorship.',
]

const EXPECTATIONS = [
  'Show up when you can — there’s no attendance quota.',
  'Be kind, curious, and open to people from other backgrounds.',
  'No prior AI, maths, or coding experience required.',
  'Membership is free for University of Bayreuth students.',
]

export const ApplyPage: FC = () => {
  return (
    <>
      <PageHeader
        eyebrow="Become a Member"
        title="Join the association."
        subtitle="If you’re curious about AI, you already belong here. Here’s what to expect and how to get started."
      />

      <Container size={920} px={24} py={{ base: 56, md: 88 }}>
        <Stack gap={48}>
          <FadeInWhenVisible>
            <Stack gap={18} className="glow-card" style={{ padding: 'clamp(24px, 4vw, 40px)' }}>
              <Text
                ff="Space Grotesk, sans-serif"
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
                      background: 'rgba(45,224,200,0.15)',
                      border: '1px solid rgba(45,224,200,0.3)',
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
                ff="Space Grotesk, sans-serif"
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
                      background: 'rgba(57,255,106,0.15)',
                      border: '1px solid rgba(57,255,106,0.3)',
                    }}
                  >
                    <IconCheck size={14} color="var(--neon)" />
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

          {/* TODO: replace this mailto block with an embedded application form
              (e.g. Tally / Typeform / Google Form) once the association picks a tool. */}
          <FadeInWhenVisible delay={0.16}>
            <Box
              style={{
                textAlign: 'center',
                borderRadius: 24,
                padding: 'clamp(36px, 6vw, 64px) 24px',
                border: '1px solid var(--border-glow)',
                background:
                  'linear-gradient(135deg, rgba(45,224,200,0.1), rgba(57,255,106,0.05) 60%, transparent)',
              }}
            >
              <Stack gap={22} align="center">
                <Text
                  ff="Space Grotesk, sans-serif"
                  fw={700}
                  fz="clamp(24px, 4.5vw, 38px)"
                  style={{ color: 'var(--color-text)' }}
                >
                  Ready when you are.
                </Text>
                <Text
                  style={{
                    color: 'var(--color-subtext)',
                    fontSize: 16,
                    maxWidth: 520,
                    lineHeight: 1.6,
                  }}
                >
                  The easiest first step is simply to come to a meeting. Or send us a quick message
                  and we’ll add you to the mailing list and Discord.
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
                <Group gap={8} justify="center">
                  <IconCalendarHeart size={16} color="var(--color-subtext)" />
                  <Text fz={14} style={{ color: 'var(--color-subtext)' }}>
                    Next meeting: every other Thursday, 18:00 · Room S122, GW I
                  </Text>
                </Group>
              </Stack>
            </Box>
          </FadeInWhenVisible>
        </Stack>
      </Container>
    </>
  )
}
