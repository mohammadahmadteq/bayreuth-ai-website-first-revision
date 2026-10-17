import { type FC, type FormEvent, type ReactNode } from 'react'
import { Alert, Checkbox, Radio, SimpleGrid, Stack, Text, TextInput, Textarea } from '@mantine/core'
import { JoinButton } from '../ui/JoinButton'
import { BankDetails } from './BankDetails'
import {
  MAX_LENGTH,
  MEMBERSHIP_TYPES,
  membershipFieldId,
  minimumFee,
  needsOrganisation,
} from '../../lib/membership'
import type {
  MembershipErrors,
  MembershipField,
  MembershipFormText,
  MembershipFormValues,
  MembershipSubmitStatus,
  MembershipType,
} from '../../types/content'

type TextField = keyof typeof MAX_LENGTH

interface MembershipFormProps {
  text: MembershipFormText
  values: MembershipFormValues
  errors: MembershipErrors
  status: MembershipSubmitStatus
  onlineSubmission: boolean
  onChange: <K extends MembershipField>(field: K, value: MembershipFormValues[K]) => void
  onSubmit: () => Promise<MembershipField | undefined>
}

const Section: FC<{ id: string; title: string; children: ReactNode }> = ({
  id,
  title,
  children,
}) => (
  <section aria-labelledby={id} className="membership-section">
    <Text component="h2" id={id} className="membership-section__title">
      {title}
    </Text>
    <Stack gap={16}>{children}</Stack>
  </section>
)

/** Checkbox labels carry the asterisk themselves; Mantine only adds one to text inputs. */
const RequiredLabel: FC<{ children: ReactNode }> = ({ children }) => (
  <>
    {children}
    <span className="membership-required" aria-hidden="true">
      {' *'}
    </span>
  </>
)

const Paragraph: FC<{ children: ReactNode }> = ({ children }) => (
  <Text fz={15} style={{ color: 'var(--color-subtext)', lineHeight: 1.6 }}>
    {children}
  </Text>
)

export const MembershipForm: FC<MembershipFormProps> = ({
  text,
  values,
  errors,
  status,
  onlineSubmission,
  onChange,
  onSubmit,
}) => {
  const message = (field: MembershipField): string | undefined => {
    const code = errors[field]
    switch (code) {
      case undefined:
        return undefined
      case 'required':
        return field === 'membershipType' ? text.errors.membershipType : text.errors.required
      case 'unchecked':
        if (field === 'declarationAccepted') return text.errors.declaration
        return field === 'privacyNoted' ? text.errors.privacy : text.errors.adult
      case 'minimum':
        return text.errors.minimum(minimumFee(values.membershipType) ?? 0)
      default:
        return text.errors[code]
    }
  }

  const input = (field: TextField, label: string) => ({
    id: membershipFieldId(field),
    label,
    value: values[field],
    onChange: (event: { currentTarget: { value: string } }) =>
      onChange(field, event.currentTarget.value),
    error: message(field),
    maxLength: MAX_LENGTH[field],
  })

  const checkbox = (
    field:
      | 'feeReduction'
      | 'emailList'
      | 'whatsapp'
      | 'declarationAccepted'
      | 'privacyNoted'
      | 'adultConfirmed',
    label: ReactNode,
  ) => ({
    id: membershipFieldId(field),
    label,
    checked: values[field],
    onChange: (event: { currentTarget: { checked: boolean } }) =>
      onChange(field, event.currentTarget.checked),
    error: message(field),
  })

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const invalid = await onSubmit()
    if (invalid) document.getElementById(membershipFieldId(invalid))?.focus()
  }

  const hasErrors = Object.keys(errors).length > 0
  const statusMessage =
    status === 'unavailable'
      ? text.status.unavailable
      : status === 'failed'
        ? text.status.failed
        : status === 'rateLimited'
          ? text.status.rateLimited
          : hasErrors
            ? text.status.checkFields
            : undefined

  return (
    <form noValidate onSubmit={handleSubmit}>
      <Stack gap={24}>
        {!onlineSubmission && <p className="membership-notice">{text.status.unavailable}</p>}

        <Section id="membership-section-personal" title={text.sections.personal}>
          <SimpleGrid cols={{ base: 1, sm: 2 }} spacing={16}>
            <TextInput
              {...input('firstName', text.fields.firstName)}
              required
              autoComplete="given-name"
            />
            <TextInput
              {...input('surname', text.fields.surname)}
              required
              autoComplete="family-name"
            />
          </SimpleGrid>
          {needsOrganisation(values.membershipType) && (
            <TextInput
              {...input('organisation', text.fields.organisation)}
              required
              autoComplete="organization"
            />
          )}
          <TextInput
            {...input('street', text.fields.street)}
            required
            autoComplete="address-line1"
          />
          <SimpleGrid cols={{ base: 1, sm: 2 }} spacing={16}>
            <TextInput {...input('postalCity', text.fields.postalCity)} required />
            <TextInput {...input('country', text.fields.country)} autoComplete="country-name" />
          </SimpleGrid>
          <TextInput
            {...input('email', text.fields.email)}
            description={text.fields.emailHint}
            required
            type="email"
            autoComplete="email"
          />
        </Section>

        <Section id="membership-section-type" title={text.sections.type}>
          <Radio.Group
            value={values.membershipType}
            onChange={(value) => onChange('membershipType', value as MembershipType)}
            label={text.sections.type}
            labelProps={{ className: 'visually-hidden' }}
            error={message('membershipType')}
            required
          >
            <Stack gap={12}>
              {MEMBERSHIP_TYPES.map((type, index) => (
                <Radio
                  key={type}
                  id={index === 0 ? membershipFieldId('membershipType') : `membership-type-${type}`}
                  value={type}
                  label={text.membershipTypes[type].label}
                  description={text.membershipTypes[type].description}
                />
              ))}
            </Stack>
          </Radio.Group>
          {needsOrganisation(values.membershipType) && (
            <Text fz={14} style={{ color: 'var(--color-subtext)' }}>
              {text.organisationHint}
            </Text>
          )}
          {minimumFee(values.membershipType) !== undefined && (
            <TextInput
              {...input('chosenFee', text.fields.chosenFee)}
              required
              inputMode="decimal"
              w={{ base: '100%', sm: 260 }}
            />
          )}
        </Section>

        <Section id="membership-section-fee" title={text.sections.fee}>
          {text.feeParagraphs.map((paragraph) => (
            <Paragraph key={paragraph}>{paragraph}</Paragraph>
          ))}
          <Checkbox {...checkbox('feeReduction', text.feeReduction)} />
          {values.feeReduction && (
            <Textarea
              {...input('feeReductionRequest', text.fields.feeReductionRequest)}
              description={text.fields.feeReductionHint}
              autosize
              minRows={3}
            />
          )}
          <BankDetails lines={text.bankDetails} note={text.directDebit} />
        </Section>

        <Section id="membership-section-communication" title={text.sections.communication}>
          <Paragraph>{text.communicationIntro}</Paragraph>
          <Checkbox {...checkbox('emailList', text.emailList)} />
          <Checkbox {...checkbox('whatsapp', text.whatsapp)} />
          {values.whatsapp && (
            <TextInput
              {...input('mobile', text.fields.mobile)}
              description={text.fields.mobileHint}
              required
              type="tel"
              autoComplete="tel"
              w={{ base: '100%', sm: 320 }}
            />
          )}
        </Section>

        <Section id="membership-section-declarations" title={text.sections.declarations}>
          <Checkbox
            {...checkbox('declarationAccepted', <RequiredLabel>{text.declaration}</RequiredLabel>)}
            required
          />
        </Section>

        <Section id="membership-section-privacy" title={text.sections.privacy}>
          {/* Link `privacyText.link` to the privacy notice once the board has published it. */}
          <Paragraph>
            {text.privacyText.before}
            {text.privacyText.link}
            {text.privacyText.after}
          </Paragraph>
          <Checkbox
            {...checkbox('privacyNoted', <RequiredLabel>{text.privacyNoted}</RequiredLabel>)}
            required
          />
        </Section>

        <Section id="membership-section-confirmation" title={text.sections.confirmation}>
          <Checkbox
            {...checkbox('adultConfirmed', <RequiredLabel>{text.adultConfirmed}</RequiredLabel>)}
            required
          />
          <Text fz={14} style={{ color: 'var(--color-subtext)' }}>
            {text.minorsNote}
          </Text>
          <TextInput
            {...input('confirmationName', text.fields.confirmationName)}
            required
            autoComplete="off"
          />
        </Section>

        {/* Spam trap: hidden from people and screen readers, so only bots fill it in. */}
        <div className="membership-honeypot" aria-hidden="true">
          <label htmlFor="membership-website">Website</label>
          <input
            id="membership-website"
            name="website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={values.website}
            onChange={(event) => onChange('website', event.currentTarget.value)}
          />
        </div>

        {statusMessage && (
          <Alert color={hasErrors ? 'red' : 'yellow'} variant="light" role="alert">
            {statusMessage}
          </Alert>
        )}

        <div>
          <JoinButton submit disabled={status === 'sending'} withArrow={status !== 'sending'}>
            {status === 'sending' ? text.sending : text.submit}
          </JoinButton>
        </div>
      </Stack>
    </form>
  )
}
