import { type FC, useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Box, Group, ActionIcon, Text, Burger, Drawer, Stack, Image } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { useMantineColorScheme } from '@mantine/core'
import { IconSun, IconMoon } from '@tabler/icons-react'
import { LanguageSwitcher } from '../LanguageSwitcher'
import { JoinButton } from '../ui/JoinButton'
import { PartnerButton } from '../ui/PartnerButton'

interface NavLinkItem {
  to: string
  label: string
  end?: boolean
}

const NAV_LINKS: NavLinkItem[] = [
  { to: '/', label: 'Home', end: true },
  { to: '/meetings', label: 'Meetings' },
  { to: '/team', label: 'Team' },
  { to: '/dates', label: 'Important Dates' },
  { to: '/resources', label: 'Resources' },
  { to: '/projects', label: 'Projects' },
]

const linkStyle = (isActive: boolean) => ({
  fontSize: 14,
  fontWeight: 500,
  fontFamily: 'Space Grotesk, sans-serif',
  color: isActive ? 'var(--teal)' : 'var(--color-subtext)',
  textDecoration: 'none',
  borderBottom: `2px solid ${isActive ? 'var(--teal)' : 'transparent'}`,
  paddingBottom: 4,
  letterSpacing: 0,
  transition: 'color 0.2s, border-color 0.2s',
  whiteSpace: 'nowrap' as const,
})

export const Navbar: FC = () => {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme()
  const [opened, { toggle, close }] = useDisclosure(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <Box
      component="nav"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 200,
        backgroundColor: 'var(--nav-bg)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        borderBottom: `1px solid ${scrolled ? 'var(--border)' : 'transparent'}`,
        boxShadow: scrolled ? '0 8px 30px -16px rgba(0,0,0,0.6)' : 'none',
        height: 68,
        transition: 'border-color 0.3s, box-shadow 0.3s',
      }}
    >
      <Group
        justify="space-between"
        align="center"
        wrap="nowrap"
        style={{ maxWidth: 1280, margin: '0 auto', height: '100%', padding: '0 24px' }}
      >
        {/* Brand */}
        <Link to="/" style={{ textDecoration: 'none' }}>
          <Group gap={10} wrap="nowrap">
            <Image
              src="/official/bayreuth-ai-logo.png"
              alt="Bayreuth AI Association"
              fit="contain"
              style={{
                width: 62,
                height: 34,
                borderRadius: 6,
                background: '#fff',
                padding: 3,
              }}
            />
            <Text
              fw={700}
              style={{
                letterSpacing: 0,
                fontSize: 15,
                color: 'var(--color-text)',
                fontFamily: 'Space Grotesk, sans-serif',
              }}
              visibleFrom="xs"
            >
              BAYREUTH <span style={{ color: 'var(--teal)' }}>AI</span>
            </Text>
          </Group>
        </Link>

        {/* Desktop nav links */}
        <Group gap={28} visibleFrom="lg">
          {NAV_LINKS.map(({ to, label, end }) => (
            <NavLink key={to} to={to} end={end} style={({ isActive }) => linkStyle(isActive)}>
              {label}
            </NavLink>
          ))}
        </Group>

        {/* Right cluster */}
        <Group gap={10} wrap="nowrap">
          <LanguageSwitcher compact />
          <ActionIcon
            variant="subtle"
            onClick={() => toggleColorScheme()}
            aria-label="Toggle color scheme"
            size={34}
            style={{ color: 'var(--color-subtext)' }}
          >
            {colorScheme === 'dark' ? <IconSun size={17} /> : <IconMoon size={17} />}
          </ActionIcon>

          {/* Both CTAs visible on desktop, distinct styles */}
          <Group gap={8} visibleFrom="lg" wrap="nowrap">
            <PartnerButton size="sm" withIcon={false} />
            <JoinButton size="sm" withArrow={false} />
          </Group>

          <Burger
            opened={opened}
            onClick={toggle}
            hiddenFrom="lg"
            aria-label="Open menu"
            color="var(--color-text)"
            size="sm"
          />
        </Group>
      </Group>

      {/* Mobile drawer */}
      <Drawer
        opened={opened}
        onClose={close}
        position="right"
        size="78%"
        padding="lg"
        title={
          <Text fw={700} ff="Space Grotesk, sans-serif">
            Menu
          </Text>
        }
        styles={{
          content: { background: 'var(--color-bg-2)' },
          header: { background: 'var(--color-bg-2)' },
        }}
      >
        <Stack gap={6} mb="xl">
          {NAV_LINKS.map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={close}
              style={({ isActive }) => ({
                ...linkStyle(isActive),
                fontSize: 18,
                padding: '12px 0',
                borderBottom: '1px solid var(--border)',
              })}
            >
              {label}
            </NavLink>
          ))}
        </Stack>

        {/* Member prioritised as the top action on mobile */}
        <Stack gap={12}>
          <JoinButton size="lg" className="" />
          <PartnerButton size="lg" />
        </Stack>
      </Drawer>
    </Box>
  )
}
