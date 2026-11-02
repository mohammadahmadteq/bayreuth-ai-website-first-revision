import { useCallback, useMemo, useState } from 'react'
import type {
  MembershipErrors,
  MembershipField,
  MembershipFormValues,
  MembershipLanguage,
  MembershipSubmitStatus,
} from '../types/content'
import {
  EMPTY_MEMBERSHIP_FORM,
  firstInvalidField,
  toMembershipApplication,
  validateMembershipForm,
} from '../lib/membership'
import {
  isMembershipSubmissionConfigured,
  submitMembershipApplication,
} from '../services/membership'

interface UseMembershipFormResult {
  language: MembershipLanguage
  setLanguage: (language: MembershipLanguage) => void
  values: MembershipFormValues
  setField: <K extends MembershipField>(field: K, value: MembershipFormValues[K]) => void
  errors: MembershipErrors
  status: MembershipSubmitStatus
  onlineSubmission: boolean
  /** Whether sending was tried; the summary message only appears after that. */
  attempted: boolean
  /** Marks a filled-in field as left, so its mistakes show before sending. */
  touchField: (field: MembershipField) => void
  /** Validates and sends. Resolves to the first invalid field, if any, so it can take focus. */
  submit: () => Promise<MembershipField | undefined>
}

export function useMembershipForm(): UseMembershipFormResult {
  const [language, setLanguage] = useState<MembershipLanguage>('en')
  const [values, setValues] = useState(EMPTY_MEMBERSHIP_FORM)
  // Every error shows after the first attempt to send. Before that, only fields the
  // applicant has filled in and left are checked, so a fee below the minimum shows at
  // once while untouched required fields stay quiet.
  const [attempted, setAttempted] = useState(false)
  const [touched, setTouched] = useState<Partial<Record<MembershipField, true>>>({})
  const [status, setStatus] = useState<MembershipSubmitStatus>('idle')

  const errors = useMemo(() => {
    const all = validateMembershipForm(values)
    if (attempted) return all
    return Object.fromEntries(
      Object.entries(all).filter(([field]) => touched[field as MembershipField]),
    ) as MembershipErrors
  }, [attempted, touched, values])

  const touchField = useCallback((field: MembershipField) => {
    setTouched((current) => (current[field] ? current : { ...current, [field]: true }))
  }, [])

  const setField = useCallback(
    <K extends MembershipField>(field: K, value: MembershipFormValues[K]) => {
      setValues((current) => ({ ...current, [field]: value }))
    },
    [],
  )

  const submit = async () => {
    if (status === 'sending') return undefined
    setAttempted(true)
    const invalid = firstInvalidField(validateMembershipForm(values))
    if (invalid) {
      setStatus('idle')
      return invalid
    }
    setStatus('sending')
    const result = await submitMembershipApplication(toMembershipApplication(values, language))
    setStatus(result)
    // Nothing needs to stay in memory once the board has the application.
    if (result === 'sent') {
      setValues(EMPTY_MEMBERSHIP_FORM)
      setAttempted(false)
      setTouched({})
    }
    return undefined
  }

  return {
    language,
    setLanguage,
    values,
    setField,
    errors,
    status,
    onlineSubmission: isMembershipSubmissionConfigured(),
    attempted,
    touchField,
    submit,
  }
}
