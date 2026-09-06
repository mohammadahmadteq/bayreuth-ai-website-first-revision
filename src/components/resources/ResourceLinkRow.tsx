import { type FC } from 'react'
import { Group, Stack, Text } from '@mantine/core'
import {
  IconPlayerPlay,
  IconPlaylist,
  IconSchool,
  IconBook2,
  IconFileText,
  IconClipboardList,
  IconBrandGithub,
  IconBrandYoutube,
  IconWorld,
  IconArrowUpRight,
  type TablerIcon,
} from '@tabler/icons-react'
import type { ResourceLink } from '../../types/content'

const TYPE_ICON: Record<string, TablerIcon> = {
  Video: IconPlayerPlay,
  Playlist: IconPlaylist,
  Course: IconSchool,
  Book: IconBook2,
  Paper: IconFileText,
  Guidelines: IconClipboardList,
  Channel: IconBrandYoutube,
}

const SOURCE_ICON: Record<string, TablerIcon> = {
  GitHub: IconBrandGithub,
  YouTube: IconBrandYoutube,
  Website: IconWorld,
}

interface ResourceLinkRowProps {
  resource: ResourceLink
  /** Shown next to the metadata line — e.g. the category name, in search results. */
  categoryLabel?: string
}

export const ResourceLinkRow: FC<ResourceLinkRowProps> = ({ resource, categoryLabel }) => {
  const Icon = TYPE_ICON[resource.type] ?? SOURCE_ICON[resource.source] ?? IconWorld
  const meta = [resource.source, resource.type].filter(Boolean).join(' · ')

  return (
    <a
      href={resource.url}
      target="_blank"
      rel="noopener noreferrer"
      className="resource-link-row"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        padding: '13px 4px',
        textDecoration: 'none',
        borderBottom: '1px solid var(--border)',
        transition: 'background-color 0.2s ease',
      }}
    >
      <Icon size={18} color="var(--teal)" stroke={1.8} style={{ flexShrink: 0 }} />
      <Stack gap={2} style={{ flex: 1, minWidth: 0 }}>
        <Text
          className="resource-link-row__title"
          fw={600}
          ff='"Source Sans 3", sans-serif'
          fz={15}
          style={{ color: 'var(--color-text)', transition: 'color 0.2s ease' }}
        >
          {resource.title}
        </Text>
        <Group gap={6} wrap="nowrap">
          <Text fz={13} style={{ color: 'var(--color-subtext)' }}>
            {meta}
          </Text>
          {categoryLabel && (
            <>
              <Text fz={13} style={{ color: 'var(--color-subtext)', opacity: 0.6 }}>
                ·
              </Text>
              <Text fz={13} style={{ color: 'var(--teal)' }}>
                {categoryLabel}
              </Text>
            </>
          )}
        </Group>
      </Stack>
      <IconArrowUpRight
        className="resource-link-row__arrow"
        size={16}
        color="var(--color-subtext)"
        style={{ flexShrink: 0, transition: 'transform 0.2s ease, color 0.2s ease' }}
      />
    </a>
  )
}
