import type { MembershipApplication, MembershipSubmitStatus } from '../types/content'

const endpoint = import.meta.env.VITE_MEMBERSHIP_FORM_URL

/**
 * Applications contain personal data, so they are only sent once an endpoint is
 * configured, and a production build only ever sends them over HTTPS.
 */
export function isMembershipSubmissionConfigured(): boolean {
  return Boolean(endpoint) && (!import.meta.env.PROD || endpoint!.startsWith('https://'))
}

export async function submitMembershipApplication(
  application: MembershipApplication,
): Promise<Exclude<MembershipSubmitStatus, 'idle' | 'sending'>> {
  if (!isMembershipSubmissionConfigured()) return 'unavailable'
  try {
    const response = await fetch(endpoint!, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(application),
    })
    if (response.ok) return 'sent'
    return response.status === 429 ? 'rateLimited' : 'failed'
  } catch {
    return 'failed'
  }
}
