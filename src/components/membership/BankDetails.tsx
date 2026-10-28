import { type FC } from 'react'
import { Box, Text } from '@mantine/core'

interface BankDetailsProps {
  lines: string[]
  note: string
}

export const BankDetails: FC<BankDetailsProps> = ({ lines, note }) => (
  <Box className="membership-bank">
    {lines.map((line) => (
      <Text key={line} fz={15} fw={line === lines[0] ? 700 : 400}>
        {line}
      </Text>
    ))}
    <Text fz={13} fs="italic" mt={6} style={{ color: 'var(--color-subtext)' }}>
      {note}
    </Text>
  </Box>
)
