import { useEffect, useRef } from 'react'
import gsap from 'gsap'

/**
 * Paginated-mode entry animation.
 *
 * Listens on the window for:
 *   traxus:section-active   — { id }   → runs stagger entry on [data-entry] children
 *   traxus:section-inactive — { id }   → resets opacity (re-arms for next activation)
 *
 * The section id comes from the element's `id` attribute.
 * `flashBefore` is ignored in page-swap mode — PageStack triggers its own cut.
 */
export function useScrollEntry(options?: {
  flashBefore?: boolean
  staggerMs?: number
  threshold?: number // unused in paginated mode, kept for API compat
}) {
  const sectionRef = useRef<HTMLElement>(null)
  const tlRef = useRef<gsap.core.Timeline | null>(null)

  const { staggerMs = 75 } = options ?? {}

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return

    const id = el.id
    if (!id) return

    const entryEls = Array.from(el.querySelectorAll<HTMLElement>('[data-entry]'))

    // Start hidden
    entryEls.forEach(child => { child.style.opacity = '0' })

    function runEntry() {
      tlRef.current?.kill()
      const tl = gsap.timeline()
      tlRef.current = tl
      // Small initial delay so the PageStack cut has time to land
      let t = 0.04
      entryEls.forEach((child) => {
        tl.set(child, { opacity: 1 }, t)
        t += staggerMs / 1000
      })
    }

    function resetEntry() {
      tlRef.current?.kill()
      entryEls.forEach(child => { child.style.opacity = '0' })
    }

    function onActive(e: Event) {
      const d = (e as CustomEvent).detail as { id: string }
      if (d.id === id) runEntry()
    }
    function onInactive(e: Event) {
      const d = (e as CustomEvent).detail as { id: string }
      if (d.id === id) resetEntry()
    }

    window.addEventListener('traxus:section-active', onActive as EventListener)
    window.addEventListener('traxus:section-inactive', onInactive as EventListener)

    return () => {
      window.removeEventListener('traxus:section-active', onActive as EventListener)
      window.removeEventListener('traxus:section-inactive', onInactive as EventListener)
      tlRef.current?.kill()
      entryEls.forEach(child => { child.style.opacity = '' })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return sectionRef
}
