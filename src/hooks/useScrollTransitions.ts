import { useEffect } from 'react'
import gsap from 'gsap'
import { FLASH } from '../utils/timing'
import { fireChapter } from '../components/ui/ChapterMarker'

/**
 * Page-swap transition controller.
 *
 * In paginated mode, listens to `traxus:page-change` events dispatched by
 * PageStack and plays the full cut sequence:
 *
 *   1. Transition-specific cut (black / white-invert / diagonal-wipe / noise-cascade / stripe-sweep)
 *   2. Page-swap slab (via traxus:page-swap — picked up by <PageSwap />)
 *   3. ChapterMarker flash (via traxus:chapter — picked up by <ChapterMarker />)
 */

type TransitionKind =
  | 'black'
  | 'white-invert'
  | 'diagonal-wipe'
  | 'noise-cascade'
  | 'stripe-sweep'
  | 'hard-cut'

type ChapterMeta = {
  index: number
  label: string
  tone: 'amber' | 'cyan' | 'white'
  transition: TransitionKind
}

const CHAPTER_BY_ID: Record<string, ChapterMeta> = {
  hero:      { index: 1,  label: 'ARC // SPECTER ONE',   tone: 'amber', transition: 'hard-cut' },
  manifesto: { index: 2,  label: 'DOCTRINE',             tone: 'white', transition: 'white-invert' },
  construct: { index: 3,  label: 'OBJECT CONSTRUCTION',  tone: 'cyan',  transition: 'noise-cascade' },
  identity:  { index: 4,  label: 'IDENTITY / SIGNAL',    tone: 'white', transition: 'white-invert' },
  specs:     { index: 5,  label: 'DATA // SPECS',        tone: 'amber', transition: 'diagonal-wipe' },
  terminal:  { index: 6,  label: 'COMMAND INTERFACE',    tone: 'cyan',  transition: 'stripe-sweep' },
  sectors:   { index: 7,  label: 'SECTOR GRID',          tone: 'amber', transition: 'diagonal-wipe' },
  log:       { index: 8,  label: 'LIVE TELEMETRY',       tone: 'cyan',  transition: 'noise-cascade' },
  contact:   { index: 9,  label: 'ESTABLISH CONTACT',    tone: 'amber', transition: 'stripe-sweep' },
  end:       { index: 10, label: 'END TRANSMISSION',     tone: 'white', transition: 'white-invert' },
}

export function useScrollTransitions(booted: boolean) {
  useEffect(() => {
    if (!booted) return

    const flashOverlay = document.querySelector<HTMLElement>('.flash-overlay')
    if (!flashOverlay) return

    function onPageChange(ev: Event) {
      const d = (ev as CustomEvent).detail as { toId: string; toIdx: number; direction: 'forward' | 'backward' }
      const meta = CHAPTER_BY_ID[d.toId] ?? {
        index: d.toIdx + 1, label: d.toId.toUpperCase(), tone: 'amber', transition: 'black',
      }

      // Going backward feels snappier with a simple noise cascade
      const kind: TransitionKind = d.direction === 'backward' ? 'noise-cascade' : meta.transition
      fireTransition(flashOverlay!, kind)

      // Page-swap slab — fires immediately
      window.dispatchEvent(new CustomEvent('traxus:page-swap', {
        detail: { id: d.toId, label: meta.label, index: meta.index },
      }))

      // Chapter marker — after slab starts
      setTimeout(() => {
        fireChapter({ index: meta.index, label: meta.label, tone: meta.tone })
      }, 260)
    }

    window.addEventListener('traxus:page-change', onPageChange as EventListener)
    return () => window.removeEventListener('traxus:page-change', onPageChange as EventListener)
  }, [booted])
}

// ── transitions ────────────────────────────────────────────

function fireTransition(overlay: HTMLElement, kind: TransitionKind) {
  const tl = gsap.timeline()

  switch (kind) {
    case 'hard-cut': {
      tl.set(overlay, { opacity: 1, backgroundColor: '#000' })
      tl.to({}, { duration: 0.06 })
      tl.set(overlay, { opacity: 0 })
      return
    }
    case 'black': {
      tl.to({}, { duration: FLASH.noise })
      tl.set(overlay, { opacity: 1, backgroundColor: '#000' })
      tl.to({}, { duration: FLASH.black })
      tl.set(overlay, { opacity: 0 })
      return
    }
    case 'white-invert': {
      tl.to({}, { duration: FLASH.noise })
      tl.set(overlay, { opacity: 1, backgroundColor: '#000' })
      tl.to({}, { duration: FLASH.black })
      tl.set(overlay, { backgroundColor: '#FFFFFF' })
      tl.to({}, { duration: FLASH.white })
      tl.set(overlay, { backgroundColor: '#000' })
      tl.to({}, { duration: FLASH.black })
      tl.set(overlay, { opacity: 0 })
      return
    }
    case 'diagonal-wipe': {
      document.body.classList.add('transition-diagonal')
      setTimeout(() => document.body.classList.remove('transition-diagonal'), 180)
      tl.to({}, { duration: 0.14 })
      tl.set(overlay, { opacity: 1, backgroundColor: '#000' })
      tl.to({}, { duration: 0.035 })
      tl.set(overlay, { opacity: 0 })
      return
    }
    case 'noise-cascade': {
      for (let i = 0; i < 3; i++) {
        tl.set(overlay, { opacity: 0.28, backgroundColor: '#050505' })
        tl.to({}, { duration: 0.035 })
        tl.set(overlay, { opacity: 0 })
        tl.to({}, { duration: 0.04 })
      }
      return
    }
    case 'stripe-sweep': {
      document.body.classList.add('transition-stripes')
      setTimeout(() => document.body.classList.remove('transition-stripes'), 220)
      tl.to({}, { duration: 0.1 })
      tl.set(overlay, { opacity: 1, backgroundColor: '#000' })
      tl.to({}, { duration: 0.04 })
      tl.set(overlay, { opacity: 0 })
      return
    }
  }
}
