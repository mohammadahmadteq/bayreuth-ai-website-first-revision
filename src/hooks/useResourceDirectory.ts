import { useMemo, useState } from 'react'
import type { ResourceCategory, ResourceLink } from '../types/content'

export interface ResourceSearchResult extends ResourceLink {
  categoryId: string
  categoryTitle: string
}

interface UseResourceDirectoryResult {
  query: string
  setQuery: (value: string) => void
  results: ResourceSearchResult[]
  isSearching: boolean
  openCategoryId: string | null
  toggleCategory: (id: string) => void
}

/** Search + single-open-accordion state for the resource directory, kept out of the UI layer. */
export function useResourceDirectory(categories: ResourceCategory[]): UseResourceDirectoryResult {
  const [query, setQuery] = useState('')
  const [openCategoryId, setOpenCategoryId] = useState<string | null>(categories[0]?.id ?? null)

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return []
    return categories.flatMap((category) =>
      category.resources
        .filter((resource) => resource.title.toLowerCase().includes(q))
        .map((resource) => ({
          ...resource,
          categoryId: category.id,
          categoryTitle: category.title,
        })),
    )
  }, [categories, query])

  const toggleCategory = (id: string) => {
    setOpenCategoryId((current) => (current === id ? null : id))
  }

  return {
    query,
    setQuery,
    results,
    isSearching: query.trim().length > 0,
    openCategoryId,
    toggleCategory,
  }
}
