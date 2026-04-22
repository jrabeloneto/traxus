import { useEffect } from 'react'

/**
 * Lightweight scroll-scrubbed parallax.
 *
 * Applies a translateY to the ref based on window scrollY * speed,
 * relative to the element's initial layout position. No GSAP needed.
 *
 * speed:   0 = static, 0.3 = drifts down when scrolling down, -0.3 = drifts up.
 */
export function useScrollParallax(
  ref: React.RefObject<HTMLElement | null>,
  speed: number = 0.2
) {
  useEffect(() => {
    const el = ref.current
    if (!el) return

    let raf = 0
    let baseTop = el.getBoundingClientRect().top + window.scrollY

    const onResize = () => {
      baseTop = el.getBoundingClientRect().top + window.scrollY
    }

    const apply = () => {
      const delta = (window.scrollY - baseTop) * speed
      el.style.transform = `translate3d(0, ${delta.toFixed(1)}px, 0)`
      raf = 0
    }

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(apply)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize)
    apply()

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [ref, speed])
}
