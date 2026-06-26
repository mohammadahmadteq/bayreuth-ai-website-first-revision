import { type FC } from 'react'
import { Box, Stack, Text } from '@mantine/core'
import { SectionHeading } from '../ui/SectionHeading'

const PHOTOS = [
  {
    src: '/official/ai-members.jpeg',
    alt: 'Bayreuth AI Association members',
    label: 'Members at Bayreuth AI',
  },
  { src: '/official/rm-profile.jpeg', alt: 'Renato Mio', label: 'Renato Mio' },
  { src: '/official/pascal-fechner.jpg', alt: 'Pascal Fechner', label: 'Pascal Fechner' },
  { src: '/official/feli-profile.jpeg', alt: 'Felicitas Feick', label: 'Felicitas Feick' },
  { src: '/official/nico-hoellerich.jpg', alt: 'Nico Hoellerich', label: 'Nico Hoellerich' },
  { src: '/official/pascal-lange.png', alt: 'Pascal Lange', label: 'Pascal Lange' },
  { src: '/official/andreas-karasenko.jpg', alt: 'Andreas Karasenko', label: 'Andreas Karasenko' },
  { src: '/official/ml4mensa.png', alt: 'ML4Mensa project prediction chart', label: 'ML4Mensa' },
]

export const PhotoRail: FC = () => {
  const rail = [...PHOTOS, ...PHOTOS]

  return (
    <Stack gap={28}>
      <SectionHeading
        eyebrow="From the official site"
        title="People, projects, and moments from the association."
        subtitle="A moving gallery using public images from the Bayreuth AI Association pages."
        align="center"
      />
      <Box className="photo-rail" aria-label="Bayreuth AI Association photo gallery">
        <Box className="photo-rail__track">
          {rail.map((photo, index) => (
            <Box className="photo-rail__item" key={`${photo.src}-${index}`}>
              <img src={photo.src} alt={photo.alt} loading="lazy" />
              <Text component="span">{photo.label}</Text>
            </Box>
          ))}
        </Box>
      </Box>
    </Stack>
  )
}
