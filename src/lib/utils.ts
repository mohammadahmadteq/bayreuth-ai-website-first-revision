export const WHATSAPP_URL = 'https://chat.whatsapp.com/CYZelJF7rDYFkEuz94n86j'

// Prefix public assets so they also resolve under the production subpath.
export function asset(path: string): string {
  if (/^https?:\/\//i.test(path)) return path
  return `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`
}
