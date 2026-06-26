import { type FC, useState } from 'react'
import { Box, Group, Stack, Text, UnstyledButton } from '@mantine/core'
import { IconClock, IconMapPin, IconChevronDown } from '@tabler/icons-react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import type { EventItem } from '../../types/content'
import { splitDate } from '../../lib/utils'
import { Badge } from '../ui/Badge'

interface EventCardProps {
  event: EventItem
}

export const EventCard: FC<EventCardProps> = ({ event }) => {
  const [open, setOpen] = useState(event.isFeatured)
  const reduce = useReducedMotion()
  const { month, day } = splitDate(event.date)

  return (
    <Box
      className="glow-card"
      style={{
        padding: 20,
        borderColor: event.isFeatured ? 'var(--border-glow)' : 'var(--border)',
        boxShadow: event.isFeatured ? '0 0 0 1px var(--border-glow)' : undefined,
      }}
    >
      <UnstyledButton
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        style={{ width: '100%' }}
      >
        <Group justify="space-between" align="center" wrap="nowrap" gap={16}>
          <Group gap={16} align="center" wrap="nowrap" style={{ minWidth: 0 }}>
            <Stack
              gap={0}
              align="center"
              justify="center"
              style={{
                minWidth: 58,
                padding: '8px 6px',
                borderRadius: 12,
                background: 'var(--color-surface-strong)',
                border: '1px solid var(--border)',
              }}
            >
              <Text
                ff="Space Grotesk, sans-serif"
                fw={700}
                fz={11}
                style={{ color: 'var(--teal)', letterSpacing: '0.08em' }}
              >
                {month}
              </Text>
              <Text
                ff="Space Grotesk, sans-serif"
                fw={700}
                fz={24}
                style={{ color: 'var(--color-text)', lineHeight: 1 }}
              >
                {day}
              </Text>
            </Stack>

            <Stack gap={6} style={{ minWidth: 0 }}>
              <Group gap={8}>
                <Badge variant={event.isFeatured ? 'neon' : 'muted'}>{event.category}</Badge>
                {event.isFeatured && <Badge variant="teal">Featured</Badge>}
              </Group>
              <Text
                fw={700}
                ff="Space Grotesk, sans-serif"
                fz={18}
                style={{ color: 'var(--color-text)' }}
                lineClamp={1}
              >
                {event.title}
              </Text>
            </Stack>
          </Group>

          <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.25 }}>
            <IconChevronDown size={20} color="var(--color-subtext)" />
          </motion.div>
        </Group>
      </UnstyledButton>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={reduce ? false : { opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={reduce ? undefined : { opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.2, 0, 0, 1] }}
            style={{ overflow: 'hidden' }}
          >
            <Stack gap={12} pt={16} mt={16} style={{ borderTop: '1px solid var(--border)' }}>
              <Text fz={15} style={{ color: 'var(--color-subtext)', lineHeight: 1.6 }}>
                {event.description}
              </Text>
              <Group gap={20} wrap="wrap">
                <Group gap={6}>
                  <IconClock size={15} color="var(--teal)" />
                  <Text fz={13} style={{ color: 'var(--color-subtext)' }}>
                    {event.time}
                  </Text>
                </Group>
                <Group gap={6} wrap="nowrap">
                  <IconMapPin size={15} color="var(--teal)" style={{ flexShrink: 0 }} />
                  <Text fz={13} style={{ color: 'var(--color-subtext)' }}>
                    {event.location}
                  </Text>
                </Group>
              </Group>
            </Stack>
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  )
}
