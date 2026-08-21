import { type MantineColorsTuple, createTheme } from '@mantine/core'

/**
 * Bayreuth AI Association palette — single brand green, derived tints/shades.
 *
 * Color reference
 * ---------------
 * content bg (light) ................... #F4F4F8 / #ECEAF3   → CSS var --color-bg
 * chrome bg (navbar/footer/hero, dark) . #07211A / #0A2A20    → .chrome-scope --color-bg
 * accent (brand green) ................. #008751              → `green` tuple, index 5
 * heading text (content) ............... #14131A             → CSS var --color-text
 * body / muted text (content) .......... #55556A             → CSS var --color-subtext
 *
 * Type reference
 * --------------
 * single typeface throughout: Source Sans 3
 */

// Brand green — sole accent (index 5 is Mantine's default shade, matches --teal).
const green: MantineColorsTuple = [
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

export const theme = createTheme({
  primaryColor: 'green',
  primaryShade: 5,
  colors: { green },
  fontFamily: '"Source Sans 3", -apple-system, BlinkMacSystemFont, sans-serif',
  fontFamilyMonospace: '"Source Sans 3", ui-monospace, monospace',
  headings: {
    fontFamily: '"Source Sans 3", -apple-system, BlinkMacSystemFont, sans-serif',
    fontWeight: '700',
  },
  defaultRadius: 'md',
  radius: {
    xs: '2px',
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
  },
})
