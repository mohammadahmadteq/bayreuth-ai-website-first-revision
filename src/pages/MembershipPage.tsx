import { type FC } from 'react'
import { Container, Stack } from '@mantine/core'
import { PageHeader } from '../components/layout/PageHeader'
import { LanguageToggle } from '../components/membership/LanguageToggle'
import { MembershipForm } from '../components/membership/MembershipForm'
import { MembershipConfirmation } from '../components/membership/MembershipConfirmation'
import { PaperFormDownload } from '../components/membership/PaperFormDownload'
import { ErrorBoundary } from '../components/ErrorBoundary'
import { useMembershipForm } from '../hooks/useMembershipForm'
import { membershipFormText, membershipPaperForm } from '../data'

const LANGUAGE_OPTIONS = [
  { value: 'en' as const, label: membershipFormText.en.languageName },
  { value: 'de' as const, label: membershipFormText.de.languageName },
]

export const MembershipPage: FC = () => {
  const form = useMembershipForm()
  const text = membershipFormText[form.language]

  // The application is bilingual like the paper form; the rest of the site stays English.
  return (
    <div lang={form.language}>
      <PageHeader eyebrow={text.eyebrow} title={text.title} subtitle={text.intro} />

      <Container size={760} px={24} py={{ base: 32, md: 48 }}>
        <Stack gap={32}>
          <LanguageToggle
            language={form.language}
            options={LANGUAGE_OPTIONS}
            onChange={form.setLanguage}
          />

          <ErrorBoundary label="Membership application">
            {form.status === 'sent' ? (
              <MembershipConfirmation text={text} />
            ) : (
              <MembershipForm
                text={text}
                values={form.values}
                errors={form.errors}
                status={form.status}
                onlineSubmission={form.onlineSubmission}
                onChange={form.setField}
                onSubmit={form.submit}
              />
            )}
          </ErrorBoundary>

          <PaperFormDownload text={text.paper} href={membershipPaperForm} />
        </Stack>
      </Container>
    </div>
  )
}
