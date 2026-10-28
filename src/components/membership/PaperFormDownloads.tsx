import { type FC } from 'react'
import { Anchor, Group, Stack, Text } from '@mantine/core'
import { IconDownload } from '@tabler/icons-react'
import { asset } from '../../lib/utils'
import type { MembershipFormText } from '../../types/content'

interface PaperFormDownloadsProps {
  text: MembershipFormText['paper']
  files: { docx: string; pdf: string }
}

export const PaperFormDownloads: FC<PaperFormDownloadsProps> = ({ text, files }) => (
  <Stack
    component="section"
    gap={10}
    aria-labelledby="membership-paper"
    className="membership-section"
  >
    <Text component="h2" id="membership-paper" className="membership-section__title">
      {text.title}
    </Text>
    <Text fz={15} style={{ color: 'var(--color-subtext)', lineHeight: 1.6 }}>
      {text.text}
    </Text>
    <Group gap={20}>
      {[
        { href: files.pdf, label: text.pdf },
        { href: files.docx, label: text.word },
      ].map((file) => (
        <Anchor key={file.href} href={asset(file.href)} download className="membership-download">
          <IconDownload size={16} stroke={2} aria-hidden="true" />
          {file.label}
        </Anchor>
      ))}
    </Group>
  </Stack>
)
