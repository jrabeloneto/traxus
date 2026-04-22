interface Props {
  progress: number // 0..1
  bottom?: number | string
}

/**
 * Monospace status line synced with the particle construct's progress.
 *   [ INITIALIZING... ]         ← progress < 0.05
 *   [ RENDERING OBJECT... 43% ] ← 0.05–0.5
 *   [ CONSTRUCT: 87% COMPLETE ] ← 0.5–0.99
 *   [ OBJECT CONFIRMED ]        ← >= 0.99 (blinks)
 */
export function ConstructLabel({ progress, bottom = 48 }: Props) {
  const pct = Math.floor(progress * 100)

  const label =
    progress < 0.05
      ? '[ INITIALIZING... ]'
      : progress < 0.5
        ? `[ RENDERING OBJECT... ${pct}% ]`
        : progress < 0.99
          ? `[ CONSTRUCT: ${pct}% COMPLETE ]`
          : '[ OBJECT CONFIRMED ]'

  const isDone = progress >= 0.99

  return (
    <div
      style={{
        position: 'absolute',
        bottom,
        left: '50%',
        transform: 'translateX(-50%)',
        fontFamily: 'var(--font-mono)',
        fontSize: 11,
        color: 'var(--amber)',
        letterSpacing: '0.26em',
        textTransform: 'uppercase',
        zIndex: 20,
        pointerEvents: 'none',
        textShadow: '0 0 8px rgba(255,101,0,0.35)',
      }}
      className={isDone ? 'blink' : undefined}
    >
      {label}
    </div>
  )
}
