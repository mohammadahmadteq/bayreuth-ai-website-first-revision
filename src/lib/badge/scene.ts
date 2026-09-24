import * as THREE from 'three'
import { CARD_WIDTH, CARD_HEIGHT, CARD_RADIUS, CARD_DEPTH } from './constants'
import { createLanyard } from './lanyard'
import { buildBadgeFrontTexture, buildPhotoBackTexture } from './textures'

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

export type BadgeScene = ReturnType<typeof createBadgeScene>

export function createBadgeScene(logoSrc: string, photoSrc: string) {
  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 50)

  const card = new THREE.Group()
  scene.add(card)

  // Rotates independently of `card`'s position/tilt so the flip spins the
  // card face without disturbing its drag position or cursor-tilt.
  const flipGroup = new THREE.Group()
  card.add(flipGroup)

  const bodyGeometry = new THREE.ExtrudeGeometry(
    roundedRectShape(CARD_WIDTH, CARD_HEIGHT, CARD_RADIUS),
    {
      depth: CARD_DEPTH,
      bevelEnabled: true,
      bevelThickness: 0.02,
      bevelSize: 0.02,
      bevelSegments: 3,
      curveSegments: 16,
    },
  )
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

  const faceGeometry = new THREE.PlaneGeometry(CARD_WIDTH, CARD_HEIGHT)
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
  const backGeometry = new THREE.PlaneGeometry(CARD_WIDTH, CARD_HEIGHT)
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

  const { clip, updateStrap, dispose: disposeLanyard } = createLanyard(scene)

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

  return {
    scene,
    camera,
    card,
    body,
    flipGroup,
    clip,
    updateStrap,
    cursorLight,
    dispose() {
      disposed = true
      disposeLanyard()
      bodyGeometry.dispose()
      faceGeometry.dispose()
      backGeometry.dispose()
      bodyMaterial.dispose()
      frontMaterial.dispose()
      backMaterial.dispose()
      frontTexture?.dispose()
      backTexture?.dispose()
    },
  }
}
