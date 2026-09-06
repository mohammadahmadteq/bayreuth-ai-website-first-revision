import { type FC } from 'react'
import { Box, Container, Stack, Text } from '@mantine/core'
import { PageHeader } from '../components/layout/PageHeader'
import { SectionHeading } from '../components/ui/SectionHeading'
import { FaqAccordion } from '../components/faq/FaqAccordion'
import { JoinButton } from '../components/ui/JoinButton'
import { FadeInWhenVisible } from '../components/ui/FadeInWhenVisible'
import { ErrorBoundary } from '../components/ErrorBoundary'
import { faq } from '../data'

const QA_EMAIL = 'bayreuth.ai@gmail.com'

export const QaPage: FC = () => {
  return (
    <>
      <PageHeader
        eyebrow="Q&A"
        title="Questions? Ask away."
        subtitle="Everything you might want to know before coming along. The short version: you are welcome here."
      />

      <Container size={760} px={24} py={{ base: 32, md: 48 }}>
        <Stack gap={40}>
          <SectionHeading
            eyebrow="Good to know"
            title="A few things people ask before their first meeting."
            subtitle="Click a question to open the answer. If yours is missing, bring it along — we are always happy to talk."
          />

          <ErrorBoundary label="Questions">
            <FaqAccordion items={faq} />
          </ErrorBoundary>

          <FadeInWhenVisible>
            <Box
              style={{
                position: 'relative',
                overflow: 'hidden',
                borderRadius: 12,
                textAlign: 'center',
                padding: 'clamp(36px, 6vw, 64px) 24px',
                border: '1px solid var(--border-strong)',
                background: 'rgba(var(--teal-rgb),0.06)',
              }}
            >
              <Box
                className="grid-bg"
                style={{ position: 'absolute', inset: 0, opacity: 0.4, pointerEvents: 'none' }}
              />
              <Stack gap={20} align="center" style={{ position: 'relative', zIndex: 1 }}>
                <Text
                  ff='"Source Sans 3", sans-serif'
                  fw={700}
                  fz="clamp(22px, 4vw, 34px)"
                  style={{ color: 'var(--color-text)', lineHeight: 1.15, maxWidth: 520 }}
                >
                  Still wondering something? Come by and ask us in person.
                </Text>
                <JoinButton
                  href={`mailto:${QA_EMAIL}`}
                  size="lg"
                  withArrow={false}
                >
                  Get in touch
                </JoinButton>
              </Stack>
            </Box>
          </FadeInWhenVisible>
        </Stack>
      </Container>
    </>
  )
}
