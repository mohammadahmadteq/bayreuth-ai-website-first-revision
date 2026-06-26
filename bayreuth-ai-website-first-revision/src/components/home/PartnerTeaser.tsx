import { type FC } from 'react'
import { Box, Group, Stack, Text } from '@mantine/core'
import { IconBuildingSkyscraper } from '@tabler/icons-react'
import { FadeInWhenVisible } from '../ui/FadeInWhenVisible'
import { PartnerButton } from '../ui/PartnerButton'

/**
 * Sponsor-facing strip — deliberately styled apart from the member-facing
 * sections, linking through to the partners page.
 */
export const PartnerTeaser: FC = () => {
  return (
    <FadeInWhenVisible>
      <Box
        style={{
          position: 'relative',
          overflow: 'hidden',
          borderRadius: 20,
          padding: 'clamp(28px, 5vw, 56px)',
          border: '1px solid var(--border)',
          background:
            'linear-gradient(120deg, rgba(45,224,200,0.07), rgba(57,255,106,0.04) 60%, transparent)',
        }}
      >
        <Box
          className="grid-bg"
          style={{ position: 'absolute', inset: 0, opacity: 0.5, pointerEvents: 'none' }}
        />
        <Group
          justify="space-between"
          align="center"
          gap={28}
          wrap="wrap"
          style={{ position: 'relative', zIndex: 1 }}
        >
          <Stack gap={10} style={{ maxWidth: 560 }}>
            <Group gap={10}>
              <IconBuildingSkyscraper size={22} color="var(--teal)" />
              <Text
                ff="Space Grotesk, sans-serif"
                fw={700}
                fz={13}
                tt="uppercase"
                style={{ letterSpacing: '0.16em', color: 'var(--teal)' }}
              >
                For organisations
              </Text>
            </Group>
            <Text
              ff="Space Grotesk, sans-serif"
              fw={700}
              fz="clamp(22px, 3.5vw, 34px)"
              style={{ color: 'var(--color-text)', lineHeight: 1.1 }}
            >
              Interested in partnering with us?
            </Text>
            <Text style={{ color: 'var(--color-subtext)', fontSize: 16, lineHeight: 1.6 }}>
              Reach a motivated, interdisciplinary talent pool, co-host workshops, and put your
              brand in front of the next generation of AI practitioners.
            </Text>
          </Stack>
          <PartnerButton size="lg" />
        </Group>
      </Box>
    </FadeInWhenVisible>
  )
}
