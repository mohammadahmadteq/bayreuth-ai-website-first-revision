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

// --- Membership application ---------------------------------------------------

export type MembershipLanguage = 'en' | 'de'

export type MembershipType =
  | 'full'
  | 'supporting-individual'
  | 'supporting-legal'
  | 'alumni'
  | 'corresponding'

/** The form's fields as the applicant fills them in. */
export interface MembershipFormValues {
  firstName: string
  surname: string
  /** Only for supporting members that are legal entities. */
  organisation: string
  street: string
  postalCity: string
  country: string
  email: string
  membershipType: MembershipType | ''
  /** Euros as typed, with a decimal point or comma; supporting members only. */
  chosenFee: string
  feeReduction: boolean
  feeReductionRequest: string
  emailList: boolean
  whatsapp: boolean
  mobile: string
  declarationAccepted: boolean
  privacyNoted: boolean
  adultConfirmed: boolean
  confirmationName: string
  /** Hidden from people, so anything typed here marks the submission as spam. */
  website: string
}

export type MembershipField = keyof MembershipFormValues

export type MembershipErrorCode =
  | 'required'
  | 'tooLong'
  | 'email'
  | 'amount'
  | 'minimum'
  | 'phone'
  | 'unchecked'

export type MembershipErrors = Partial<Record<MembershipField, MembershipErrorCode>>

/** What is sent to the board. The submission time is added by the receiving server. */
export interface MembershipApplication {
  language: MembershipLanguage
  firstName: string
  surname: string
  organisation?: string
  street: string
  postalCity: string
  country?: string
  email: string
  membershipType: MembershipType
  chosenFee?: number // euros per year
  feeReduction: boolean
  feeReductionRequest?: string
  emailList: boolean
  whatsapp: boolean
  mobile?: string
  declarationAccepted: boolean
  privacyNoted: boolean
  adultConfirmed: boolean
  confirmationName: string
  website: string
}

export type MembershipSubmitStatus =
  | 'idle'
  | 'sending'
  | 'sent'
  | 'unavailable'
  | 'failed'
  | 'rateLimited'

/** Every text on the membership page, in one language. */
export interface MembershipFormText {
  languageName: string
  eyebrow: string
  title: string
  intro: string
  sections: {
    personal: string
    type: string
    fee: string
    communication: string
    declarations: string
    privacy: string
    confirmation: string
  }
  fields: {
    firstName: string
    surname: string
    organisation: string
    street: string
    postalCity: string
    country: string
    email: string
    emailHint: string
    chosenFee: string
    feeReductionRequest: string
    feeReductionHint: string
    mobile: string
    mobileHint: string
    confirmationName: string
  }
  membershipTypes: Record<MembershipType, { label: string; description?: string }>
  organisationHint: string
  feeParagraphs: string[]
  feeReduction: string
  bankDetails: string[]
  directDebit: string
  communicationIntro: string
  emailList: string
  whatsapp: string
  declaration: string
  /** Split around the words that will link to the privacy notice once it is published. */
  privacyText: { before: string; link: string; after: string }
  privacyNoted: string
  adultConfirmed: string
  minorsNote: string
  submit: string
  sending: string
  errors: {
    required: string
    tooLong: string
    email: string
    membershipType: string
    amount: string
    minimum: (euros: number) => string
    phone: string
    declaration: string
    privacy: string
    adult: string
  }
  status: {
    unavailable: string
    checkFields: string
    failed: string
    rateLimited: string
  }
  confirmation: {
    title: string
    sent: string
    admission: string
    payment: string
    withdraw: string
  }
  paper: {
    title: string
    text: string
    word: string
    pdf: string
  }
}
