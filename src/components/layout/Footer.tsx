import { type FC } from 'react'
import { Link } from 'react-router-dom'
import { Box, Container, Group, Stack, Text, SimpleGrid } from '@mantine/core'
import {
  IconBrandLinkedin,
  IconBrandInstagram,
  IconBrandWhatsapp,
  IconMail,
} from '@tabler/icons-react'
import { WHATSAPP_URL } from '../../lib/utils'

const NAV = [
  { to: '/meetings', label: 'Meetings' },
  { to: '/team', label: 'Team' },
  { to: '/resources', label: 'Learning resources' },
  { to: '/projects', label: 'Projects' },
  { to: '/partners', label: 'Partners' },
  { to: '/apply', label: 'Join Us' },
]

export const Footer: FC = () => {
  return (
    <Box
      component="footer"
      className="chrome-scope"
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
                  background: 'var(--teal)',
                  display: 'grid',
                  placeItems: 'center',
                  fontFamily: '"Source Sans 3", sans-serif',
                  fontWeight: 700,
                  color: '#04140f',
                  fontSize: 14,
                }}
              >
                ai
              </Box>
              <Text fw={700} ff='"Source Sans 3", sans-serif' style={{ color: 'var(--color-text)' }}>
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
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                style={{ color: 'var(--color-subtext)' }}
              >
                <IconBrandWhatsapp size={20} />
              </a>
            </Group>
          </Stack>

          <Stack gap={10}>
            <Text
              fw={700}
              ff='"Source Sans 3", sans-serif'
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
            <Text style={{ color: 'var(--color-subtext)', fontSize: 14, opacity: 0.6 }}>
              Q&amp;A (coming soon)
            </Text>
          </Stack>

          <Stack gap={10}>
            <Text
              fw={700}
              ff='"Source Sans 3", sans-serif'
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
