import { type FC } from 'react'
import { Box, Container, Stack, Text } from '@mantine/core'
import { PageHeader } from '../components/layout/PageHeader'
import { PartnerGrid } from '../components/partners/PartnerGrid'
import { PartnerBenefitsList } from '../components/partners/PartnerBenefitsList'
import { SectionHeading } from '../components/ui/SectionHeading'
import { PartnerButton } from '../components/ui/PartnerButton'
import { FadeInWhenVisible } from '../components/ui/FadeInWhenVisible'
import { ErrorBoundary } from '../components/ErrorBoundary'
import { partners } from '../data'

const PARTNER_EMAIL = 'bayreuth.ai@gmail.com'

export const PartnersPage: FC = () => {
  return (
    <>
      <PageHeader
        eyebrow="Partners"
        title="Build the future with us."
        subtitle="We work with companies, research groups, and student initiatives who want to engage with the next generation of AI talent in Bayreuth."
      />

      <Container size={1280} px={24} py={{ base: 56, md: 88 }}>
        <Stack gap={80}>
          <Stack gap={28}>
            <SectionHeading eyebrow="Why partner" title="What sponsors get" />
            <PartnerBenefitsList />
          </Stack>

          <Stack gap={28}>
            <SectionHeading eyebrow="Our network" title="Who we work with" />
            <ErrorBoundary label="Partners">
              <PartnerGrid partners={partners} />
            </ErrorBoundary>
          </Stack>

          {/* Strong closing CTA */}
          <FadeInWhenVisible>
            <Box
              style={{
                position: 'relative',
                overflow: 'hidden',
                borderRadius: 24,
                textAlign: 'center',
                padding: 'clamp(40px, 7vw, 80px) 24px',
                border: '1px solid var(--border-glow)',
                background:
                  'linear-gradient(135deg, rgba(45,224,200,0.1), rgba(57,255,106,0.05) 60%, transparent)',
              }}
            >
              <Box
                className="grid-bg"
                style={{ position: 'absolute', inset: 0, opacity: 0.4, pointerEvents: 'none' }}
              />
              <Stack gap={20} align="center" style={{ position: 'relative', zIndex: 1 }}>
                <Text
                  ff="Space Grotesk, sans-serif"
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
                  Tell us what you’re looking for — talent, visibility, or a collaboration — and
                  we’ll find a format that fits. We’d love to hear from you.
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
