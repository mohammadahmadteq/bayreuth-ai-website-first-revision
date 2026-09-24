import { useContext } from 'react'
import { SiteContentContext } from '../services/siteContentContext'

export function useSiteContent() {
  const content = useContext(SiteContentContext)
  if (!content) throw new Error('SiteContentProvider is missing')
  return content
}
