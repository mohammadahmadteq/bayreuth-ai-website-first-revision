import { type MantineColorsTuple, createTheme } from '@mantine/core'

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
