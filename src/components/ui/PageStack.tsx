import { useEffect, useRef, useState, type ReactElement } from 'react'

/**
 * PageStack — paginated sections container.
 *
 * Accepts sections as children (each must have a unique `id` prop matching
 * its data-section id). Only ONE is visible at a time. Wheel / arrow-keys /
 * sidenav events advance pages via hard cuts, not scroll.
 *
 * Events it dispatches:
 *   traxus:page-change   — { fromId, toId, fromIdx, toIdx, direction }
 *   traxus:section-active    — { id }   (fires AFTER content swap)
 *   traxus:section-inactive  — { id }   (fires BEFORE swap)
 *   traxus:section-exit      — { id }   (fires BEFORE swap, same as inactive)
 *
 * Events it listens to:
 *   traxus:goto          — { idx } or { id }
 */

export type Page = { id: string; el: ReactElement }

const COOLDOWN = 900        // ms between allowed transitions
const SWAP_DELAY = 280      // ms between exit events and content swap (gives transition time)
const WHEEL_THRESHOLD = 35  // cumulative |deltaY| before a page turn

export function PageStack({ pages, initialIdx = 0 }: { pages: Page[]; initialIdx?: number }) {
  const ids = pages.map(p => p.id)

  const [idx, setIdx] = useState(initialIdx)
  const idxRef = useRef(idx)
  idxRef.current = idx
  const lastTransitionRef = useRef(0)
  const wheelAccumRef = useRef(0)

  // On mount: read URL hash → pick initial page, fire section-active so Hero animates in
  useEffect(() => {
    const hash = window.location.hash.replace('#', '')
    const hashIdx = hash ? ids.indexOf(hash) : -1
    const startIdx = hashIdx >= 0 ? hashIdx : initialIdx
    if (startIdx !== idxRef.current) {
      setIdx(startIdx)
      idxRef.current = startIdx
    }
    const id = ids[startIdx]
    if (!id) return
    const t = setTimeout(() => {
      window.dispatchEvent(new CustomEvent('traxus:section-active', { detail: { id } }))
    }, 50)

    // Respond to browser back/forward
    function onHash() {
      const h = window.location.hash.replace('#', '')
      const i = ids.indexOf(h)
      if (i >= 0 && i !== idxRef.current) goTo(i)
    }
    window.addEventListener('hashchange', onHash)
    return () => {
      clearTimeout(t)
      window.removeEventListener('hashchange', onHash)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function goTo(target: number, direction: 'forward' | 'backward' | 'jump' = 'jump') {
    const cur = idxRef.current
    if (target === cur) return
    if (target < 0 || target >= ids.length) return
    const now = Date.now()
    if (now - lastTransitionRef.current < COOLDOWN) return
    lastTransitionRef.current = now

    const fromId = ids[cur]
    const toId = ids[target]
    const dir = direction === 'jump' ? (target > cur ? 'forward' : 'backward') : direction

    // ── Phase 1: dispatch exit / inactive (listeners play transitions) ──
    window.dispatchEvent(new CustomEvent('traxus:page-change', {
      detail: { fromId, toId, fromIdx: cur, toIdx: target, direction: dir },
    }))
    window.dispatchEvent(new CustomEvent('traxus:section-exit', { detail: { id: fromId } }))
    window.dispatchEvent(new CustomEvent('traxus:section-inactive', { detail: { id: fromId } }))

    // ── Phase 2: swap content after transition delay ──
    setTimeout(() => {
      setIdx(target)
      // Sync URL hash without triggering hashchange loop
      try {
        if (window.location.hash !== `#${toId}`) {
          history.replaceState(null, '', `#${toId}`)
        }
      } catch { /* hash sync is best-effort */ }
      // Fire activate one more tick after DOM swap so entry animations see the visible state
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('traxus:section-active', { detail: { id: toId } }))
      }, 40)
    }, SWAP_DELAY)
  }

  function next() { goTo(idxRef.current + 1, 'forward') }
  function prev() { goTo(idxRef.current - 1, 'backward') }

  // ── Wheel handler ─────────────────────────────────────────
  useEffect(() => {
    function isInScrollLock(target: EventTarget | null): boolean {
      if (!(target instanceof Element)) return false
      const lock = target.closest('[data-scroll-lock]') as HTMLElement | null
      if (!lock) return false
      // Only respect the lock if there's actually something to scroll
      if (lock.scrollHeight <= lock.clientHeight + 1) return false
      return true
    }

    function onWheel(e: WheelEvent) {
      if (isInScrollLock(e.target)) return
      const now = Date.now()
      if (now - lastTransitionRef.current < COOLDOWN) {
        wheelAccumRef.current = 0
        return
      }
      wheelAccumRef.current += e.deltaY
      if (wheelAccumRef.current > WHEEL_THRESHOLD) {
        wheelAccumRef.current = 0
        next()
      } else if (wheelAccumRef.current < -WHEEL_THRESHOLD) {
        wheelAccumRef.current = 0
        prev()
      }
    }

    function onKey(e: KeyboardEvent) {
      // Let input fields type normally
      const t = e.target as HTMLElement
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA')) return
      if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') { e.preventDefault(); next() }
      else if (e.key === 'ArrowUp' || e.key === 'PageUp') { e.preventDefault(); prev() }
      else if (e.key === 'Home') { e.preventDefault(); goTo(0) }
      else if (e.key === 'End')  { e.preventDefault(); goTo(ids.length - 1) }
    }

    let touchStartY = 0
    function onTouchStart(e: TouchEvent) { touchStartY = e.touches[0]?.clientY ?? 0 }
    function onTouchEnd(e: TouchEvent) {
      if (isInScrollLock(e.target)) return
      const dy = (e.changedTouches[0]?.clientY ?? 0) - touchStartY
      if (Math.abs(dy) < 60) return
      if (dy < 0) next()
      else prev()
    }

    function onGoto(ev: Event) {
      const d = (ev as CustomEvent).detail as { idx?: number; id?: string }
      if (typeof d.idx === 'number') goTo(d.idx)
      else if (d.id) {
        const i = ids.indexOf(d.id)
        if (i >= 0) goTo(i)
      }
    }

    window.addEventListener('wheel', onWheel, { passive: true })
    window.addEventListener('keydown', onKey)
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchend', onTouchEnd, { passive: true })
    window.addEventListener('traxus:goto', onGoto as EventListener)
    return () => {
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchend', onTouchEnd)
      window.removeEventListener('traxus:goto', onGoto as EventListener)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="page-stack">
      {pages.map((page, i) => (
        <div key={page.id} data-section-wrapper data-active={i === idx ? 'true' : 'false'}>
          {page.el}
        </div>
      ))}
    </div>
  )
}
