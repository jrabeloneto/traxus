import { useEffect, useState } from 'react'

/**
 * First-time keyboard / scroll hint.
 *
 * Since the site is fully paginated (no smooth-scroll), users need a
 * one-time nudge about how to navigate. Appears 1.2s after boot completes,
 * lives for ~5s, then auto-dismisses. Also dismisses on first navigation event.
 */
export function InputHint() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const showTimer = setTimeout(() => setVisible(true), 1200)
    const hideTimer = setTimeout(() => setVisible(false), 6400)

    function dismiss() { setVisible(false) }
    window.addEventListener('traxus:page-change', dismiss)
    window.addEventListener('traxus:goto', dismiss)

    return () => {
      clearTimeout(showTimer)
      clearTimeout(hideTimer)
      window.removeEventListener('traxus:page-change', dismiss)
      window.removeEventListener('traxus:goto', dismiss)
    }
  }, [])

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        bottom: 44,
        right: 28,
        zIndex: 60,
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        fontFamily: 'var(--font-mono)',
        fontSize: 10,
        letterSpacing: '0.22em',
        textTransform: 'uppercase',
        color: 'var(--amber)',
        padding: '10px 14px',
        border: '1px solid var(--amber-border)',
        background: 'rgba(5,5,10,0.86)',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(6px)',
        transition: 'opacity 180ms step-end, transform 180ms step-end',
        pointerEvents: 'none',
      }}
    >
      <span style={{ color: 'var(--text-dim)' }}>▸ NAVIGATE</span>
      <kbd style={kbdStyle}>SCROLL</kbd>
      <span style={{ color: 'var(--text-dim)' }}>OR</span>
      <kbd style={kbdStyle}>↑</kbd>
      <kbd style={kbdStyle}>↓</kbd>
      <span className="blink" style={{ color: 'var(--amber)' }}>▌</span>
    </div>
  )
}

const kbdStyle: React.CSSProperties = {
  display: 'inline-block',
  padding: '2px 6px',
  border: '1px solid var(--amber-border)',
  background: 'rgba(255,101,0,0.08)',
  color: 'var(--amber)',
  fontFamily: 'inherit',
  fontSize: 9,
  letterSpacing: '0.1em',
  minWidth: 16,
  textAlign: 'center',
}
