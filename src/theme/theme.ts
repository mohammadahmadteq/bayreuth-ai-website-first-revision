import { type MantineColorsTuple, createTheme } from '@mantine/core'

/**
 * "Deep space academia" palette.
 *
 * Color reference
 * ---------------
 * content bg (light) ................... #F4F4F8 / #ECEAF3   → CSS var --color-bg
 * chrome bg (navbar/footer/hero, dark) . #0A0A0F / #0D0B14    → .chrome-scope --color-bg
 * primary accent (brand green) ......... #008751              → `teal` tuple, index 5
 * secondary accent (neon green) ........ #39FF6A             → `neon` tuple, index 4 (use sparingly)
 * heading text (content) ............... #14131A             → CSS var --color-text
 * body / muted text (content) .......... #55556A             → CSS var --color-subtext
 *
 * Type reference
 * --------------
 * headings ............................. Space Grotesk (geometric sans)
 * body ................................. Inter (readable sans)
 * mono ................................. Space Grotesk
 */

// Brand green — primary accent (index 5 is Mantine's default shade, matches --teal).
const teal: MantineColorsTuple = [
  '#e3f6ec',
  '#b7e8d1',
  '#86d9b3',
  '#52c993',
  '#1f9c68',
  '#008751',
  '#007a49',
  '#006a40',
  '#005935',
  '#00432a',
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
