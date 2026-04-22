import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { FLASH } from '../utils/timing'

/**
 * Drives a fullscreen flash overlay at section boundaries.
 * Triggers a hard-cut black flash (and occasionally a white/invert flash)
 * every `interval` seconds.
 */
export function useFlashSequence(interval = 8, whiteEvery = 3) {
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = overlayRef.current
    if (!el) return

    let counter = 0
    const tl = gsap.timeline({ repeat: -1 })

    tl.to({}, { duration: interval })
      .call(() => {
        counter++
        const fireWhite = counter % whiteEvery === 0
        const q = gsap.timeline()
        // Noise dropout window (visual handled by postprocessing glitch)
        q.to({}, { duration: FLASH.noise })
        // Black flash
        q.set(el, { backgroundColor: '#000', opacity: 1 })
        q.to({}, { duration: FLASH.black })
        if (fireWhite) {
          q.set(el, { backgroundColor: '#FFF' })
          q.to({}, { duration: FLASH.white })
          q.set(el, { backgroundColor: '#000' })
          q.to({}, { duration: FLASH.black })
        }
        q.set(el, { opacity: 0 })
      })

    return () => {
      tl.kill()
    }
  }, [interval, whiteEvery])

  return overlayRef
}
