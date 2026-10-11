import { type FC, type ReactNode } from 'react'
import { Text } from '@mantine/core'

export const TeamSectionTitle: FC<{ id?: string; children: ReactNode }> = ({ id, children }) => (
  <Text
    component="h2"
    id={id}
    m={0}
    ff='"Source Sans 3", sans-serif'
    fw={700}
    fz={13}
    tt="uppercase"
    style={{ letterSpacing: '0.16em', color: 'var(--teal)' }}
  >
    {children}
  </Text>
)
