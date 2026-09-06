import { type FC } from 'react'
import { Box, Group, Stack, Text, UnstyledButton } from '@mantine/core'
import { motion, useReducedMotion, AnimatePresence } from 'framer-motion'
import {
  IconBrain,
  IconBrandPython,
  IconBooks,
  IconFileText,
  IconScale,
  IconUsers,
  IconPresentation,
  IconChevronRight,
  type TablerIcon,
} from '@tabler/icons-react'
import type { ResourceCategory } from '../../types/content'
import { ResourceLinkRow } from './ResourceLinkRow'

const CATEGORY_ICON: Record<string, TablerIcon> = {
  'machine-learning': IconBrain,
  python: IconBrandPython,
  books: IconBooks,
  'technical-papers': IconFileText,
  'ai-ethics-regulations': IconScale,
  people: IconUsers,
  'past-talks': IconPresentation,
}

interface CategoryAccordionRowProps {
  category: ResourceCategory
  isOpen: boolean
  onToggle: () => void
}

export const CategoryAccordionRow: FC<CategoryAccordionRowProps> = ({
  category,
  isOpen,
  onToggle,
}) => {
  const Icon = CATEGORY_ICON[category.id] ?? IconBooks
  const reduce = useReducedMotion()
  const count = category.resources.length
  const panelId = `resource-category-panel-${category.id}`
  const headerId = `resource-category-header-${category.id}`

  return (
    <Box
      style={{
        border: '1px solid var(--border)',
        borderRadius: 11,
        marginBottom: 10,
        overflow: 'hidden',
      }}
    >
      <UnstyledButton
        id={headerId}
        className="resource-category-row"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={panelId}
        style={{
          width: '100%',
          minHeight: 44,
          padding: '16px 18px',
          display: 'flex',
          alignItems: 'center',
          gap: 14,
        }}
      >
        <Icon size={20} color="var(--teal)" stroke={1.8} style={{ flexShrink: 0 }} />
        <Group justify="space-between" align="center" wrap="wrap" gap={4} style={{ flex: 1 }}>
          <Stack gap={1}>
            <Text
              fw={700}
              ff='"Source Sans 3", sans-serif'
              fz={16}
              style={{ color: 'var(--color-text)' }}
            >
              {category.title}
            </Text>
            {category.subtitle && (
              <Text fz={13} style={{ color: 'var(--color-subtext)' }}>
                {category.subtitle}
              </Text>
            )}
          </Stack>
          <Text fz={13} fw={600} style={{ color: 'var(--color-subtext)', whiteSpace: 'nowrap' }}>
            {count} {count === 1 ? 'resource' : 'resources'}
          </Text>
        </Group>
        <IconChevronRight
          className="resource-category-row__chevron"
          size={18}
          color="var(--color-subtext)"
          style={{
            flexShrink: 0,
            transform: isOpen ? 'rotate(90deg)' : 'none',
            transition: 'transform 0.2s ease, color 0.2s ease',
          }}
        />
      </UnstyledButton>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={panelId}
            role="region"
            aria-labelledby={headerId}
            initial={reduce ? false : { height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={reduce ? undefined : { height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.2, 0, 0, 1] }}
            style={{ overflow: 'hidden' }}
          >
            <Box style={{ padding: '0 18px 8px', borderTop: '1px solid var(--border)' }}>
              {category.resources.map((resource) => (
                <ResourceLinkRow key={resource.url + resource.title} resource={resource} />
              ))}
            </Box>
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  )
}
