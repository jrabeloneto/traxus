import type { CSSProperties } from 'react'

interface Props {
  text: string
  side?: 'left' | 'right'
  top?: number | string
  color?: string
  size?: number
  style?: CSSProperties
}

/**
 * Rotated 90° monospace label pinned to a screen edge.
 * Using transform rather than writing-mode so spacing stays predictable.
 */
export function VerticalText({
  text,
  side = 'left',
  top = '50%',
  color = 'var(--amber)',
  size = 9,
  style,
}: Props) {
  return (
    <div
      aria-hidden
      style={{
        position: 'fixed',
        [side]: 14,
        top,
        zIndex: 900,
        transform: `rotate(${side === 'left' ? -90 : 90}deg) translateX(${side === 'left' ? '-50%' : '50%'})`,
        transformOrigin: side === 'left' ? 'left top' : 'right top',
        fontFamily: 'var(--font-mono)',
        fontSize: size,
        letterSpacing: '0.32em',
        textTransform: 'uppercase',
        color,
        whiteSpace: 'nowrap',
        pointerEvents: 'none',
        ...style,
      }}
    >
      {text}
    </div>
  )
}
