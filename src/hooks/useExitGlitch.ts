import { useEffect } from 'react'

/**
 * When a `traxus:section-exit` event fires for the matching section id,
 * add the `glitch-exit` class to every [data-glitch] child of `ref`
 * for ~180ms, then remove it — CSS handles the animation.
 */
export function useExitGlitch(
  ref: React.RefObject<HTMLElement | null>,
  sectionId: string
) {
  useEffect(() => {
    function onExit(ev: Event) {
      const e = ev as CustomEvent<{ id: string }>
      if (e.detail.id !== sectionId) return
      const root = ref.current
      if (!root) return

      const targets = Array.from(root.querySelectorAll<HTMLElement>('[data-glitch]'))
      if (!targets.length) {
        // fallback — glitch the root itself
        root.classList.add('glitch-exit')
        setTimeout(() => root.classList.remove('glitch-exit'), 200)
        return
      }

      targets.forEach(t => {
        t.classList.remove('glitch-exit')
        // force reflow so animation re-triggers
        void t.offsetWidth
        t.classList.add('glitch-exit')
        setTimeout(() => t.classList.remove('glitch-exit'), 200)
      })
    }

    window.addEventListener('traxus:section-exit', onExit as EventListener)
    return () => window.removeEventListener('traxus:section-exit', onExit as EventListener)
  }, [ref, sectionId])
}
