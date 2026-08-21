import { type FC, useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Box, Group, Text, Burger, Drawer, Stack, Image } from '@mantine/core'
import { useDisclosure, useMediaQuery } from '@mantine/hooks'
import { LanguageSwitcher } from '../LanguageSwitcher'
import { JoinButton } from '../ui/JoinButton'
import { asset } from '../../lib/utils'

interface NavLinkItem {
  to: string
  label: string
  end?: boolean
}

const NAV_LINKS: NavLinkItem[] = [
  { to: '/', label: 'Home', end: true },
  { to: '/meetings', label: 'Meetings' },
  { to: '/team', label: 'Team' },
  { to: '/projects', label: 'Projects' },
]

const linkStyle = (isActive: boolean) => ({
  display: 'inline-flex' as const,
  alignItems: 'center' as const,
  height: 32,
  fontSize: 14,
  fontWeight: 500,
  fontFamily: '"Source Sans 3", sans-serif',
  color: isActive ? 'var(--teal)' : 'var(--color-subtext)',
  textDecoration: 'none',
  lineHeight: 1,
  letterSpacing: 0,
  // Underline drawn with box-shadow so it never shifts the text box vertically
  boxShadow: isActive ? 'inset 0 -2px 0 0 var(--teal)' : 'none',
  transition: 'color 0.2s, box-shadow 0.2s',
  whiteSpace: 'nowrap' as const,
})

/** Q&A has no page yet — shown as a quiet "coming soon" label, not a link. */
const QASoonLabel: FC<{ mobile?: boolean }> = ({ mobile }) => (
  <Group
    gap={6}
    wrap="nowrap"
    style={{
      height: mobile ? 'auto' : 32,
      padding: mobile ? '12px 0' : 0,
      borderBottom: mobile ? '1px solid var(--border)' : 'none',
    }}
  >
    <Text
      style={{
        fontSize: mobile ? 18 : 14,
        fontWeight: 500,
        fontFamily: '"Source Sans 3", sans-serif',
        color: 'var(--color-subtext)',
        opacity: 0.6,
      }}
    >
      Q&amp;A
    </Text>
    <Text
      style={{
        fontSize: 10,
        fontWeight: 600,
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        color: 'var(--color-subtext)',
        border: '1px solid var(--border)',
        borderRadius: 4,
        padding: '1px 5px',
      }}
    >
      Soon
    </Text>
  </Group>
)

export const Navbar: FC = () => {
  const [opened, { toggle, close }] = useDisclosure(false)
  const [scrolled, setScrolled] = useState(false)
  const isMobile = useMediaQuery('(max-width: 767px)')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <Box
      component="nav"
      className="chrome-scope"
      style={{
        position: 'fixed',
        zIndex: 200,
        top: isMobile ? 10 : 18,
        left: '50%',
        transform: 'translateX(-50%)',
        width: isMobile ? 'calc(100% - 20px)' : 'min(calc(100% - 32px), 1280px)',
        display: 'flex',
        alignItems: 'center',
        minHeight: 64,
        padding: isMobile ? '0 8px 0 14px' : '0 10px 0 20px',
        borderRadius: 18,
        border: '1px solid var(--border)',
        backgroundColor: 'var(--nav-bg)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        boxShadow: scrolled
          ? '0 12px 34px -12px rgba(0,0,0,0.55)'
          : '0 4px 22px -8px rgba(0,0,0,0.35)',
        transition: 'box-shadow 0.3s ease, top 0.3s ease',
      }}
    >
      <Group justify="space-between" align="center" wrap="nowrap" style={{ width: '100%' }}>
        {/* Brand */}
        <Link to="/" style={{ textDecoration: 'none' }}>
          <Group gap={10} wrap="nowrap">
            <Image
              src={asset('/official/logo.svg')}
              alt="Bayreuth AI Association"
              fit="contain"
              style={{
                width: 38,
                height: 38,
              }}
            />
            <Text
              fw={700}
              style={{
                letterSpacing: 0,
                fontSize: 15,
                color: 'var(--color-text)',
                fontFamily: '"Source Sans 3", sans-serif',
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
          <QASoonLabel />
        </Group>

        {/* Right cluster */}
        <Group gap={10} wrap="nowrap">
          <LanguageSwitcher compact />

          <Box visibleFrom="lg">
            <JoinButton size="sm" withArrow={false} />
          </Box>

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
          <Text fw={700} ff='"Source Sans 3", sans-serif' style={{ color: 'var(--color-text)' }}>
            Menu
          </Text>
        }
        classNames={{ content: 'chrome-scope', header: 'chrome-scope' }}
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
                height: 'auto',
                boxShadow: 'none',
                display: 'block',
                fontSize: 18,
                padding: '12px 0',
                borderBottom: '1px solid var(--border)',
              })}
            >
              {label}
            </NavLink>
          ))}
          <QASoonLabel mobile />
        </Stack>

        <JoinButton size="lg" className="" />
      </Drawer>
    </Box>
  )
}
