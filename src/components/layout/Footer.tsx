import { type FC } from 'react'
import { Link } from 'react-router-dom'
import { Box, Container, Group, Stack, Text, SimpleGrid } from '@mantine/core'
import { IconBrandLinkedin, IconBrandInstagram, IconMail } from '@tabler/icons-react'

const NAV = [
  { to: '/meetings', label: 'Meetings' },
  { to: '/team', label: 'Team' },
  { to: '/dates', label: 'Important Dates' },
  { to: '/resources', label: 'Resources' },
  { to: '/projects', label: 'Projects' },
  { to: '/partners', label: 'Partners' },
  { to: '/apply', label: 'Become a Member' },
]

export const Footer: FC = () => {
  return (
    <Box
      component="footer"
      style={{
        borderTop: '1px solid var(--border)',
        background: 'var(--color-bg-2)',
        marginTop: 96,
      }}
    >
      <Container size={1280} py={56} px={24}>
        <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing={40}>
          <Stack gap={14}>
            <Group gap={10}>
              <Box
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 8,
                  background: 'linear-gradient(120deg, var(--teal), var(--neon))',
                  display: 'grid',
                  placeItems: 'center',
                  fontFamily: 'Space Grotesk, sans-serif',
                  fontWeight: 800,
                  color: '#04140f',
                  fontSize: 14,
                }}
              >
                ai
              </Box>
              <Text fw={700} ff="Space Grotesk, sans-serif" style={{ color: 'var(--color-text)' }}>
                Bayreuth AI Association e.V.
              </Text>
            </Group>
            <Text
              style={{
                color: 'var(--color-subtext)',
                fontSize: 14,
                lineHeight: 1.6,
                maxWidth: 320,
              }}
            >
              A student initiative at the University of Bayreuth — exploring, building, and
              discussing AI together. Serious, but warm.
            </Text>
            <Group gap={10} mt={4}>
              <a
                href="mailto:bayreuth.ai@gmail.com"
                aria-label="Email"
                style={{ color: 'var(--color-subtext)' }}
              >
                <IconMail size={20} />
              </a>
              <a
                href="https://www.linkedin.com/company/bayreuth-ai-association/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                style={{ color: 'var(--color-subtext)' }}
              >
                <IconBrandLinkedin size={20} />
              </a>
              <a
                href="https://www.instagram.com/bayreuth.ai"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                style={{ color: 'var(--color-subtext)' }}
              >
                <IconBrandInstagram size={20} />
              </a>
            </Group>
          </Stack>

          <Stack gap={10}>
            <Text
              fw={700}
              ff="Space Grotesk, sans-serif"
              fz={13}
              tt="uppercase"
              style={{ letterSpacing: '0.14em', color: 'var(--teal)' }}
            >
              Explore
            </Text>
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                style={{ color: 'var(--color-subtext)', textDecoration: 'none', fontSize: 14 }}
              >
                {n.label}
              </Link>
            ))}
          </Stack>

          <Stack gap={10}>
            <Text
              fw={700}
              ff="Space Grotesk, sans-serif"
              fz={13}
              tt="uppercase"
              style={{ letterSpacing: '0.14em', color: 'var(--teal)' }}
            >
              Find Us
            </Text>
            <Text style={{ color: 'var(--color-subtext)', fontSize: 14, lineHeight: 1.7 }}>
              Room S122, GW I
              <br />
              University of Bayreuth
              <br />
              Universitätsstraße 30, 95447 Bayreuth
            </Text>
            <Text style={{ color: 'var(--color-subtext)', fontSize: 14 }}>
              Meetings every other Thursday, 18:00
            </Text>
          </Stack>
        </SimpleGrid>

        <Text mt={48} fz={13} style={{ color: 'var(--color-subtext)', textAlign: 'center' }}>
          © {new Date().getFullYear()} Bayreuth AI Association e.V. · Built by students, for
          students.
        </Text>
      </Container>
    </Box>
  )
}
