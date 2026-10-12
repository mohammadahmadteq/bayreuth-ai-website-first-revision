import { type FC } from 'react'
import { Box, Container, Stack, Text } from '@mantine/core'
import { PageHeader } from '../components/layout/PageHeader'
import { PartnerGrid } from '../components/partners/PartnerGrid'
import { PartnerBenefitsList } from '../components/partners/PartnerBenefitsList'
import { SectionHeading } from '../components/ui/SectionHeading'
import { PartnerButton } from '../components/ui/PartnerButton'
import { FadeInWhenVisible } from '../components/ui/FadeInWhenVisible'
import { ErrorBoundary } from '../components/ErrorBoundary'
import { useSiteContent } from '../hooks/useSiteContent'

const PARTNER_EMAIL = 'bayreuth.ai@gmail.com'

export const PartnersPage: FC = () => {
  const { partners } = useSiteContent()
  return (
    <>
      <PageHeader
        eyebrow="Partners"
        title="Work with us."
        subtitle="Researchers and companies such as NeuroForge, Schaeffler and LivingLogic have given talks at our meetings, and TMT Business Solutions hosted us for a company visit. If you’d like to meet students interested in AI, get in touch."
      />

      <Container size={1280} px={24} py={{ base: 32, md: 48 }}>
        <Stack gap={64}>
          <Stack gap={40}>
            <SectionHeading eyebrow="Why partner" title="How we can work together" />
            <PartnerBenefitsList />
          </Stack>

          <Stack gap={40}>
            <SectionHeading eyebrow="Our network" title="Who we work with" />
            <ErrorBoundary label="Partners">
              <PartnerGrid partners={partners} />
            </ErrorBoundary>
          </Stack>

          <FadeInWhenVisible>
            <Box
              style={{
                position: 'relative',
                overflow: 'hidden',
                borderRadius: 12,
                textAlign: 'center',
                padding: 'clamp(40px, 7vw, 80px) 24px',
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
                  fz="clamp(26px, 5vw, 44px)"
                  style={{ color: 'var(--color-text)', lineHeight: 1.1, maxWidth: 700 }}
                >
                  Become a Partner
                </Text>
                <Text
                  style={{
                    color: 'var(--color-subtext)',
                    fontSize: 17,
                    lineHeight: 1.6,
                    maxWidth: 560,
                  }}
                >
                  Tell us what you have in mind and we’ll work out a format together.
                </Text>
                <PartnerButton
                  size="lg"
                  href={`mailto:${PARTNER_EMAIL}?subject=Partnership%20with%20Bayreuth%20AI`}
                >
                  Email {PARTNER_EMAIL}
                </PartnerButton>
              </Stack>
            </Box>
          </FadeInWhenVisible>
        </Stack>
      </Container>
    </>
  )
}
