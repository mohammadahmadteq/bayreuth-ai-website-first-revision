import { useLayoutEffect, useRef, useState, type RefObject } from 'react'

export function useElementHeight<T extends HTMLElement>(): [
  RefObject<T | null>,
  number | undefined,
] {
  const ref = useRef<T>(null)
  const [height, setHeight] = useState<number>()

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0]
      if (entry) setHeight(entry.contentRect.height)
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return [ref, height]
}
