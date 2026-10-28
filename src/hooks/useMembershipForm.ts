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
  /** Validates and sends. Resolves to the first invalid field, if any, so it can take focus. */
  submit: () => Promise<MembershipField | undefined>
}

export function useMembershipForm(): UseMembershipFormResult {
  const [language, setLanguage] = useState<MembershipLanguage>('en')
  const [values, setValues] = useState(EMPTY_MEMBERSHIP_FORM)
  // Errors appear after the first attempt to send, then update as the applicant fixes them.
  const [attempted, setAttempted] = useState(false)
  const [status, setStatus] = useState<MembershipSubmitStatus>('idle')

  const errors = useMemo(
    () => (attempted ? validateMembershipForm(values) : {}),
    [attempted, values],
  )

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
    submit,
  }
}
