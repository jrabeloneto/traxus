interface Props {
  lines: string[]
  width?: number // character width (default 54)
  color?: string
}

/**
 * Renders an ASCII-bordered block like:
 *   ***********************************************
 *   *** TRAXUS // BRAND DEVELOPMENT OPS          ***
 *   *** REPORT ID: SYSTEM-DELTA-412              ***
 *   ***********************************************
 */
export function AsciiBlock({ lines, width = 54, color = 'var(--amber)' }: Props) {
  const bar = '*'.repeat(width)
  const formatted = lines.map((line) => {
    const upper = line.toUpperCase()
    const body = upper.length > width - 8
      ? upper.slice(0, width - 8)
      : upper.padEnd(width - 8, ' ')
    return `*** ${body} ***`
  })

  const text = [bar, ...formatted, bar].join('\n')

  return (
    <pre
      style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 11,
        letterSpacing: '0.05em',
        lineHeight: 1.35,
        color,
        whiteSpace: 'pre',
        margin: 0,
      }}
    >
      {text}
    </pre>
  )
}
