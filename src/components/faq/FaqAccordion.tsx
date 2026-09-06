import { type FC, useState } from 'react'
import { Box, Text, UnstyledButton } from '@mantine/core'
import { motion, useReducedMotion, AnimatePresence } from 'framer-motion'
import { IconPlus } from '@tabler/icons-react'
import type { FaqItem } from '../../types/content'

interface FaqAccordionProps {
  items: FaqItem[]
  /** id of the item open by default. */
  defaultOpenId?: string
}

/** Numbered single-open accordion. Empty `items` renders nothing — the page decides the empty state. */
export const FaqAccordion: FC<FaqAccordionProps> = ({ items, defaultOpenId }) => {
  const [openId, setOpenId] = useState<string | null>(defaultOpenId ?? items[0]?.id ?? null)
  const reduce = useReducedMotion()

  if (items.length === 0) {
    return (
      <Text style={{ color: 'var(--color-subtext)', textAlign: 'center', padding: 48 }}>
        Questions are being updated — check back soon.
      </Text>
    )
  }

  return (
    <Box style={{ borderTop: '1px solid var(--border)' }}>
      {items.map((item, i) => {
        const isOpen = openId === item.id
        return (
          <Box key={item.id} style={{ borderBottom: '1px solid var(--border)' }}>
            <UnstyledButton
              onClick={() => setOpenId(isOpen ? null : item.id)}
              aria-expanded={isOpen}
              style={{
                width: '100%',
                display: 'grid',
                gridTemplateColumns: '40px 1fr 34px',
                alignItems: 'center',
                gap: 14,
                padding: 'clamp(18px, 2.5vw, 25px) 4px',
                textAlign: 'left',
              }}
            >
              <Text
                ff='"Source Sans 3", sans-serif'
                fw={700}
                fz={12}
                style={{ letterSpacing: '0.08em', color: 'var(--teal)' }}
              >
                {String(i + 1).padStart(2, '0')}
              </Text>
              <Text
                ff='"Source Sans 3", sans-serif'
                fw={700}
                style={{
                  fontSize: 'clamp(17px, 2vw, 22px)',
                  lineHeight: 1.2,
                  letterSpacing: '-0.02em',
                  color: isOpen ? 'var(--teal)' : 'var(--color-text)',
                  transition: 'color 0.2s ease',
                }}
              >
                {item.question}
              </Text>
              <Box
                style={{
                  width: 32,
                  height: 32,
                  display: 'grid',
                  placeItems: 'center',
                  justifySelf: 'end',
                  borderRadius: '50%',
                  border: `1px solid ${isOpen ? 'var(--teal)' : 'var(--border-strong)'}`,
                  background: isOpen ? 'var(--teal)' : 'transparent',
                  color: isOpen ? 'var(--on-teal)' : 'var(--teal)',
                  transform: isOpen ? 'rotate(45deg)' : 'none',
                  transition:
                    'transform 0.25s ease, background-color 0.25s ease, border-color 0.25s ease',
                  flexShrink: 0,
                }}
              >
                <IconPlus size={16} stroke={2.4} />
              </Box>
            </UnstyledButton>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={reduce ? false : { height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={reduce ? undefined : { height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: [0.2, 0, 0, 1] }}
                  style={{ overflow: 'hidden' }}
                >
                  <Box
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '40px 1fr',
                      gap: 14,
                      paddingBottom: 26,
                    }}
                  >
                    <span />
                    <Text
                      style={{
                        color: 'var(--color-subtext)',
                        fontSize: 'clamp(14px, 1.6vw, 16px)',
                        lineHeight: 1.65,
                        maxWidth: 620,
                      }}
                    >
                      {item.answer}
                    </Text>
                  </Box>
                </motion.div>
              )}
            </AnimatePresence>
          </Box>
        )
      })}
    </Box>
  )
}
