import { type FC } from 'react'
import { Box, SimpleGrid, Stack, Text } from '@mantine/core'
import type { Partner, PartnerTier } from '../../types/content'
import { FadeInWhenVisible } from '../ui/FadeInWhenVisible'

interface PartnerGridProps {
  partners: Partner[]
}

const TIER_LABEL: Record<PartnerTier, string> = {
  sponsor: 'Sponsors',
  cooperation: 'Cooperations',
}

const PartnerLogo: FC<{ partner: Partner }> = ({ partner }) => {
  const inner = (
    <Stack
      gap={10}
      align="center"
      justify="center"
      className="glow-card glow-card--lift"
      style={{ padding: 24, height: '100%', textAlign: 'center' }}
    >
      <img
        src={partner.logoUrl}
        alt={`${partner.name} logo`}
        loading="lazy"
        style={{ maxWidth: '100%', height: 56, objectFit: 'contain' }}
      />
      {partner.description && (
        <Text fz={13} style={{ color: 'var(--color-subtext)', lineHeight: 1.5 }}>
          {partner.description}
        </Text>
      )}
    </Stack>
  )

  if (partner.websiteUrl) {
    return (
      <Box
        component="a"
        href={partner.websiteUrl}
        target="_blank"
        rel="noopener noreferrer"
        style={{ textDecoration: 'none', display: 'block', height: '100%' }}
      >
        {inner}
      </Box>
    )
  }
  return inner
}

export const PartnerGrid: FC<PartnerGridProps> = ({ partners }) => {
  if (partners.length === 0) {
    return (
      <Text style={{ color: 'var(--color-subtext)', textAlign: 'center', padding: 48 }}>
        We’re building our partner network — your organisation could be the first.
      </Text>
    )
  }

  const tiers: PartnerTier[] = ['sponsor', 'cooperation']

  return (
    <Stack gap={56}>
      {tiers.map((tier) => {
        const group = partners.filter((p) => p.tier === tier)
        if (group.length === 0) return null
        return (
          <Stack key={tier} gap={22}>
            <Text
              ff="Space Grotesk, sans-serif"
              fw={700}
              fz={13}
              tt="uppercase"
              style={{ letterSpacing: '0.16em', color: 'var(--teal)' }}
            >
              {TIER_LABEL[tier]}
            </Text>
            <SimpleGrid cols={{ base: 1, xs: 2, md: 3 }} spacing={20}>
              {group.map((p, i) => (
                <FadeInWhenVisible key={p.id} delay={(i % 3) * 0.06}>
                  <PartnerLogo partner={p} />
                </FadeInWhenVisible>
              ))}
            </SimpleGrid>
          </Stack>
        )
      })}
    </Stack>
  )
}
