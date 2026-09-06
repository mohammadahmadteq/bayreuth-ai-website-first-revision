/**
 * Single typed entry point for all local JSON content.
 *
 * The site reads ONLY from these files — editing the `.json` files updates the
 * site directly, no component code changes required. Importing through this
 * module gives every consumer a typed view of the raw JSON.
 */
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
export const team: TeamMember[] = teamRaw as TeamMember[]
export const projects: Project[] = projectsRaw as Project[]
export const partners: Partner[] = partnersRaw as Partner[]
export const stats: Stat[] = statsRaw as Stat[]
export const faq: FaqItem[] = faqRaw as FaqItem[]
export const resourceCategories: ResourceCategory[] = resourcesRaw as ResourceCategory[]
