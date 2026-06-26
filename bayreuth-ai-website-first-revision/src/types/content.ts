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

export type ProgramFormat = 'reading-group' | 'workshop' | 'track'
export type ProgramLevel = 'beginner' | 'intermediate' | 'advanced'

export interface Program {
  id: string
  title: string
  description: string
  format: ProgramFormat
  level: ProgramLevel
  schedule: string
  capacity?: number
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
