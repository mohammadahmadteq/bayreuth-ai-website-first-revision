import { type FC } from 'react'
import { Container } from '@mantine/core'
import { PageHeader } from '../components/layout/PageHeader'
import { ResourceDirectory } from '../components/resources/ResourceDirectory'
import { ErrorBoundary } from '../components/ErrorBoundary'
import { useResourceDirectory } from '../hooks/useResourceDirectory'
import { resourceCategories } from '../data'

export const ResourcesPage: FC = () => {
  const { query, setQuery, results, isSearching, openCategoryId, toggleCategory } =
    useResourceDirectory(resourceCategories)

  return (
    <>
      <PageHeader
        eyebrow="Resources"
        title="Learn & Explore"
        subtitle="Tutorials, courses, books, papers and other resources selected by the Bayreuth AI Association."
      />

      <Container size={880} px={24} py={{ base: 32, md: 48 }}>
        <ErrorBoundary label="Resources">
          <ResourceDirectory
            categories={resourceCategories}
            query={query}
            onQueryChange={setQuery}
            results={results}
            isSearching={isSearching}
            openCategoryId={openCategoryId}
            onToggleCategory={toggleCategory}
          />
        </ErrorBoundary>
      </Container>
    </>
  )
}
