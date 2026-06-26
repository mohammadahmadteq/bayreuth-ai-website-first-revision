import { type MantineColorsTuple, createTheme } from '@mantine/core'

/**
 * "Deep space academia" palette.
 *
 * Color reference
 * ---------------
 * bg (near-black, purple undertone) .... #0A0A0F / #0D0B14   → CSS var --color-bg
 * primary accent (electric teal) ....... #2DE0C8             → `teal` tuple, index 5
 * secondary accent (neon green) ........ #39FF6A             → `neon` tuple, index 4 (use sparingly)
 * heading text ......................... #ECECF2             → CSS var --color-text
 * body / muted text .................... #9A9AB4             → CSS var --color-subtext
 *
 * Type reference
 * --------------
 * headings ............................. Space Grotesk (geometric sans)
 * body ................................. Inter (readable sans)
 * mono ................................. Space Grotesk
 */

// Electric teal — primary accent (index 6 is Mantine's default shade).
const teal: MantineColorsTuple = [
  '#defcf7',
  '#bcf6ec',
  '#90eee0',
  '#5fe6d2',
  '#3ee1ca',
  '#2de0c8',
  '#19c8b1',
  '#06a08e',
  '#007266',
  '#00463e',
]

// Neon / digital green — secondary accent, highlights & CTAs only.
const neon: MantineColorsTuple = [
  '#e7ffec',
  '#c4ffd2',
  '#94ffac',
  '#5dff82',
  '#39ff6a',
  '#23f857',
  '#10df49',
  '#00c63c',
  '#009b2d',
  '#00701f',
]

export const theme = createTheme({
  primaryColor: 'teal',
  primaryShade: 5,
  colors: { teal, neon },
  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
  fontFamilyMonospace: 'Space Grotesk, ui-monospace, monospace',
  headings: {
    fontFamily: 'Space Grotesk, -apple-system, BlinkMacSystemFont, sans-serif',
    fontWeight: '700',
  },
  defaultRadius: 'md',
  radius: {
    xs: '2px',
    sm: '6px',
    md: '12px',
    lg: '20px',
    xl: '9999px',
  },
})
