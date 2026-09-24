import * as THREE from 'three'
import {
  CARD_HEIGHT,
  REST_Y,
  DRAG_LIMIT,
  DRAG_HARD_LIMIT,
  CLICK_MOVE_THRESHOLD_PX,
  CLICK_TIME_THRESHOLD_MS,
} from './constants'
import type { BadgeScene } from './scene'

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v))

export function createBadgeMotion(container: HTMLDivElement, badge: BadgeScene, reduce: boolean) {
  const { camera, card, body, flipGroup, clip, updateStrap, cursorLight } = badge
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
      if (Math.hypot(e.clientX - dragStartX, e.clientY - dragStartY) > CLICK_MOVE_THRESHOLD_PX) {
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
    if (!dragMoved && performance.now() - dragStartTime < CLICK_TIME_THRESHOLD_MS) {
      flipped = !flipped
    }
    setCursor(hovering ? 'grab' : '')
  }

  window.addEventListener('pointermove', onWindowMove)
  window.addEventListener('pointerdown', onPointerDown)
  window.addEventListener('pointerup', onPointerUp)
  window.addEventListener('pointercancel', onPointerUp)

  let elapsed = 0
  return {
    update(dt: number) {
      elapsed += dt
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
      card.position.set(position.x, REST_Y + position.y + idle * Math.sin(elapsed * 1.1) * 0.05, 0)

      let targetRotX: number
      let targetRotY: number
      if (dragging) {
        targetRotY = clamp(velocity.x * 0.05, -0.5, 0.5)
        targetRotX = clamp(-velocity.y * 0.05, -0.5, 0.5)
      } else if (!reduce && pointerSeen) {
        // Tilt toward the cursor, weighted by proximity
        targetRotY =
          clamp(ndc.x, -1.2, 1.2) * 0.3 * proximity + idle * Math.sin(elapsed * 0.5) * 0.06
        targetRotX = clamp(-ndc.y, -1.2, 1.2) * 0.24 * proximity
      } else {
        targetRotY = idle * Math.sin(elapsed * 0.5) * 0.06
        targetRotX = 0
      }
      rotX += (targetRotX - rotX) * Math.min(1, dt * 7)
      rotY += (targetRotY - rotY) * Math.min(1, dt * 7)
      card.rotation.set(rotX, rotY, idle * Math.sin(elapsed * 0.8) * 0.015)

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
      cardTopWorld.set(0, CARD_HEIGHT / 2, 0)
      card.localToWorld(cardTopWorld)
      updateStrap(cardTopWorld)
      clip.position.copy(cardTopWorld)
      clip.quaternion.copy(card.quaternion)

      // Cursor-tracking highlight
      const lightWorld = pointerSeen ? pointerToPlane(lightPlane) : null
      if (lightWorld) cursorLight.position.lerp(lightWorld, Math.min(1, dt * 10))
      const targetIntensity = proximity * proximity * 14 * (dragging ? 1.4 : 1)
      cursorLight.intensity += (targetIntensity - cursorLight.intensity) * Math.min(1, dt * 10)
    },
    dispose() {
      setCursor('')
      window.removeEventListener('pointermove', onWindowMove)
      window.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('pointerup', onPointerUp)
      window.removeEventListener('pointercancel', onPointerUp)
    },
  }
}
