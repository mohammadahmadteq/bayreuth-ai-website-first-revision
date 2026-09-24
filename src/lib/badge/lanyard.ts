import * as THREE from 'three'
import { ANCHOR_Y, STRAP_SEGMENTS, STRAP_WIDTH } from './constants'

export function createLanyard(scene: THREE.Scene) {
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
  const strapCurve = new THREE.QuadraticBezierCurve3(strapCurveStart, strapCurveMid, strapCurveEnd)
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

  return {
    clip,
    updateStrap,
    dispose() {
      ringGeometry.dispose()
      ringMaterial.dispose()
      clipGeometry.dispose()
      clipMaterial.dispose()
      strapGeometry.dispose()
      strapMaterial.dispose()
    },
  }
}
