import { type FC } from 'react'
import { Group, Select, Text, UnstyledButton } from '@mantine/core'
import type { CategoryFilter, Timeframe } from '../../types/content'

const CATEGORIES: Array<{ value: CategoryFilter; label: string }> = [
  { value: 'all', label: 'All' },
  { value: 'talk', label: 'Talks' },
  { value: 'workshop', label: 'Workshops' },
  { value: 'dinner', label: 'Dinners' },
  { value: 'social', label: 'Social' },
]

const TIMEFRAMES: Array<{ value: Timeframe; label: string }> = [
  { value: 'all', label: 'All dates' },
  { value: 'upcoming', label: 'Upcoming' },
  { value: 'month', label: 'This month' },
  { value: 'past', label: 'Past' },
]

interface EventFilterBarProps {
  category: CategoryFilter
  onCategoryChange: (value: CategoryFilter) => void
  timeframe: Timeframe
  onTimeframeChange: (value: Timeframe) => void
}

export const EventFilterBar: FC<EventFilterBarProps> = ({
  category,
  onCategoryChange,
  timeframe,
  onTimeframeChange,
}) => (
  <Group justify="space-between" align="center" wrap="wrap" gap={16}>
    <Group gap={10} wrap="wrap">
      {CATEGORIES.map((opt) => {
        const active = opt.value === category
        return (
          <UnstyledButton
            key={opt.value}
            onClick={() => onCategoryChange(opt.value)}
            aria-pressed={active}
            style={{
              padding: '9px 20px',
              borderRadius: 9999,
              fontSize: 14,
              fontWeight: 600,
              fontFamily: '"Source Sans 3", sans-serif',
              border: `1px solid ${active ? 'var(--teal)' : 'var(--border)'}`,
              background: active ? 'var(--teal)' : 'transparent',
              color: active ? 'var(--on-teal)' : 'var(--color-subtext)',
              transition: 'background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease',
            }}
          >
            {opt.label}
          </UnstyledButton>
        )
      })}
    </Group>

    <Group gap={10} wrap="nowrap">
      <Text fz={14} style={{ color: 'var(--color-subtext)', whiteSpace: 'nowrap' }}>
        Timeframe
      </Text>
      <Select
        value={timeframe}
        onChange={(value) => onTimeframeChange((value as Timeframe) ?? 'all')}
        data={TIMEFRAMES}
        allowDeselect={false}
        checkIconPosition="right"
        w={150}
        size="sm"
        styles={{
          input: {
            background: 'transparent',
            border: '1px solid var(--border)',
            borderRadius: 9999,
            color: 'var(--color-text)',
            fontWeight: 600,
            fontFamily: '"Source Sans 3", sans-serif',
          },
          dropdown: {
            background: 'var(--color-bg)',
            border: '1px solid var(--border)',
          },
          option: { color: 'var(--color-text)', fontSize: 14 },
        }}
      />
    </Group>
  </Group>
)
