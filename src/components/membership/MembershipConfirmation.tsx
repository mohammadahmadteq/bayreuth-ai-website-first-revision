import { type FC } from 'react'
import { Stack, Text } from '@mantine/core'
import { BankDetails } from './BankDetails'
import type { MembershipFormText } from '../../types/content'

interface MembershipConfirmationProps {
  text: MembershipFormText
}

// A stable callback ref runs once on mount, not again after a language switch.
const focusOnMount = (element: HTMLElement | null) => {
  element?.focus()
}

export const MembershipConfirmation: FC<MembershipConfirmationProps> = ({ text }) => (
  <Stack
    component="section"
    gap={14}
    className="membership-section"
    aria-labelledby="membership-confirmation"
  >
    {/* Focus moves here once the form is replaced, so screen readers hear the result. */}
    <Text
      component="h2"
      id="membership-confirmation"
      className="membership-section__title"
      tabIndex={-1}
      ref={focusOnMount}
    >
      {text.confirmation.title}
    </Text>
    <Text fz={16}>{text.confirmation.sent}</Text>
    <Text fz={16}>{text.confirmation.admission}</Text>
    <Text fz={16}>{text.confirmation.payment}</Text>
    <BankDetails lines={text.bankDetails} note={text.directDebit} />
    <Text fz={15} style={{ color: 'var(--color-subtext)' }}>
      {text.confirmation.withdraw}
    </Text>
  </Stack>
)
