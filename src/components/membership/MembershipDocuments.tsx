import { type FC } from 'react'
import { Anchor, Stack, Text } from '@mantine/core'
import { IconFileText } from '@tabler/icons-react'
import { asset } from '../../lib/utils'
import type { MembershipFormText } from '../../types/content'

interface MembershipDocumentsProps {
  text: MembershipFormText['documents']
  files: { statute: string; translation: string; regulations: string }
}

const DocumentLink: FC<{ href: string; label: string }> = ({ href, label }) => (
  <Anchor href={asset(href)} target="_blank" rel="noopener" className="membership-download">
    <IconFileText size={16} stroke={2} aria-hidden="true" />
    {label}
  </Anchor>
)

export const MembershipDocuments: FC<MembershipDocumentsProps> = ({ text, files }) => (
  <Stack
    component="section"
    id="membership-documents"
    gap={10}
    align="flex-start"
    aria-labelledby="membership-documents-title"
    className="membership-section"
  >
    <Text component="h2" id="membership-documents-title" className="membership-section__title">
      {text.title}
    </Text>
    <Text fz={15} style={{ color: 'var(--color-subtext)', lineHeight: 1.6 }}>
      {text.intro}
    </Text>
    <ul className="membership-documents">
      <li>
        <DocumentLink href={files.statute} label={text.statute} />
      </li>
      <li>
        <DocumentLink href={files.translation} label={text.translation} />
      </li>
      <li>
        <DocumentLink href={files.regulations} label={text.regulations} />
      </li>
    </ul>
  </Stack>
)
