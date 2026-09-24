import { type FC } from 'react'
import { Box, SimpleGrid, Stack } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import { SectionHeading } from '../ui/SectionHeading'
import { asset } from '../../lib/utils'
import type { AssociationPhoto } from '../../types/content'

export const PhotoRail: FC<{ photos: AssociationPhoto[] }> = ({ photos }) => {
  const isMobile = useMediaQuery('(max-width: 767px)')
  if (photos.length === 0) return null

  return (
    <Stack gap={28}>
      <SectionHeading
        eyebrow="Community"
        title="People, projects, and moments from the association."
      />

      <Box
        style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'minmax(0, 3fr) minmax(0, 2fr)',
          gap: 16,
        }}
      >
        <Box
          style={{
            position: 'relative',
            borderRadius: 10,
            overflow: 'hidden',
            border: '1px solid var(--border)',
            aspectRatio: '4 / 3',
          }}
        >
          <img
            src={asset(photos[0].imageUrl)}
            alt={photos[0].alt}
            loading="lazy"
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        </Box>

        <SimpleGrid cols={2} spacing={16}>
          {photos.slice(1).map((photo) => (
            <Box
              key={photo.id}
              style={{
                position: 'relative',
                borderRadius: 10,
                overflow: 'hidden',
                border: '1px solid var(--border)',
                aspectRatio: '1 / 1',
              }}
            >
              <img
                src={asset(photo.imageUrl)}
                alt={photo.alt}
                loading="lazy"
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            </Box>
          ))}
        </SimpleGrid>
      </Box>
    </Stack>
  )
}
