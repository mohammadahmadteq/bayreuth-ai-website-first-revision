import { type FC } from 'react'
import { Group, UnstyledButton } from '@mantine/core'
import type { MembershipLanguage } from '../../types/content'

interface LanguageToggleProps {
  language: MembershipLanguage
  /** Each option is labelled in its own language. */
  options: Array<{ value: MembershipLanguage; label: string }>
  onChange: (language: MembershipLanguage) => void
}

export const LanguageToggle: FC<LanguageToggleProps> = ({ language, options, onChange }) => (
  <Group gap={10} role="group" aria-label="Language / Sprache">
    {options.map((option) => {
      const active = option.value === language
      return (
        <UnstyledButton
          key={option.value}
          lang={option.value}
          onClick={() => onChange(option.value)}
          aria-pressed={active}
          className="membership-language"
          data-active={active || undefined}
        >
          {option.label}
        </UnstyledButton>
      )
    })}
  </Group>
)
