import { type FC } from 'react'
import { Container, Stack, Text } from '@mantine/core'
import { JoinButton } from '../components/ui/JoinButton'

export const NotFoundPage: FC = () => {
  return (
    <Container size={720} px={24} py={{ base: 96, md: 160 }}>
      <Stack gap={20} align="center" style={{ textAlign: 'center' }}>
        <Text
          ff="Space Grotesk, sans-serif"
          fw={700}
          className="gradient-text"
          style={{ fontSize: 'clamp(64px, 14vw, 140px)', lineHeight: 1 }}
        >
          404
        </Text>
        <Text
          ff="Space Grotesk, sans-serif"
          fw={700}
          fz="clamp(22px, 4vw, 32px)"
          style={{ color: 'var(--color-text)' }}
        >
          This page wandered off.
        </Text>
        <Text
          style={{ color: 'var(--color-subtext)', fontSize: 16, maxWidth: 440, lineHeight: 1.6 }}
        >
          The link may be broken or the page may have moved. Let’s get you back on track.
        </Text>
        <JoinButton to="/" withArrow={false}>
          Back to Home
        </JoinButton>
      </Stack>
    </Container>
  )
}
