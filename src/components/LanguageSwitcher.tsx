import { UnstyledButton, Group } from '@mantine/core'
import { useLocale } from '../hooks/useLocale'
import type { Locale } from '../services/i18n'

interface LanguageSwitcherProps {
  compact?: boolean
}

export function LanguageSwitcher({ compact = false }: LanguageSwitcherProps) {
  const { locale, setLocale, locales } = useLocale()
  const padding = compact ? 3 : 4

  return (
    <Group
      gap={2}
      className="glass-card"
      role="group"
      aria-label="Language switcher"
      style={{ borderRadius: 9999, padding, position: 'relative' }}
    >
      {locales.map((code) => {
        const active = locale === code
        return (
          <UnstyledButton
            key={code}
            onClick={() => setLocale(code as Locale)}
            aria-label={`Switch to ${code === 'en' ? 'English' : 'Deutsch'}`}
            aria-pressed={active}
            style={{
              padding: compact ? '3px 9px' : '4px 12px',
              borderRadius: 9999,
              fontSize: compact ? 10 : 11,
              fontWeight: 700,
              fontFamily: 'Space Grotesk, sans-serif',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: active ? 'white' : 'var(--color-subtext)',
              background: active
                ? 'linear-gradient(135deg, #009260 0%, #00b377 100%)'
                : 'transparent',
              boxShadow: active ? '0 2px 8px -2px rgba(0,146,96,0.5)' : 'none',
              transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
              cursor: 'pointer',
              minWidth: compact ? 28 : 32,
              textAlign: 'center',
            }}
          >
            {code.toUpperCase()}
          </UnstyledButton>
        )
      })}
    </Group>
  )
}
