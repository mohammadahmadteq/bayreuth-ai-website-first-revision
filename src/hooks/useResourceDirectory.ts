import { useMemo, useState } from 'react'
import type { ResourceCategory, ResourceSearchResult } from '../types/content'

interface UseResourceDirectoryResult {
  query: string
  setQuery: (value: string) => void
  results: ResourceSearchResult[]
  isSearching: boolean
  openCategoryId: string | null
  toggleCategory: (id: string) => void
}

export function useResourceDirectory(categories: ResourceCategory[]): UseResourceDirectoryResult {
  const [query, setQuery] = useState('')
  const [openCategoryId, setOpenCategoryId] = useState<string | null>(categories[0]?.id ?? null)

  const results = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    if (!normalizedQuery) return []
    return categories.flatMap((category) =>
      category.resources
        .filter((resource) => resource.title.toLowerCase().includes(normalizedQuery))
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
