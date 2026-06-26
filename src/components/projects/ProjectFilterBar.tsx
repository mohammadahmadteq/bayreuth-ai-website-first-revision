import { type FC } from 'react'
import { Group } from '@mantine/core'

export type ProjectFilter = string

interface ProjectFilterBarProps {
  filters: ProjectFilter[]
  active: ProjectFilter
  onChange: (filter: ProjectFilter) => void
}

export const ProjectFilterBar: FC<ProjectFilterBarProps> = ({ filters, active, onChange }) => {
  return (
    <Group gap={8} wrap="wrap">
      {filters.map((f) => {
        const isActive = f === active
        return (
          <button
            key={f}
            type="button"
            onClick={() => onChange(f)}
            style={{
              cursor: 'pointer',
              padding: '7px 16px',
              borderRadius: 9999,
              fontSize: 13,
              fontWeight: 600,
              fontFamily: 'Space Grotesk, sans-serif',
              textTransform: 'capitalize',
              color: isActive ? '#04140f' : 'var(--color-subtext)',
              background: isActive ? 'var(--teal)' : 'var(--color-surface-strong)',
              border: `1px solid ${isActive ? 'var(--teal)' : 'var(--border)'}`,
              transition: 'all 0.2s ease',
            }}
          >
            {f}
          </button>
        )
      })}
    </Group>
  )
}
