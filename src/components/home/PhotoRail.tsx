import { type CSSProperties, type FC, useState } from 'react'
import { Modal, Stack } from '@mantine/core'
import { SectionHeading } from '../ui/SectionHeading'
import { asset } from '../../lib/utils'
import { photoThumbnail } from '../../lib/photos'
import type { AssociationPhoto } from '../../types/content'

// How long one photo takes to scroll past; the loop length scales with the count.
const SECONDS_PER_PHOTO = 6

export const PhotoRail: FC<{ photos: AssociationPhoto[] }> = ({ photos }) => {
  // The photo stays set after closing so it remains visible while the modal fades out.
  const [enlarged, setEnlarged] = useState<AssociationPhoto | null>(null)
  const [open, setOpen] = useState(false)
  if (photos.length === 0) return null

  const enlarge = (photo: AssociationPhoto) => {
    setEnlarged(photo)
    setOpen(true)
  }

  // The set is rendered twice so the loop can wrap seamlessly; the copy is
  // hidden from assistive technology and keyboard focus.
  const renderSet = (isCopy: boolean) => (
    <ul className="community-strip__set" aria-hidden={isCopy || undefined} inert={isCopy}>
      {photos.map((photo) => (
        <li key={photo.id} className="community-strip__item">
          <button
            type="button"
            aria-label={`Open photo: ${photo.alt}`}
            onClick={() => enlarge(photo)}
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
        className={`community-strip${open ? ' is-paused' : ''}`}
        style={{ '--strip-duration': `${photos.length * SECONDS_PER_PHOTO}s` } as CSSProperties}
      >
        <div className="community-strip__track">
          {renderSet(false)}
          {renderSet(true)}
        </div>
      </div>

      {/* No header band: the caption and the close button sit on the photo itself. */}
      <Modal.Root opened={open} onClose={() => setOpen(false)} size="auto" centered>
        <Modal.Overlay />
        <Modal.Content aria-label={enlarged?.alt} radius="md" className="photo-lightbox">
          {enlarged && (
            <figure className="photo-lightbox__figure">
              <img
                src={asset(enlarged.imageUrl)}
                alt={enlarged.alt}
                className="photo-lightbox__image"
              />
              {/* The dialog and the image already carry this text for screen readers. */}
              <figcaption className="community-strip__caption photo-lightbox__caption" aria-hidden>
                {enlarged.alt}
              </figcaption>
              <Modal.CloseButton className="photo-lightbox__close" aria-label="Close photo" />
            </figure>
          )}
        </Modal.Content>
      </Modal.Root>
    </Stack>
  )
}
