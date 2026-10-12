import { type CSSProperties, type FC, useState } from 'react'
import { Modal, Stack } from '@mantine/core'
import { SectionHeading } from '../ui/SectionHeading'
import { asset } from '../../lib/utils'
import { photoThumbnail } from '../../lib/photos'
import type { AssociationPhoto } from '../../types/content'

// How long one photo takes to scroll past; the loop length scales with the count.
const SECONDS_PER_PHOTO = 6

export const PhotoRail: FC<{ photos: AssociationPhoto[] }> = ({ photos }) => {
  const [enlarged, setEnlarged] = useState<AssociationPhoto | null>(null)
  if (photos.length === 0) return null

  // The set is rendered twice so the loop can wrap seamlessly; the copy is
  // hidden from assistive technology and keyboard focus.
  const renderSet = (isCopy: boolean) => (
    <ul className="community-strip__set" aria-hidden={isCopy || undefined} inert={isCopy}>
      {photos.map((photo) => (
        <li key={photo.id} className="community-strip__item">
          <button
            type="button"
            aria-label={`Open photo: ${photo.alt}`}
            onClick={() => setEnlarged(photo)}
          >
            <img
              src={asset(photoThumbnail(photo.imageUrl))}
              alt=""
              loading="lazy"
              decoding="async"
            />
            <span className="community-strip__caption">{photo.alt}</span>
          </button>
        </li>
      ))}
    </ul>
  )

  return (
    <Stack gap={28}>
      <SectionHeading eyebrow="Community" title="Moments from our meetings, socials and events." />

      <div
        className={`community-strip${enlarged ? ' is-paused' : ''}`}
        style={{ '--strip-duration': `${photos.length * SECONDS_PER_PHOTO}s` } as CSSProperties}
      >
        <div className="community-strip__track">
          {renderSet(false)}
          {renderSet(true)}
        </div>
      </div>

      <Modal
        opened={enlarged !== null}
        onClose={() => setEnlarged(null)}
        title={enlarged?.alt}
        size="auto"
        centered
      >
        {enlarged && (
          <img
            src={asset(enlarged.imageUrl)}
            alt={enlarged.alt}
            style={{
              display: 'block',
              maxWidth: 'min(1600px, 88vw)',
              maxHeight: '75vh',
              width: 'auto',
              height: 'auto',
              borderRadius: 8,
            }}
          />
        )}
      </Modal>
    </Stack>
  )
}
