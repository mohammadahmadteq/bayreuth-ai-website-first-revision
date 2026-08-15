import { type FC, useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { useReducedMotion } from 'framer-motion'

interface Logo3DCardProps {
  /** URL of the SVG logo used as the badge's issuer mark. */
  logoSrc: string
  /** Photo shown dimmed in the badge's portrait window, revealed in full on flip. */
  photoSrc: string
  alt?: string
  photoAlt?: string
}

/* Card dimensions in world units — portrait ID-badge proportions */
const CARD_W = 2.6
const CARD_H = 3.7
const CARD_R = 0.16
const CARD_DEPTH = 0.1

/* Lanyard strap: world-unit run from the fixed top anchor to the card's top edge */
const STRAP_LEN = 1.0
const STRAP_WIDTH = 0.2
const STRAP_SEGMENTS = 20
const TOTAL_H = CARD_H + STRAP_LEN
const ANCHOR_Y = TOTAL_H / 2
const REST_Y = -STRAP_LEN / 2

/*
 * The canvas extends past the layout box by this factor so a dragged card
 * isn't clipped at the box edge. It is pointer-events: none (input arrives
 * via window listeners), so the overhang never blocks surrounding UI.
 */
const OVERSCAN = 1.24
const DRAG_LIMIT = 0.9
const DRAG_HARD_LIMIT = 1.1

/* A pointer that moves less than this and releases quickly counts as a click, not a drag */
const CLICK_MOVE_THRESHOLD = 6
const CLICK_TIME_THRESHOLD = 350

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v))

function roundedRectShape(w: number, h: number, r: number): THREE.Shape {
  const shape = new THREE.Shape()
  const x = -w / 2
  const y = -h / 2
  shape.moveTo(x + r, y)
  shape.lineTo(x + w - r, y)
  shape.quadraticCurveTo(x + w, y, x + w, y + r)
  shape.lineTo(x + w, y + h - r)
  shape.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  shape.lineTo(x + r, y + h)
  shape.quadraticCurveTo(x, y + h, x, y + h - r)
  shape.lineTo(x, y + r)
  shape.quadraticCurveTo(x, y, x + r, y)
  return shape
}

function roundedRectClip(ctx: CanvasRenderingContext2D, w: number, h: number, r: number) {
  ctx.beginPath()
  ctx.roundRect(2, 2, w - 4, h - 4, r)
}

const TEX_W = 768
const TEX_H = Math.round((TEX_W * CARD_H) / CARD_W)
const TEX_R = (TEX_W * CARD_R) / CARD_W
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
  canvas.width = TEX_W
  canvas.height = TEX_H
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

/** Loads the SVG logo recoloured to a flat fill, for use as the issuer mark. */
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
    const img = new Image()
    img.src = blobUrl
    await img.decode()
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

/** Applies letter-spacing where supported; harmless no-op elsewhere. */
function setTracking(ctx: CanvasRenderingContext2D, px: number) {
  ;(ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = `${px}px`
}

/**
 * The badge front: a member ID card. The photo fills the whole face but is
 * heavily dimmed, then re-drawn brighter inside a portrait window — so the
 * image reads as "there is something behind here" without competing with the
 * card's text. Below it sit the usual ID furniture: issuer mark, name block,
 * barcode and validity line.
 */
async function buildBadgeFrontTexture(
  logoSrc: string,
  photoSrc: string,
): Promise<THREE.CanvasTexture> {
  await ensureFonts()
  const [mark, photo] = await Promise.all([
    loadTintedLogo(logoSrc, TEAL),
    (async () => {
      const img = new Image()
      img.src = photoSrc
      await img.decode()
      return img
    })(),
  ])

  const canvas = newFaceCanvas()
  const ctx = canvas.getContext('2d')!
  const x0 = TEX_W * 0.09
  const x1 = TEX_W * 0.91

  ctx.save()
  roundedRectClip(ctx, TEX_W, TEX_H, TEX_R)
  ctx.clip()

  // Base: the photo, then a heavy scrim so it only whispers through
  drawCover(ctx, photo, TEX_W, TEX_H)
  ctx.fillStyle = 'rgba(6, 12, 11, 0.72)'
  ctx.fillRect(0, 0, TEX_W, TEX_H)
  const wash = ctx.createLinearGradient(0, 0, TEX_W, TEX_H)
  wash.addColorStop(0, 'rgba(16, 38, 31, 0.42)')
  wash.addColorStop(1, 'rgba(8, 12, 18, 0.5)')
  ctx.fillStyle = wash
  ctx.fillRect(0, 0, TEX_W, TEX_H)
  // Keep the name block legible where it sits over the photo
  const footScrim = ctx.createLinearGradient(0, TEX_H * 0.6, 0, TEX_H)
  footScrim.addColorStop(0, 'rgba(6, 12, 11, 0)')
  footScrim.addColorStop(1, 'rgba(6, 12, 11, 0.72)')
  ctx.fillStyle = footScrim
  ctx.fillRect(0, TEX_H * 0.6, TEX_W, TEX_H * 0.4)

  // Lanyard punch slot
  const slotW = TEX_W * 0.2
  const slotH = TEX_H * 0.016
  const slotY = TEX_H * 0.036
  ctx.beginPath()
  ctx.roundRect((TEX_W - slotW) / 2, slotY, slotW, slotH, slotH / 2)
  ctx.fillStyle = 'rgba(0, 0, 0, 0.72)'
  ctx.fill()
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.14)'
  ctx.lineWidth = 2
  ctx.stroke()

  // Issuer row
  const markH = TEX_H * 0.052
  const markW = markH * (mark.width / mark.height)
  const headY = TEX_H * 0.085
  ctx.drawImage(mark, x0, headY, markW, markH)
  ctx.textBaseline = 'alphabetic'
  ctx.fillStyle = '#eef2f0'
  ctx.font = `700 ${Math.round(TEX_H * 0.029)}px 'Space Grotesk', sans-serif`
  setTracking(ctx, 0.5)
  ctx.fillText('BAYREUTH AI', x0 + markW + TEX_W * 0.035, headY + markH * 0.46)
  ctx.fillStyle = 'rgba(160, 214, 197, 0.75)'
  ctx.font = `500 ${Math.round(TEX_H * 0.0165)}px 'Inter', sans-serif`
  setTracking(ctx, 2.4)
  ctx.fillText('ASSOCIATION', x0 + markW + TEX_W * 0.035, headY + markH * 0.95)
  setTracking(ctx, 0)

  // "MEMBER CARD" chip, right-aligned on the issuer row
  const chipLabel = 'MEMBER CARD'
  ctx.font = `600 ${Math.round(TEX_H * 0.0155)}px 'Inter', sans-serif`
  setTracking(ctx, 1.6)
  const chipTextW = ctx.measureText(chipLabel).width
  const chipPadX = TEX_W * 0.022
  const chipH = TEX_H * 0.032
  const chipW = chipTextW + chipPadX * 2
  const chipY = headY + markH * 0.1
  ctx.beginPath()
  ctx.roundRect(x1 - chipW, chipY, chipW, chipH, chipH / 2)
  ctx.fillStyle = 'rgba(47, 230, 163, 0.14)'
  ctx.fill()
  ctx.strokeStyle = 'rgba(47, 230, 163, 0.45)'
  ctx.lineWidth = 1.5
  ctx.stroke()
  ctx.fillStyle = TEAL
  ctx.fillText(chipLabel, x1 - chipW + chipPadX, chipY + chipH * 0.68)
  setTracking(ctx, 0)

  ctx.beginPath()
  ctx.moveTo(x0, TEX_H * 0.176)
  ctx.lineTo(x1, TEX_H * 0.176)
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)'
  ctx.lineWidth = 1.5
  ctx.stroke()

  // Portrait window — same photo, far less scrim, so the image is unmistakable
  const winY = TEX_H * 0.215
  const winH = TEX_H * 0.395
  const winR = TEX_H * 0.014
  ctx.save()
  ctx.beginPath()
  ctx.roundRect(x0, winY, x1 - x0, winH, winR)
  ctx.clip()
  drawCover(ctx, photo, TEX_W, TEX_H)
  ctx.fillStyle = 'rgba(6, 14, 12, 0.34)'
  ctx.fillRect(x0, winY, x1 - x0, winH)
  const winShade = ctx.createLinearGradient(0, winY + winH * 0.5, 0, winY + winH)
  winShade.addColorStop(0, 'rgba(5, 11, 10, 0)')
  winShade.addColorStop(1, 'rgba(5, 11, 10, 0.75)')
  ctx.fillStyle = winShade
  ctx.fillRect(x0, winY + winH * 0.5, x1 - x0, winH * 0.5)
  ctx.restore()

  ctx.beginPath()
  ctx.roundRect(x0, winY, x1 - x0, winH, winR)
  ctx.strokeStyle = 'rgba(47, 230, 163, 0.55)'
  ctx.lineWidth = 2.5
  ctx.stroke()

  // Corner ticks on the window, like a registration frame
  const tick = TEX_H * 0.018
  ctx.strokeStyle = 'rgba(47, 230, 163, 0.9)'
  ctx.lineWidth = 3
  for (const [cx, cy, dx, dy] of [
    [x0, winY, 1, 1],
    [x1, winY, -1, 1],
    [x0, winY + winH, 1, -1],
    [x1, winY + winH, -1, -1],
  ]) {
    ctx.beginPath()
    ctx.moveTo(cx + dx * tick, cy)
    ctx.lineTo(cx, cy)
    ctx.lineTo(cx, cy + dy * tick)
    ctx.stroke()
  }

  // Name block
  ctx.fillStyle = TEAL
  ctx.font = `600 ${Math.round(TEX_H * 0.0155)}px 'Inter', sans-serif`
  setTracking(ctx, 2.6)
  ctx.fillText('MEMBER', x0, TEX_H * 0.663)
  setTracking(ctx, 0)
  ctx.fillStyle = '#f2f6f4'
  ctx.font = `700 ${Math.round(TEX_H * 0.038)}px 'Space Grotesk', sans-serif`
  ctx.fillText('Everyone Welcome', x0, TEX_H * 0.715)
  ctx.fillStyle = 'rgba(178, 200, 194, 0.78)'
  ctx.font = `500 ${Math.round(TEX_H * 0.019)}px 'Inter', sans-serif`
  ctx.fillText('Universität Bayreuth · S122, GW I', x0, TEX_H * 0.752)

  ctx.beginPath()
  ctx.moveTo(x0, TEX_H * 0.786)
  ctx.lineTo(x1, TEX_H * 0.786)
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)'
  ctx.lineWidth = 1.5
  ctx.stroke()

  // Barcode + validity
  const barY = TEX_H * 0.815
  const barH = TEX_H * 0.045
  let barX = x0
  ctx.fillStyle = 'rgba(232, 244, 240, 0.85)'
  for (const w of BARCODE) {
    ctx.fillRect(barX, barY, w, barH)
    barX += w + 4
  }
  ctx.fillStyle = 'rgba(160, 190, 182, 0.7)'
  ctx.font = `500 ${Math.round(TEX_H * 0.0145)}px 'Inter', sans-serif`
  setTracking(ctx, 1.2)
  ctx.fillText('ID 2026 · BT-AI', x0, barY + barH + TEX_H * 0.026)

  // Flip affordance
  ctx.textAlign = 'right'
  ctx.fillStyle = 'rgba(47, 230, 163, 0.85)'
  ctx.font = `600 ${Math.round(TEX_H * 0.0145)}px 'Inter', sans-serif`
  ctx.fillText('CLICK TO REVEAL →', x1, barY + barH + TEX_H * 0.026)
  ctx.textAlign = 'left'
  setTracking(ctx, 0)

  ctx.restore()

  // Frame
  roundedRectClip(ctx, TEX_W, TEX_H, TEX_R)
  ctx.strokeStyle = 'rgba(47, 230, 163, 0.5)'
  ctx.lineWidth = 3
  ctx.stroke()

  return toTexture(canvas)
}

/** The badge back: the photo at full strength — the payoff for flipping. */
async function buildPhotoBackTexture(photoSrc: string): Promise<THREE.CanvasTexture> {
  const img = new Image()
  img.src = photoSrc
  await img.decode()

  const canvas = newFaceCanvas()
  const ctx = canvas.getContext('2d')!

  ctx.save()
  roundedRectClip(ctx, TEX_W, TEX_H, TEX_R)
  ctx.clip()
  drawCover(ctx, img, TEX_W, TEX_H)
  const shade = ctx.createLinearGradient(0, TEX_H * 0.55, 0, TEX_H)
  shade.addColorStop(0, 'rgba(8, 10, 14, 0)')
  shade.addColorStop(1, 'rgba(8, 10, 14, 0.72)')
  ctx.fillStyle = shade
  ctx.fillRect(0, TEX_H * 0.55, TEX_W, TEX_H * 0.45)
  ctx.restore()

  roundedRectClip(ctx, TEX_W, TEX_H, TEX_R)
  ctx.strokeStyle = 'rgba(47, 230, 163, 0.5)'
  ctx.lineWidth = 3
  ctx.stroke()

  return toTexture(canvas)
}

/**
 * Draggable, flippable member ID badge hanging from a lanyard. A teal point
 * light tracks the cursor so the badge lights up as the mouse approaches;
 * dragging stretches it away (and swings the strap) on a spring that snaps
 * back with an elastic wobble on release. A quick click (as opposed to a
 * drag) flips it to show the photo at full strength. Falls back to a plain
 * <img> when WebGL is unavailable.
 */
export const Logo3DCard: FC<Logo3DCardProps> = ({ logoSrc, photoSrc, alt = '', photoAlt = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [webglFailed, setWebglFailed] = useState(() => {
    try {
      const probe = document.createElement('canvas')
      return !(probe.getContext('webgl2') ?? probe.getContext('webgl'))
    } catch {
      return true
    }
  })
  const reduce = useReducedMotion()

  useEffect(() => {
    const container = containerRef.current
    if (!container || webglFailed) return

    let renderer: THREE.WebGLRenderer
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    } catch {
      queueMicrotask(() => setWebglFailed(true))
      return
    }
    renderer.setClearColor(0x000000, 0)
    renderer.domElement.style.display = 'block'
    container.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 50)

    const card = new THREE.Group()
    scene.add(card)

    // Rotates independently of `card`'s position/tilt so the flip spins the
    // card face without disturbing its drag position or cursor-tilt.
    const flipGroup = new THREE.Group()
    card.add(flipGroup)

    const bodyGeometry = new THREE.ExtrudeGeometry(roundedRectShape(CARD_W, CARD_H, CARD_R), {
      depth: CARD_DEPTH,
      bevelEnabled: true,
      bevelThickness: 0.02,
      bevelSize: 0.02,
      bevelSegments: 3,
      curveSegments: 16,
    })
    bodyGeometry.translate(0, 0, -CARD_DEPTH / 2)
    const bodyMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x10141a,
      metalness: 0.6,
      roughness: 0.35,
      clearcoat: 1,
      clearcoatRoughness: 0.25,
    })
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial)
    flipGroup.add(body)

    const faceGeometry = new THREE.PlaneGeometry(CARD_W, CARD_H)
    const frontMaterial = new THREE.MeshPhysicalMaterial({
      transparent: true,
      metalness: 0.3,
      roughness: 0.42,
      clearcoat: 0.8,
      clearcoatRoughness: 0.3,
      emissive: 0xffffff,
      emissiveIntensity: 0.55,
    })
    const frontFace = new THREE.Mesh(faceGeometry, frontMaterial)
    frontFace.position.z = CARD_DEPTH / 2 + 0.021
    frontFace.visible = false
    flipGroup.add(frontFace)

    // Pre-rotated 180° so once `flipGroup` itself turns 180° the texture
    // reads right-side-up instead of mirrored.
    const backGeometry = new THREE.PlaneGeometry(CARD_W, CARD_H)
    const backMaterial = new THREE.MeshPhysicalMaterial({
      transparent: true,
      metalness: 0.2,
      roughness: 0.5,
      clearcoat: 0.6,
      clearcoatRoughness: 0.35,
      emissive: 0xffffff,
      emissiveIntensity: 0.5,
    })
    const backFace = new THREE.Mesh(backGeometry, backMaterial)
    backFace.position.z = -(CARD_DEPTH / 2 + 0.021)
    backFace.rotation.y = Math.PI
    backFace.visible = false
    flipGroup.add(backFace)

    // Lanyard: a fixed ring near the top of the frame, a strap ribbon that
    // follows the card's drag/tilt down to a clip at the card's top edge.
    const anchorPoint = new THREE.Vector3(0, ANCHOR_Y, 0)
    const ringGeometry = new THREE.TorusGeometry(0.14, 0.035, 8, 20)
    const ringMaterial = new THREE.MeshStandardMaterial({
      color: 0x0d1a15,
      metalness: 0.8,
      roughness: 0.3,
      emissive: 0x2fe6a3,
      emissiveIntensity: 0.3,
    })
    const ring = new THREE.Mesh(ringGeometry, ringMaterial)
    ring.position.copy(anchorPoint)
    ring.rotation.x = Math.PI / 2
    scene.add(ring)

    const clipGeometry = new THREE.BoxGeometry(0.34, 0.16, 0.08)
    const clipMaterial = new THREE.MeshStandardMaterial({
      color: 0x0d1a15,
      metalness: 0.75,
      roughness: 0.32,
      emissive: 0x2fe6a3,
      emissiveIntensity: 0.2,
    })
    const clip = new THREE.Mesh(clipGeometry, clipMaterial)
    scene.add(clip)

    const strapGeometry = new THREE.BufferGeometry()
    const strapPositions = new Float32Array((STRAP_SEGMENTS + 1) * 2 * 3)
    strapGeometry.setAttribute('position', new THREE.BufferAttribute(strapPositions, 3))
    const strapIndices: number[] = []
    for (let i = 0; i < STRAP_SEGMENTS; i++) {
      const a = i * 2
      const b = i * 2 + 1
      const c = (i + 1) * 2
      const d = (i + 1) * 2 + 1
      strapIndices.push(a, b, c, b, d, c)
    }
    strapGeometry.setIndex(strapIndices)
    const strapMaterial = new THREE.MeshBasicMaterial({
      color: 0x2fe6a3,
      transparent: true,
      opacity: 0.85,
      side: THREE.DoubleSide,
    })
    const strap = new THREE.Mesh(strapGeometry, strapMaterial)
    scene.add(strap)

    const strapCurveStart = new THREE.Vector3()
    const strapCurveMid = new THREE.Vector3()
    const strapCurveEnd = new THREE.Vector3()
    const strapCurve = new THREE.QuadraticBezierCurve3(
      strapCurveStart,
      strapCurveMid,
      strapCurveEnd,
    )
    const strapPosAttr = strapGeometry.attributes.position as THREE.BufferAttribute
    const updateStrap = (attachPoint: THREE.Vector3) => {
      strapCurveStart.copy(anchorPoint)
      strapCurveEnd.copy(attachPoint)
      strapCurveMid.copy(anchorPoint).add(attachPoint).multiplyScalar(0.5)
      strapCurveMid.x += (attachPoint.x - anchorPoint.x) * 0.15
      const pts = strapCurve.getPoints(STRAP_SEGMENTS)
      for (let i = 0; i <= STRAP_SEGMENTS; i++) {
        const p = pts[i]
        strapPosAttr.setXYZ(i * 2, p.x - STRAP_WIDTH / 2, p.y, p.z)
        strapPosAttr.setXYZ(i * 2 + 1, p.x + STRAP_WIDTH / 2, p.y, p.z)
      }
      strapPosAttr.needsUpdate = true
    }

    let disposed = false
    let frontTexture: THREE.CanvasTexture | null = null
    let backTexture: THREE.CanvasTexture | null = null
    buildBadgeFrontTexture(logoSrc, photoSrc)
      .then((texture) => {
        if (disposed) return texture.dispose()
        frontTexture = texture
        frontMaterial.map = texture
        frontMaterial.emissiveMap = texture
        frontMaterial.needsUpdate = true
        frontFace.visible = true
      })
      .catch(() => {
        // Card still renders without the printed face
      })
    buildPhotoBackTexture(photoSrc)
      .then((texture) => {
        if (disposed) return texture.dispose()
        backTexture = texture
        backMaterial.map = texture
        backMaterial.emissiveMap = texture
        backMaterial.needsUpdate = true
        backFace.visible = true
      })
      .catch(() => {
        // Back stays blank if the photo fails to load
      })

    scene.add(new THREE.AmbientLight(0xffffff, 0.6))
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.6)
    keyLight.position.set(2, 3, 4)
    scene.add(keyLight)
    const cursorLight = new THREE.PointLight(0x2fe6a3, 0, 12, 1.6)
    cursorLight.position.set(0, 0, 1.4)
    scene.add(cursorLight)

    /* ---- Interaction state ---- */
    const raycaster = new THREE.Raycaster()
    const dragPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0)
    const lightPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), -1.4)
    const hitPoint = new THREE.Vector3()
    const ndc = new THREE.Vector2()
    const cardTopWorld = new THREE.Vector3()

    const position = new THREE.Vector2()
    const velocity = new THREE.Vector2()
    const dragTarget = new THREE.Vector2()
    const grabOffset = new THREE.Vector2()
    let dragging = false
    let hovering = false
    let proximity = 0 // 0..1, how close the cursor is to the card
    let pointerSeen = false
    let rotX = 0
    let rotY = 0
    let scale = 1
    let visible = true
    let flipped = false
    let flipAngle = 0
    let flipVel = 0
    let dragStartX = 0
    let dragStartY = 0
    let dragStartTime = 0
    let dragMoved = false

    const toNdc = (clientX: number, clientY: number) => {
      const rect = container.getBoundingClientRect()
      ndc.set(
        ((clientX - rect.left) / rect.width) * 2 - 1,
        -((clientY - rect.top) / rect.height) * 2 + 1,
      )
      return rect
    }

    const pointerToPlane = (plane: THREE.Plane): THREE.Vector3 | null => {
      raycaster.setFromCamera(ndc, camera)
      return raycaster.ray.intersectPlane(plane, hitPoint)
    }

    // The canvas is pointer-events: none, so all input arrives via window
    // listeners — the highlight also ramps up while the cursor is outside.
    const setCursor = (cursor: string) => {
      document.body.style.cursor = cursor
    }

    const onWindowMove = (e: PointerEvent) => {
      const rect = toNdc(e.clientX, e.clientY)
      pointerSeen = true
      const dx = e.clientX - (rect.left + rect.width / 2)
      const dy = e.clientY - (rect.top + rect.height / 2)
      proximity = clamp(1 - Math.hypot(dx, dy) / (rect.width * 1.1), 0, 1)

      if (dragging) {
        if (Math.hypot(e.clientX - dragStartX, e.clientY - dragStartY) > CLICK_MOVE_THRESHOLD) {
          dragMoved = true
        }
        const world = pointerToPlane(dragPlane)
        if (world) {
          dragTarget.set(world.x - grabOffset.x, world.y - grabOffset.y)
          // Rubber-band: pulls past the limit compress progressively
          const len = dragTarget.length()
          if (len > DRAG_LIMIT) {
            dragTarget.multiplyScalar(
              Math.min(DRAG_LIMIT + (len - DRAG_LIMIT) * 0.22, DRAG_HARD_LIMIT) / len,
            )
          }
        }
      } else {
        raycaster.setFromCamera(ndc, camera)
        hovering = raycaster.intersectObject(body).length > 0
        setCursor(hovering ? 'grab' : '')
      }
    }

    const onPointerDown = (e: PointerEvent) => {
      toNdc(e.clientX, e.clientY)
      raycaster.setFromCamera(ndc, camera)
      if (raycaster.intersectObject(body).length === 0) return
      const world = pointerToPlane(dragPlane)
      if (!world) return
      dragging = true
      dragMoved = false
      dragStartX = e.clientX
      dragStartY = e.clientY
      dragStartTime = performance.now()
      grabOffset.set(world.x - position.x, world.y - position.y)
      dragTarget.copy(position)
      setCursor('grabbing')
      e.preventDefault()
    }

    const onPointerUp = () => {
      if (!dragging) return
      dragging = false
      if (!dragMoved && performance.now() - dragStartTime < CLICK_TIME_THRESHOLD) {
        flipped = !flipped
      }
      setCursor(hovering ? 'grab' : '')
    }

    window.addEventListener('pointermove', onWindowMove)
    window.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('pointerup', onPointerUp)
    window.addEventListener('pointercancel', onPointerUp)

    /* ---- Sizing ---- */
    const resize = () => {
      const w = container.clientWidth
      const h = container.clientHeight
      if (w === 0 || h === 0) return
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      renderer.setSize(w, h)
      camera.aspect = w / h
      // "Contain" fit: back off far enough that both the card's width and
      // the full card+strap height stay inside the frame.
      const vFov = (camera.fov * Math.PI) / 180
      const distForHeight = TOTAL_H / 2 / Math.tan(vFov / 2)
      const distForWidth = CARD_W / 2 / (Math.tan(vFov / 2) * camera.aspect)
      camera.position.z = OVERSCAN * Math.max(7.2, distForHeight, distForWidth)
      camera.updateProjectionMatrix()
    }
    resize()
    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(container)

    const intersectionObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
    })
    intersectionObserver.observe(container)

    /* ---- Animation loop ---- */
    let raf = 0
    let last = performance.now()
    let t = 0

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick)
      const dt = Math.min((now - last) / 1000, 1 / 30)
      last = now
      if (!visible) return
      t += dt

      // Elastic spring: stretchy follow while dragging, bouncy return after
      const targetX = dragging ? dragTarget.x : 0
      const targetY = dragging ? dragTarget.y : 0
      const stiffness = dragging ? 90 : 42
      const damping = dragging ? 13 : reduce ? 14 : 5.5
      velocity.x += (stiffness * (targetX - position.x) - damping * velocity.x) * dt
      velocity.y += (stiffness * (targetY - position.y) - damping * velocity.y) * dt
      position.x += velocity.x * dt
      position.y += velocity.y * dt

      const idle = reduce ? 0 : 1
      card.position.set(position.x, REST_Y + position.y + idle * Math.sin(t * 1.1) * 0.05, 0)

      let targetRotX: number
      let targetRotY: number
      if (dragging) {
        targetRotY = clamp(velocity.x * 0.05, -0.5, 0.5)
        targetRotX = clamp(-velocity.y * 0.05, -0.5, 0.5)
      } else if (!reduce && pointerSeen) {
        // Tilt toward the cursor, weighted by proximity
        targetRotY = clamp(ndc.x, -1.2, 1.2) * 0.3 * proximity + idle * Math.sin(t * 0.5) * 0.06
        targetRotX = clamp(-ndc.y, -1.2, 1.2) * 0.24 * proximity
      } else {
        targetRotY = idle * Math.sin(t * 0.5) * 0.06
        targetRotX = 0
      }
      rotX += (targetRotX - rotX) * Math.min(1, dt * 7)
      rotY += (targetRotY - rotY) * Math.min(1, dt * 7)
      card.rotation.set(rotX, rotY, idle * Math.sin(t * 0.8) * 0.015)

      const targetScale = dragging ? 1.05 : hovering ? 1.03 : 1
      scale += (targetScale - scale) * Math.min(1, dt * 8)
      card.scale.setScalar(scale)

      // Flip spring: click toggles target 0 / PI, slight overshoot for a snap feel
      const flipTarget = flipped ? Math.PI : 0
      const flipStiffness = 46
      const flipDamping = reduce ? 20 : 7.5
      flipVel += (flipStiffness * (flipTarget - flipAngle) - flipDamping * flipVel) * dt
      flipAngle += flipVel * dt
      flipGroup.rotation.y = flipAngle

      // Lanyard: strap + clip follow the card's actual top-edge world point
      cardTopWorld.set(0, CARD_H / 2, 0)
      card.localToWorld(cardTopWorld)
      updateStrap(cardTopWorld)
      clip.position.copy(cardTopWorld)
      clip.quaternion.copy(card.quaternion)

      // Cursor-tracking highlight
      const lightWorld = pointerSeen ? pointerToPlane(lightPlane) : null
      if (lightWorld) cursorLight.position.lerp(lightWorld, Math.min(1, dt * 10))
      const targetIntensity = proximity * proximity * 14 * (dragging ? 1.4 : 1)
      cursorLight.intensity += (targetIntensity - cursorLight.intensity) * Math.min(1, dt * 10)

      renderer.render(scene, camera)
    }
    raf = requestAnimationFrame(tick)

    return () => {
      disposed = true
      cancelAnimationFrame(raf)
      resizeObserver.disconnect()
      intersectionObserver.disconnect()
      setCursor('')
      window.removeEventListener('pointermove', onWindowMove)
      window.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('pointerup', onPointerUp)
      window.removeEventListener('pointercancel', onPointerUp)
      bodyGeometry.dispose()
      faceGeometry.dispose()
      backGeometry.dispose()
      strapGeometry.dispose()
      ringGeometry.dispose()
      clipGeometry.dispose()
      bodyMaterial.dispose()
      frontMaterial.dispose()
      backMaterial.dispose()
      strapMaterial.dispose()
      ringMaterial.dispose()
      clipMaterial.dispose()
      frontTexture?.dispose()
      backTexture?.dispose()
      renderer.dispose()
      container.removeChild(renderer.domElement)
    }
  }, [logoSrc, photoSrc, reduce, webglFailed])

  if (webglFailed) {
    return (
      <img
        src={photoSrc}
        alt={photoAlt || alt}
        style={{
          width: '100%',
          maxWidth: 420,
          margin: '0 auto',
          display: 'block',
          borderRadius: 16,
          border: '1px solid rgba(var(--teal-rgb), 0.4)',
          boxShadow: '0 0 36px rgba(var(--teal-rgb), 0.25)',
        }}
      />
    )
  }

  const overhang = `${((OVERSCAN - 1) / 2) * -100}%`
  return (
    <div
      role="img"
      aria-label={`${alt}${photoAlt ? ` — click to flip and reveal ${photoAlt}` : ''}`}
      style={{ position: 'relative', width: '100%', height: '100%' }}
    >
      <div
        ref={containerRef}
        style={{ position: 'absolute', inset: overhang, pointerEvents: 'none' }}
      />
    </div>
  )
}
