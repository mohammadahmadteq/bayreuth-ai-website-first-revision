import * as THREE from 'three'
import { CARD_WIDTH, TOTAL_HEIGHT, OVERSCAN } from './constants'
import { createBadgeScene } from './scene'
import { createBadgeMotion } from './motion'

interface BadgeOptions {
  logoSrc: string
  photoSrc: string
  reduceMotion: boolean
  onRendererError: () => void
}

export function mountBadge(container: HTMLDivElement, options: BadgeOptions) {
  let renderer: THREE.WebGLRenderer
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  } catch {
    options.onRendererError()
    return
  }
  renderer.setClearColor(0x000000, 0)
  renderer.domElement.style.display = 'block'
  container.appendChild(renderer.domElement)

  const badge = createBadgeScene(options.logoSrc, options.photoSrc)
  const { scene, camera } = badge
  const motion = createBadgeMotion(container, badge, options.reduceMotion)
  let visible = true
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
    const distForHeight = TOTAL_HEIGHT / 2 / Math.tan(vFov / 2)
    const distForWidth = CARD_WIDTH / 2 / (Math.tan(vFov / 2) * camera.aspect)
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

  let frame = 0
  let lastFrame = performance.now()
  const tick = (now: number) => {
    frame = requestAnimationFrame(tick)
    const delta = Math.min((now - lastFrame) / 1000, 1 / 30)
    lastFrame = now
    if (!visible) return
    motion.update(delta)
    renderer.render(scene, camera)
  }
  frame = requestAnimationFrame(tick)

  return () => {
    cancelAnimationFrame(frame)
    resizeObserver.disconnect()
    intersectionObserver.disconnect()
    motion.dispose()
    badge.dispose()
    renderer.dispose()
    renderer.domElement.remove()
  }
}
