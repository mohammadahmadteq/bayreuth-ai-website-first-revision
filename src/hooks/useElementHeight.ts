import { useCallback, useState, type RefCallback } from 'react'

/**
 * Tracks an element's content height in px. A callback ref rather than a ref object, so the
 * observer follows the element when a layout switch (such as the mobile breakpoint) remounts it.
 */
export function useElementHeight<T extends HTMLElement>(): [RefCallback<T>, number | undefined] {
  const [height, setHeight] = useState<number>()

  const ref = useCallback((el: T | null) => {
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
