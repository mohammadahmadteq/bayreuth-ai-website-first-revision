import { type FC } from 'react'
import { Box, SimpleGrid, Stack } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import { SectionHeading } from '../ui/SectionHeading'
import { asset } from '../../lib/utils'

const SUPPORTING_PHOTOS = [
  { src: '/official/rm-profile.jpeg', alt: 'Renato Mio, Bayreuth AI Association member' },
  { src: '/official/pascal-fechner.jpg', alt: 'Pascal Fechner, Bayreuth AI Association member' },
  { src: '/official/feli-profile.jpeg', alt: 'Felicitas Feick, Bayreuth AI Association member' },
  {
    src: '/official/nico-hoellerich.jpg',
    alt: 'Nico Hoellerich, Bayreuth AI Association member',
  },
]

/**
 * Community — a large real photo of the association plus a small supporting
 * cluster, in an asymmetric two-column layout. Replaces the auto-scrolling
 * thumbnail marquee so real images get real space rather than reading as
 * decoration.
 */
export const PhotoRail: FC = () => {
  const isMobile = useMediaQuery('(max-width: 767px)')

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
            src={asset('/official/ai-members.jpeg')}
            alt="Bayreuth AI Association members together"
            loading="lazy"
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        </Box>

        <SimpleGrid cols={2} spacing={16}>
          {SUPPORTING_PHOTOS.map((photo) => (
            <Box
              key={photo.src}
              style={{
                position: 'relative',
                borderRadius: 10,
                overflow: 'hidden',
                border: '1px solid var(--border)',
                aspectRatio: '1 / 1',
              }}
            >
              <img
                src={asset(photo.src)}
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
