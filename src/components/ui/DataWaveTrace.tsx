import { type FC } from 'react'
import { Box } from '@mantine/core'
import { useReducedMotion } from 'framer-motion'

const WAVE_PATH =
  'M0 50 L30 80.7 L60 46 L94 24 L126 48 L147 15.9 L172 19.9 L205 76 L222 58 L250 89 L271 60.3 L303 13.3 L320 24 L343 58.4 L373 35.4 L407 78.8 L439 27.6 L464 50 L482 46.4 L506 42.2 L539 91.6 L557 67.5 L583 71.7 L615 32.3 L633 55.3 L640 41.6'
const WAVE_LENGTH = 959.3
const VIEW_W = 640
const VIEW_H = 100

interface DataWaveTraceProps {
  className?: string
}

/** Decorative jagged data waveform, full-width, with a dot that sweeps it and lights up green. */
export const DataWaveTrace: FC<DataWaveTraceProps> = ({ className }) => {
  const reduce = useReducedMotion()

  return (
    <Box style={{ width: '100%', aspectRatio: `${VIEW_W} / ${VIEW_H}` }}>
      <svg
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        className={className}
        style={{ width: '100%', height: '100%', display: 'block' }}
        aria-hidden="true"
      >
        <path
          d={WAVE_PATH}
          fill="none"
          stroke="var(--border-strong)"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {!reduce && (
          <>
            <path
              d={WAVE_PATH}
              fill="none"
              stroke="var(--teal)"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="data-wave-trace"
              style={{
                ['--wave-len' as string]: WAVE_LENGTH,
                strokeDasharray: WAVE_LENGTH,
              }}
            />
            <circle
              r={6}
              className="data-wave-dot"
              style={{ offsetPath: `path("${WAVE_PATH}")` }}
            />
          </>
        )}
      </svg>
    </Box>
  )
}
