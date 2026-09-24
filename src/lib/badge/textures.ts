import * as THREE from 'three'
import { CARD_WIDTH, CARD_HEIGHT, CARD_RADIUS } from './constants'

function roundedRectClip(ctx: CanvasRenderingContext2D, w: number, h: number, r: number) {
  ctx.beginPath()
  ctx.roundRect(2, 2, w - 4, h - 4, r)
}

const TEXTURE_WIDTH = 768
const TEXTURE_HEIGHT = Math.round((TEXTURE_WIDTH * CARD_HEIGHT) / CARD_WIDTH)
const TEXTURE_RADIUS = (TEXTURE_WIDTH * CARD_RADIUS) / CARD_WIDTH
const CONTENT_LEFT = TEXTURE_WIDTH * 0.09
const CONTENT_RIGHT = TEXTURE_WIDTH * 0.91
const TEAL = '#2fe6a3'

/** Fixed bar widths so the faux barcode is stable across renders. */
const BARCODE = [3, 1, 2, 4, 1, 1, 3, 2, 1, 4, 2, 1, 1, 3, 2, 4, 1, 2, 3, 1, 1, 2, 4, 2, 1, 3]

const toTexture = (canvas: HTMLCanvasElement): THREE.CanvasTexture => {
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = 8
  return texture
}

const newFaceCanvas = () => {
  const canvas = document.createElement('canvas')
  canvas.width = TEXTURE_WIDTH
  canvas.height = TEXTURE_HEIGHT
  return canvas
}

/** Draws `img` scaled to cover the whole face, centred (CSS `object-fit: cover`). */
function drawCover(ctx: CanvasRenderingContext2D, img: CanvasImageSource, w: number, h: number) {
  const iw = 'width' in img ? Number(img.width) : w
  const ih = 'height' in img ? Number(img.height) : h
  const scale = Math.max(w / iw, h / ih)
  const dw = iw * scale
  const dh = ih * scale
  ctx.drawImage(img, (w - dw) / 2, (h - dh) / 2, dw, dh)
}

async function loadTintedLogo(logoSrc: string, color: string): Promise<HTMLCanvasElement> {
  const svgText = await (await fetch(logoSrc)).text()
  const svgEl = new DOMParser().parseFromString(svgText, 'image/svg+xml').documentElement
  const viewBox = (svgEl.getAttribute('viewBox') ?? '0 0 1 1').split(/[\s,]+/).map(Number)
  const aspect = viewBox[3] && viewBox[2] ? viewBox[3] / viewBox[2] : 1
  // Explicit width/height so Firefox reports intrinsic dimensions
  svgEl.setAttribute('width', '512')
  svgEl.setAttribute('height', String(Math.round(512 * aspect)))
  const blobUrl = URL.createObjectURL(
    new Blob([new XMLSerializer().serializeToString(svgEl)], { type: 'image/svg+xml' }),
  )
  try {
    const img = await loadImage(blobUrl)
    const tint = document.createElement('canvas')
    tint.width = img.width
    tint.height = img.height
    const tctx = tint.getContext('2d')!
    tctx.drawImage(img, 0, 0)
    tctx.globalCompositeOperation = 'source-in'
    tctx.fillStyle = color
    tctx.fillRect(0, 0, tint.width, tint.height)
    return tint
  } finally {
    URL.revokeObjectURL(blobUrl)
  }
}

/** Canvas text needs the webfonts resolved, or it silently falls back to the generic sans. */
async function ensureFonts() {
  try {
    await Promise.all([
      document.fonts.load("700 40px 'Space Grotesk'"),
      document.fonts.load("500 40px 'Space Grotesk'"),
      document.fonts.load("500 40px 'Inter'"),
    ])
    await document.fonts.ready
  } catch {
    // Fall back to whatever the browser resolves
  }
}

async function loadImage(src: string): Promise<HTMLImageElement> {
  const image = new Image()
  image.src = src
  await image.decode()
  return image
}

function setTracking(ctx: CanvasRenderingContext2D, px: number) {
  ctx.letterSpacing = `${px}px`
}

export async function buildBadgeFrontTexture(
  logoSrc: string,
  photoSrc: string,
): Promise<THREE.CanvasTexture> {
  await ensureFonts()
  const [mark, photo] = await Promise.all([loadTintedLogo(logoSrc, TEAL), loadImage(photoSrc)])

  const canvas = newFaceCanvas()
  const ctx = canvas.getContext('2d')!

  ctx.save()
  roundedRectClip(ctx, TEXTURE_WIDTH, TEXTURE_HEIGHT, TEXTURE_RADIUS)
  ctx.clip()

  drawPhotoBackground(ctx, photo)
  drawLanyardSlot(ctx)
  drawIssuer(ctx, mark)
  drawPortrait(ctx, photo)
  drawMemberDetails(ctx)
  drawBarcode(ctx)

  ctx.restore()

  roundedRectClip(ctx, TEXTURE_WIDTH, TEXTURE_HEIGHT, TEXTURE_RADIUS)
  ctx.strokeStyle = 'rgba(47, 230, 163, 0.5)'
  ctx.lineWidth = 3
  ctx.stroke()

  return toTexture(canvas)
}

export async function buildPhotoBackTexture(photoSrc: string): Promise<THREE.CanvasTexture> {
  const img = await loadImage(photoSrc)

  const canvas = newFaceCanvas()
  const ctx = canvas.getContext('2d')!

  ctx.save()
  roundedRectClip(ctx, TEXTURE_WIDTH, TEXTURE_HEIGHT, TEXTURE_RADIUS)
  ctx.clip()
  drawCover(ctx, img, TEXTURE_WIDTH, TEXTURE_HEIGHT)
  const shade = ctx.createLinearGradient(0, TEXTURE_HEIGHT * 0.55, 0, TEXTURE_HEIGHT)
  shade.addColorStop(0, 'rgba(8, 10, 14, 0)')
  shade.addColorStop(1, 'rgba(8, 10, 14, 0.72)')
  ctx.fillStyle = shade
  ctx.fillRect(0, TEXTURE_HEIGHT * 0.55, TEXTURE_WIDTH, TEXTURE_HEIGHT * 0.45)
  ctx.restore()

  roundedRectClip(ctx, TEXTURE_WIDTH, TEXTURE_HEIGHT, TEXTURE_RADIUS)
  ctx.strokeStyle = 'rgba(47, 230, 163, 0.5)'
  ctx.lineWidth = 3
  ctx.stroke()

  return toTexture(canvas)
}

function drawPhotoBackground(ctx: CanvasRenderingContext2D, photo: HTMLImageElement) {
  drawCover(ctx, photo, TEXTURE_WIDTH, TEXTURE_HEIGHT)
  ctx.fillStyle = 'rgba(6, 12, 11, 0.72)'
  ctx.fillRect(0, 0, TEXTURE_WIDTH, TEXTURE_HEIGHT)
  const wash = ctx.createLinearGradient(0, 0, TEXTURE_WIDTH, TEXTURE_HEIGHT)
  wash.addColorStop(0, 'rgba(16, 38, 31, 0.42)')
  wash.addColorStop(1, 'rgba(8, 12, 18, 0.5)')
  ctx.fillStyle = wash
  ctx.fillRect(0, 0, TEXTURE_WIDTH, TEXTURE_HEIGHT)
  // Keep the name block legible where it sits over the photo
  const footScrim = ctx.createLinearGradient(0, TEXTURE_HEIGHT * 0.6, 0, TEXTURE_HEIGHT)
  footScrim.addColorStop(0, 'rgba(6, 12, 11, 0)')
  footScrim.addColorStop(1, 'rgba(6, 12, 11, 0.72)')
  ctx.fillStyle = footScrim
  ctx.fillRect(0, TEXTURE_HEIGHT * 0.6, TEXTURE_WIDTH, TEXTURE_HEIGHT * 0.4)
}

function drawLanyardSlot(ctx: CanvasRenderingContext2D) {
  const slotW = TEXTURE_WIDTH * 0.2
  const slotH = TEXTURE_HEIGHT * 0.016
  const slotY = TEXTURE_HEIGHT * 0.036
  ctx.beginPath()
  ctx.roundRect((TEXTURE_WIDTH - slotW) / 2, slotY, slotW, slotH, slotH / 2)
  ctx.fillStyle = 'rgba(0, 0, 0, 0.72)'
  ctx.fill()
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.14)'
  ctx.lineWidth = 2
  ctx.stroke()
}

function drawIssuer(ctx: CanvasRenderingContext2D, mark: HTMLCanvasElement) {
  const markH = TEXTURE_HEIGHT * 0.052
  const markW = markH * (mark.width / mark.height)
  const headY = TEXTURE_HEIGHT * 0.085
  ctx.drawImage(mark, CONTENT_LEFT, headY, markW, markH)
  ctx.textBaseline = 'alphabetic'
  ctx.fillStyle = '#eef2f0'
  ctx.font = `700 ${Math.round(TEXTURE_HEIGHT * 0.029)}px 'Space Grotesk', sans-serif`
  setTracking(ctx, 0.5)
  ctx.fillText('BAYREUTH AI', CONTENT_LEFT + markW + TEXTURE_WIDTH * 0.035, headY + markH * 0.46)
  ctx.fillStyle = 'rgba(160, 214, 197, 0.75)'
  ctx.font = `500 ${Math.round(TEXTURE_HEIGHT * 0.0165)}px 'Inter', sans-serif`
  setTracking(ctx, 2.4)
  ctx.fillText('ASSOCIATION', CONTENT_LEFT + markW + TEXTURE_WIDTH * 0.035, headY + markH * 0.95)
  setTracking(ctx, 0)

  // "MEMBER CARD" chip, right-aligned on the issuer row
  const chipLabel = 'MEMBER CARD'
  ctx.font = `600 ${Math.round(TEXTURE_HEIGHT * 0.0155)}px 'Inter', sans-serif`
  setTracking(ctx, 1.6)
  const chipTextW = ctx.measureText(chipLabel).width
  const chipPadX = TEXTURE_WIDTH * 0.022
  const chipH = TEXTURE_HEIGHT * 0.032
  const chipW = chipTextW + chipPadX * 2
  const chipY = headY + markH * 0.1
  ctx.beginPath()
  ctx.roundRect(CONTENT_RIGHT - chipW, chipY, chipW, chipH, chipH / 2)
  ctx.fillStyle = 'rgba(47, 230, 163, 0.14)'
  ctx.fill()
  ctx.strokeStyle = 'rgba(47, 230, 163, 0.45)'
  ctx.lineWidth = 1.5
  ctx.stroke()
  ctx.fillStyle = TEAL
  ctx.fillText(chipLabel, CONTENT_RIGHT - chipW + chipPadX, chipY + chipH * 0.68)
  setTracking(ctx, 0)

  ctx.beginPath()
  ctx.moveTo(CONTENT_LEFT, TEXTURE_HEIGHT * 0.176)
  ctx.lineTo(CONTENT_RIGHT, TEXTURE_HEIGHT * 0.176)
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)'
  ctx.lineWidth = 1.5
  ctx.stroke()
}

function drawPortrait(ctx: CanvasRenderingContext2D, photo: HTMLImageElement) {
  const winY = TEXTURE_HEIGHT * 0.215
  const winH = TEXTURE_HEIGHT * 0.395
  const winR = TEXTURE_HEIGHT * 0.014
  ctx.save()
  ctx.beginPath()
  ctx.roundRect(CONTENT_LEFT, winY, CONTENT_RIGHT - CONTENT_LEFT, winH, winR)
  ctx.clip()
  drawCover(ctx, photo, TEXTURE_WIDTH, TEXTURE_HEIGHT)
  ctx.fillStyle = 'rgba(6, 14, 12, 0.34)'
  ctx.fillRect(CONTENT_LEFT, winY, CONTENT_RIGHT - CONTENT_LEFT, winH)
  const winShade = ctx.createLinearGradient(0, winY + winH * 0.5, 0, winY + winH)
  winShade.addColorStop(0, 'rgba(5, 11, 10, 0)')
  winShade.addColorStop(1, 'rgba(5, 11, 10, 0.75)')
  ctx.fillStyle = winShade
  ctx.fillRect(CONTENT_LEFT, winY + winH * 0.5, CONTENT_RIGHT - CONTENT_LEFT, winH * 0.5)
  ctx.restore()

  ctx.beginPath()
  ctx.roundRect(CONTENT_LEFT, winY, CONTENT_RIGHT - CONTENT_LEFT, winH, winR)
  ctx.strokeStyle = 'rgba(47, 230, 163, 0.55)'
  ctx.lineWidth = 2.5
  ctx.stroke()

  // Corner ticks on the window, like a registration frame
  const tick = TEXTURE_HEIGHT * 0.018
  ctx.strokeStyle = 'rgba(47, 230, 163, 0.9)'
  ctx.lineWidth = 3
  for (const [cx, cy, dx, dy] of [
    [CONTENT_LEFT, winY, 1, 1],
    [CONTENT_RIGHT, winY, -1, 1],
    [CONTENT_LEFT, winY + winH, 1, -1],
    [CONTENT_RIGHT, winY + winH, -1, -1],
  ]) {
    ctx.beginPath()
    ctx.moveTo(cx + dx * tick, cy)
    ctx.lineTo(cx, cy)
    ctx.lineTo(cx, cy + dy * tick)
    ctx.stroke()
  }
}

function drawMemberDetails(ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = TEAL
  ctx.font = `600 ${Math.round(TEXTURE_HEIGHT * 0.0155)}px 'Inter', sans-serif`
  setTracking(ctx, 2.6)
  ctx.fillText('MEMBER', CONTENT_LEFT, TEXTURE_HEIGHT * 0.663)
  setTracking(ctx, 0)
  ctx.fillStyle = '#f2f6f4'
  ctx.font = `700 ${Math.round(TEXTURE_HEIGHT * 0.038)}px 'Space Grotesk', sans-serif`
  ctx.fillText('Everyone Welcome', CONTENT_LEFT, TEXTURE_HEIGHT * 0.715)
  ctx.fillStyle = 'rgba(178, 200, 194, 0.78)'
  ctx.font = `500 ${Math.round(TEXTURE_HEIGHT * 0.019)}px 'Inter', sans-serif`
  ctx.fillText('Universität Bayreuth · S122, GW I', CONTENT_LEFT, TEXTURE_HEIGHT * 0.752)

  ctx.beginPath()
  ctx.moveTo(CONTENT_LEFT, TEXTURE_HEIGHT * 0.786)
  ctx.lineTo(CONTENT_RIGHT, TEXTURE_HEIGHT * 0.786)
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)'
  ctx.lineWidth = 1.5
  ctx.stroke()
}

function drawBarcode(ctx: CanvasRenderingContext2D) {
  const barY = TEXTURE_HEIGHT * 0.815
  const barH = TEXTURE_HEIGHT * 0.045
  let barX = CONTENT_LEFT
  ctx.fillStyle = 'rgba(232, 244, 240, 0.85)'
  for (const w of BARCODE) {
    ctx.fillRect(barX, barY, w, barH)
    barX += w + 4
  }
  ctx.fillStyle = 'rgba(160, 190, 182, 0.7)'
  ctx.font = `500 ${Math.round(TEXTURE_HEIGHT * 0.0145)}px 'Inter', sans-serif`
  setTracking(ctx, 1.2)
  ctx.fillText('ID 2026 · BT-AI', CONTENT_LEFT, barY + barH + TEXTURE_HEIGHT * 0.026)

  // Flip affordance
  ctx.textAlign = 'right'
  ctx.fillStyle = 'rgba(47, 230, 163, 0.85)'
  ctx.font = `600 ${Math.round(TEXTURE_HEIGHT * 0.0145)}px 'Inter', sans-serif`
  ctx.fillText('CLICK TO REVEAL →', CONTENT_RIGHT, barY + barH + TEXTURE_HEIGHT * 0.026)
  ctx.textAlign = 'left'
  setTracking(ctx, 0)
}
