/**
 * Photos in public/official/community/ ship with an 840px "-sm" copy for the
 * home page strip. Any other photo (an admin-portal upload, for example) only
 * has one size, which is then used as is.
 */
export function photoThumbnail(imageUrl: string): string {
  return /^\/official\/community\/[^/]+(?<!-sm)\.jpg$/.test(imageUrl)
    ? imageUrl.replace(/\.jpg$/, '-sm.jpg')
    : imageUrl
}
