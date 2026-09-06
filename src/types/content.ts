/**
 * Shared TypeScript interfaces for all JSON content under `src/data/`.
 * No logic, no imports from other layers.
 */

export type EventCategory = 'talk' | 'dinner' | 'workshop' | 'social'

export interface EventItem {
  id: string
  title: string
  description: string
  date: string // ISO string
  time: string
  location: string
  category: EventCategory
  isFeatured: boolean
}

export interface TeamMember {
  id: string
  name: string
  role: string
  bio: string
  imageUrl: string
  linkedin?: string
  isBoardMember: boolean
}

export type ProjectCategory = 'research' | 'hackathon' | 'paper' | 'tool'

export interface Project {
  id: string
  title: string
  description: string
  tags: string[]
  category: ProjectCategory
  imageUrl: string
  link?: string
  authors: string[]
  date: string
}

export interface ResourceLink {
  title: string
  url: string
  /** Where it lives, e.g. "YouTube", "GitHub", "arXiv", "Website". */
  source: string
  /** What it is, e.g. "Video", "Course", "Paper". Empty when the source name already says enough (e.g. "GitHub"). */
  type: string
}

export interface ResourceCategory {
  id: string
  title: string
  subtitle?: string
  resources: ResourceLink[]
}

export type PartnerTier = 'sponsor' | 'cooperation'

export interface Partner {
  id: string
  name: string
  logoUrl: string
  websiteUrl?: string
  tier: PartnerTier
  description?: string
}

export interface Stat {
  id: string
  label: string
  value: number
  suffix?: string
  icon?: string
}

export interface FaqItem {
  id: string
  question: string
  answer: string
}
