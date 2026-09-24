import { createContext } from 'react'
import type { AssociationPhoto, EventItem, Partner, TeamMember } from '../types/content'

export interface SiteContent {
  events: EventItem[]
  partners: Partner[]
  team: TeamMember[]
  photos: AssociationPhoto[]
  error: string | null
  isLoading: boolean
  refresh: () => Promise<void>
}

export const SiteContentContext = createContext<SiteContent | null>(null)
