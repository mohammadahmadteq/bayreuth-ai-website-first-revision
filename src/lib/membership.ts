import type {
  MembershipApplication,
  MembershipErrors,
  MembershipField,
  MembershipFormValues,
  MembershipLanguage,
  MembershipType,
} from '../types/content'

export const MEMBERSHIP_TYPES: MembershipType[] = [
  'full',
  'supporting-individual',
  'supporting-legal',
  'alumni',
  'corresponding',
]

/** Supporting members choose their own fee, from these amounts in euros per year. */
const MINIMUM_FEE: Partial<Record<MembershipType, number>> = {
  'supporting-individual': 20,
  'supporting-legal': 50,
}

/** Longest accepted entry per text field, in characters. The server enforces the same. */
export const MAX_LENGTH = {
  firstName: 100,
  surname: 100,
  organisation: 200,
  street: 200,
  postalCity: 200,
  country: 100,
  email: 254,
  chosenFee: 12,
  feeReductionRequest: 2000,
  mobile: 30,
  confirmationName: 200,
} satisfies Partial<Record<MembershipField, number>>

/** Fields in page order, so the first invalid one can receive focus. */
export const MEMBERSHIP_FIELD_ORDER: MembershipField[] = [
  'firstName',
  'surname',
  'organisation',
  'street',
  'postalCity',
  'country',
  'email',
  'membershipType',
  'chosenFee',
  'feeReductionRequest',
  'mobile',
  'declarationAccepted',
  'privacyNoted',
  'adultConfirmed',
  'confirmationName',
]

export const EMPTY_MEMBERSHIP_FORM: MembershipFormValues = {
  firstName: '',
  surname: '',
  organisation: '',
  street: '',
  postalCity: '',
  country: '',
  email: '',
  membershipType: '',
  chosenFee: '',
  feeReduction: false,
  feeReductionRequest: '',
  emailList: false,
  whatsapp: false,
  mobile: '',
  declarationAccepted: false,
  privacyNoted: false,
  adultConfirmed: false,
  confirmationName: '',
  website: '',
}

export function minimumFee(type: MembershipType | ''): number | undefined {
  return type ? MINIMUM_FEE[type] : undefined
}

export function needsOrganisation(type: MembershipType | ''): boolean {
  return type === 'supporting-legal'
}

/** Whole or decimal euros with a point or comma ("25", "25.5", "25,50"); null otherwise. */
export function parseEuroAmount(input: string): number | null {
  const match = input.trim().match(/^(\d{1,7})(?:[.,](\d{1,2}))?$/)
  return match ? Number(`${match[1]}.${match[2] ?? '0'}`) : null
}

/** Drops spaces and the usual separators but keeps a leading "+". */
export function normalizePhone(input: string): string {
  return input.trim().replace(/[\s()./-]/g, '')
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
// E.164 numbers have at most 15 digits; national numbers without a country code are accepted too.
const PHONE = /^\+?\d{7,15}$/

export function validateMembershipForm(values: MembershipFormValues): MembershipErrors {
  const errors: MembershipErrors = {}
  const text = (field: keyof typeof MAX_LENGTH, required: boolean) => {
    const value = values[field].trim()
    if (required && value === '') errors[field] = 'required'
    else if (value.length > MAX_LENGTH[field]) errors[field] = 'tooLong'
  }

  // Conditional fields are only checked while they are shown, so a hidden field
  // can never block the form with an error nobody can see.
  text('firstName', true)
  text('surname', true)
  if (needsOrganisation(values.membershipType)) text('organisation', true)
  text('street', true)
  text('postalCity', true)
  text('country', false)
  text('email', true)
  if (!errors.email && !EMAIL.test(values.email.trim())) errors.email = 'email'

  if (values.membershipType === '') errors.membershipType = 'required'
  const minimum = minimumFee(values.membershipType)
  if (minimum !== undefined) {
    const fee = parseEuroAmount(values.chosenFee)
    if (values.chosenFee.trim() === '') errors.chosenFee = 'required'
    else if (fee === null) errors.chosenFee = 'amount'
    else if (fee < minimum) errors.chosenFee = 'minimum'
  }

  if (values.feeReduction) text('feeReductionRequest', false)
  if (values.whatsapp) {
    text('mobile', true)
    if (!errors.mobile && !PHONE.test(normalizePhone(values.mobile))) errors.mobile = 'phone'
  }

  if (!values.declarationAccepted) errors.declarationAccepted = 'unchecked'
  if (!values.privacyNoted) errors.privacyNoted = 'unchecked'
  if (!values.adultConfirmed) errors.adultConfirmed = 'unchecked'
  text('confirmationName', true)
  return errors
}

export function firstInvalidField(errors: MembershipErrors): MembershipField | undefined {
  return MEMBERSHIP_FIELD_ORDER.find((field) => errors[field])
}

/** DOM id of a field's input, so the first invalid one can be focused. */
export function membershipFieldId(field: MembershipField): string {
  return `membership-${field}`
}

/**
 * Builds what is sent to the board from a valid form. Answers that no longer
 * apply, such as a mobile number after the WhatsApp box was unticked, are left
 * out so they are never transmitted.
 */
export function toMembershipApplication(
  values: MembershipFormValues,
  language: MembershipLanguage,
): MembershipApplication {
  if (values.membershipType === '') throw new Error('The membership type is missing.')
  const optional = (value: string) => value.trim() || undefined
  const supporting = minimumFee(values.membershipType) !== undefined
  return {
    language,
    firstName: values.firstName.trim(),
    surname: values.surname.trim(),
    organisation: needsOrganisation(values.membershipType)
      ? optional(values.organisation)
      : undefined,
    street: values.street.trim(),
    postalCity: values.postalCity.trim(),
    country: optional(values.country),
    email: values.email.trim(),
    membershipType: values.membershipType,
    chosenFee: supporting ? (parseEuroAmount(values.chosenFee) ?? undefined) : undefined,
    feeReduction: values.feeReduction,
    feeReductionRequest: values.feeReduction ? optional(values.feeReductionRequest) : undefined,
    emailList: values.emailList,
    whatsapp: values.whatsapp,
    mobile: values.whatsapp ? normalizePhone(values.mobile) : undefined,
    declarationAccepted: values.declarationAccepted,
    privacyNoted: values.privacyNoted,
    adultConfirmed: values.adultConfirmed,
    confirmationName: values.confirmationName.trim(),
    website: values.website,
  }
}
