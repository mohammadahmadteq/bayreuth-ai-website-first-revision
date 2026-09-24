import type {
  EventItem,
  TeamMember,
  Project,
  Partner,
  Stat,
  FaqItem,
  ResourceCategory,
} from '../types/content'

import eventsRaw from './events.json'
import teamRaw from './team.json'
import projectsRaw from './projects.json'
import partnersRaw from './partners.json'
import statsRaw from './stats.json'
import faqRaw from './faq.json'
import resourcesRaw from './resources.json'

export const events: EventItem[] = eventsRaw as EventItem[]
export const team: TeamMember[] = teamRaw
export const projects: Project[] = projectsRaw as Project[]
export const partners: Partner[] = partnersRaw as Partner[]
export const stats: Stat[] = statsRaw
export const faq: FaqItem[] = faqRaw
export const resourceCategories: ResourceCategory[] = resourcesRaw
