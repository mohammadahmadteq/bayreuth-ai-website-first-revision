import { type FC } from 'react'
import { Anchor, Stack, Text } from '@mantine/core'
import { IconDownload } from '@tabler/icons-react'
import { asset } from '../../lib/utils'
import type { MembershipFormText } from '../../types/content'

interface PaperFormDownloadProps {
  text: MembershipFormText['paper']
  href: string
}

export const PaperFormDownload: FC<PaperFormDownloadProps> = ({ text, href }) => (
  <Stack
    component="section"
    gap={10}
    align="flex-start"
    aria-labelledby="membership-paper"
    className="membership-section"
  >
    <Text component="h2" id="membership-paper" className="membership-section__title">
      {text.title}
    </Text>
    <Text fz={15} style={{ color: 'var(--color-subtext)', lineHeight: 1.6 }}>
      {text.text}
    </Text>
    <Anchor href={asset(href)} download className="membership-download">
      <IconDownload size={16} stroke={2} aria-hidden="true" />
      {text.download}
    </Anchor>
  </Stack>
)
