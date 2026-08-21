import { type FC } from 'react'
import { Link } from 'react-router-dom'
import { Box, Group, SimpleGrid, Text } from '@mantine/core'
import type { Partner } from '../../types/content'
import { asset } from '../../lib/utils'

interface PartnersStripProps {
  partners: Partner[]
}

/**
 * Restrained partners strip — small heading, a row of logos, a quiet link.
 * Deliberately lower visual weight than the primary Join CTA.
 */
export const PartnersStrip: FC<PartnersStripProps> = ({ partners }) => {
  if (partners.length === 0) return null

  return (
    <Box style={{ borderTop: '1px solid var(--border)', paddingTop: 40 }}>
      <Group justify="space-between" align="center" mb={24} wrap="wrap">
        <Text
          fz={13}
          fw={700}
          tt="uppercase"
          style={{ letterSpacing: '0.14em', color: 'var(--color-subtext)' }}
        >
          Partners
        </Text>
        <Link
          to="/partners"
          style={{ color: 'var(--teal)', fontSize: 14, fontWeight: 600, textDecoration: 'none' }}
        >
          Become a Partner
        </Link>
      </Group>

      <SimpleGrid cols={{ base: 2, xs: 3, sm: partners.length }} spacing={24}>
        {partners.map((p) => {
          const logo = (
            <img
              src={asset(p.logoUrl)}
              alt={`${p.name} logo`}
              loading="lazy"
              style={{ maxWidth: '100%', height: 36, objectFit: 'contain', opacity: 0.85 }}
            />
          )
          return p.websiteUrl ? (
            <Box
              key={p.id}
              component="a"
              href={p.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: 'grid', placeItems: 'center', padding: '8px 4px' }}
            >
              {logo}
            </Box>
          ) : (
            <Box key={p.id} style={{ display: 'grid', placeItems: 'center', padding: '8px 4px' }}>
              {logo}
            </Box>
          )
        })}
      </SimpleGrid>
    </Box>
  )
}
