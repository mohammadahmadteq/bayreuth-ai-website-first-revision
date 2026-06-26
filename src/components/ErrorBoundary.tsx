import { Component, type ReactNode } from 'react'
import { Box, Text } from '@mantine/core'
import { IconAlertTriangle } from '@tabler/icons-react'

interface Props {
  children: ReactNode
  /** Custom fallback UI. Defaults to an inline error card. */
  fallback?: ReactNode
  /** Label shown in the default fallback (e.g. the section name). */
  label?: string
}

interface State {
  hasError: boolean
}

// Class component required — React has no hook equivalent for error boundaries.
export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  render() {
    if (!this.state.hasError) return this.props.children

    if (this.props.fallback) return this.props.fallback

    return (
      <Box
        className="glow-card"
        style={{
          padding: 'clamp(24px, 4vw, 48px)',
          borderRadius: 16,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 12,
          textAlign: 'center',
        }}
      >
        <IconAlertTriangle size={32} color="var(--color-subtext)" />
        <Text size="sm" c="dimmed">
          {this.props.label
            ? `${this.props.label} couldn't load right now.`
            : "This section couldn't load right now."}
        </Text>
        <Text size="xs" c="dimmed" opacity={0.6}>
          The rest of the page is unaffected.
        </Text>
      </Box>
    )
  }
}
