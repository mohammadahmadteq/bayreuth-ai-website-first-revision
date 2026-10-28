import type {
  ArchiveTrack,
  EventItem,
  TeamMember,
  Project,
  Partner,
  Stat,
  FaqItem,
  ResourceCategory,
} from '../types/content'
import { parseMeetingArchive } from '../lib/meetingArchive'

import meetingArchiveMarkdown from './meeting-archive.md?raw'
import eventsRaw from './events.json'
import teamRaw from './team.json'
import projectsRaw from './projects.json'
import partnersRaw from './partners.json'
import statsRaw from './stats.json'
import faqRaw from './faq.json'
import resourcesRaw from './resources.json'
import foundersRaw from './founders.json'

export const events: EventItem[] = eventsRaw as EventItem[]
export const team: TeamMember[] = teamRaw
export const projects: Project[] = projectsRaw as Project[]
export const partners: Partner[] = partnersRaw as Partner[]
export const stats: Stat[] = statsRaw
export const faq: FaqItem[] = faqRaw
export const resourceCategories: ResourceCategory[] = resourcesRaw
export const founders: string[] = foundersRaw
export { membershipFormText, membershipPaperForms } from './membership'

// Like the founders list, the archive is fixed history kept only in the
// repository. The tests fail on lines it cannot read; in development they are
// also logged here, so a typo shows up while editing.
const parsedArchive = parseMeetingArchive(meetingArchiveMarkdown)
if (import.meta.env.DEV && parsedArchive.problems.length > 0) {
  console.warn('meeting-archive.md:', parsedArchive.problems)
}
export const meetingArchive: ArchiveTrack[] = parsedArchive.tracks
