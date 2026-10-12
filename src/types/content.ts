export type EventCategory = 'talk' | 'dinner' | 'workshop' | 'social'

export type CategoryFilter = 'all' | EventCategory
export type Timeframe = 'all' | 'upcoming' | 'month' | 'past'

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

/** A past meeting from src/data/meeting-archive.md. */
export interface ArchiveEntry {
  date: string // yyyy-mm-dd
  title: string
  speaker?: string
}

export interface ArchiveYear {
  year: number
  entries: ArchiveEntry[]
}

/** One tab of the archive, such as the guest talks. */
export interface ArchiveTrack {
  title: string
  years: ArchiveYear[]
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

export interface AssociationPhoto {
  id: string
  imageUrl: string
  alt: string
}

export type ProjectCategory = 'research' | 'hackathon' | 'paper' | 'tool'
export type ProjectStatus = 'in-progress' | 'concluded'

export interface PressLink {
  label: string
  url: string
}

export interface Project {
  id: string
  title: string
  description: string
  tags: string[]
  category: ProjectCategory
  status?: ProjectStatus
  imageUrl?: string
  imageAlt?: string
  link?: string
  /** Contributors, in the order they are credited. */
  authors: string[]
  press?: PressLink[]
  date?: string
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

export interface ResourceSearchResult extends ResourceLink {
  categoryId: string
  categoryTitle: string
}
