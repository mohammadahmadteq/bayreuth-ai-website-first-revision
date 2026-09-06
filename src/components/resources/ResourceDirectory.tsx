import { type FC } from 'react'
import { Box, Stack, Text, TextInput } from '@mantine/core'
import { IconSearch } from '@tabler/icons-react'
import type { ResourceCategory } from '../../types/content'
import type { ResourceSearchResult } from '../../hooks/useResourceDirectory'
import { CategoryAccordionRow } from './CategoryAccordionRow'
import { ResourceLinkRow } from './ResourceLinkRow'

interface ResourceDirectoryProps {
  categories: ResourceCategory[]
  query: string
  onQueryChange: (value: string) => void
  results: ResourceSearchResult[]
  isSearching: boolean
  openCategoryId: string | null
  onToggleCategory: (id: string) => void
}

export const ResourceDirectory: FC<ResourceDirectoryProps> = ({
  categories,
  query,
  onQueryChange,
  results,
  isSearching,
  openCategoryId,
  onToggleCategory,
}) => {
  return (
    <Stack gap={32}>
      <TextInput
        aria-label="Search resources"
        placeholder="Search resources…"
        value={query}
        onChange={(e) => onQueryChange(e.currentTarget.value)}
        leftSection={<IconSearch size={17} color="var(--color-subtext)" />}
        size="md"
        radius="md"
        styles={{
          input: {
            background: 'var(--color-bg)',
            border: '1px solid var(--border)',
            color: 'var(--color-text)',
            height: 48,
            fontSize: 15,
          },
        }}
      />

      {isSearching ? (
        <Stack gap={0}>
          {results.length === 0 ? (
            <Text style={{ color: 'var(--color-subtext)', textAlign: 'center', padding: '32px 0' }}>
              No resources match “{query}”.
            </Text>
          ) : (
            results.map((result) => (
              <ResourceLinkRow
                key={result.categoryId + result.url + result.title}
                resource={result}
                categoryLabel={result.categoryTitle}
              />
            ))
          )}
        </Stack>
      ) : categories.length === 0 ? (
        <Text style={{ color: 'var(--color-subtext)', textAlign: 'center', padding: '32px 0' }}>
          Resources are being updated — check back soon.
        </Text>
      ) : (
        <Box>
          <Text
            ff='"Source Sans 3", sans-serif'
            fw={700}
            fz={13}
            tt="uppercase"
            style={{ letterSpacing: '0.14em', color: 'var(--teal)', marginBottom: 14 }}
          >
            Explore by topic
          </Text>
          {categories.map((category) => (
            <CategoryAccordionRow
              key={category.id}
              category={category}
              isOpen={openCategoryId === category.id}
              onToggle={() => onToggleCategory(category.id)}
            />
          ))}
        </Box>
      )}
    </Stack>
  )
}
