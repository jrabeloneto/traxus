import { useEffect, useRef, useState } from 'react'
import { useScrollEntry } from '../../hooks/useScrollEntry'
import { useExitGlitch } from '../../hooks/useExitGlitch'

type Line = { kind: 'in' | 'out' | 'sys' | 'err'; text: string }

const HELP = [
  'AVAILABLE COMMANDS:',
  '  help             — list commands',
  '  status           — system status',
  '  whoami           — operator identity',
  '  scan [sector]    — scan sector (try "scan delta-412")',
  '  deploy [payload] — queue deployment',
  '  manifest         — view manifest',
  '  purge            — wipe terminal buffer',
  '  secret           — ???',
]

function ts() {
  const d = new Date()
  return d.toISOString().replace('T', ' ').slice(0, 19)
}

function run(cmd: string): Line[] {
  const c = cmd.trim().toLowerCase()
  if (!c) return []
  if (c === 'help') return HELP.map(t => ({ kind: 'out', text: t } as Line))
  if (c === 'status')
    return [
      { kind: 'out', text: `[${ts()}] SIG: NOMINAL — ALL SUBSYSTEMS GREEN` },
      { kind: 'out', text: 'UPLINK: ESTABLISHED · LATENCY 48ms · PAYLOAD: READY' },
      { kind: 'out', text: 'CLEARANCE: DELTA-412 · SECTOR: SP-BR · ALT 744m' },
    ]
  if (c === 'whoami')
    return [
      { kind: 'out', text: 'OPERATOR: [REDACTED]' },
      { kind: 'out', text: 'ROLE: FIELD OP · DESIGN OPERATIONS // TRAXUS' },
      { kind: 'out', text: 'AUTH: ARC.SPECTER.ONE' },
    ]
  if (c.startsWith('scan'))
    return [
      { kind: 'sys', text: `>>> INITIATING SCAN · target = ${c.split(' ').slice(1).join(' ') || '(default)'}` },
      { kind: 'out', text: '[████████░░] 80%' },
      { kind: 'out', text: '[██████████] 100%' },
      { kind: 'out', text: 'RESULT: 3 OBJECTS FOUND · 1920 POINTS · SIG CLASS: AMBER' },
    ]
  if (c.startsWith('deploy'))
    return [
      { kind: 'sys', text: `>>> DEPLOY QUEUE · payload = ${c.split(' ').slice(1).join(' ') || 'SPECTER-ONE'}` },
      { kind: 'out', text: 'AUTH CHECK .......... [OK]' },
      { kind: 'out', text: 'SECTOR LOCK ......... [OK]' },
      { kind: 'out', text: 'WARHEAD: [DESIGN / INDUSTRIAL] · ETA IMMEDIATE' },
      { kind: 'out', text: '⚠  CONFIRM WITH `deploy confirm`' },
    ]
  if (c === 'manifest')
    return [
      { kind: 'out', text: 'WE DO NOT DECORATE, WE DEPLOY.' },
      { kind: 'out', text: 'WE DO NOT ITERATE, WE CONSTRUCT.' },
      { kind: 'out', text: 'WE DO NOT PITCH, WE DELIVER.' },
    ]
  if (c === 'purge') return [{ kind: 'sys', text: '__PURGE__' }]
  if (c === 'secret')
    return [
      { kind: 'err', text: '╔══════════════════════════════════╗' },
      { kind: 'err', text: '║  ⚠  CLEARANCE INSUFFICIENT       ║' },
      { kind: 'err', text: '║     TRY AGAIN IN +48h           ║' },
      { kind: 'err', text: '╚══════════════════════════════════╝' },
    ]
  return [{ kind: 'err', text: `ERR: UNKNOWN COMMAND "${cmd}" — type "help"` }]
}

export function Terminal() {
  const ref = useScrollEntry({ flashBefore: true, staggerMs: 60, threshold: 0.1 })
  const rootRef = ref as React.RefObject<HTMLElement>
  useExitGlitch(rootRef, 'terminal')

  const [lines, setLines] = useState<Line[]>([
    { kind: 'sys', text: `[${ts()}] TRAXUS TERMINAL v4.12 · READY` },
    { kind: 'sys', text: 'TYPE "help" FOR COMMAND LIST' },
  ])
  const [input, setInput] = useState('')
  const [history, setHistory] = useState<string[]>([])
  const [histIdx, setHistIdx] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const bufRef = useRef<HTMLDivElement>(null)

  // Autofocus when section is scrolled into view
  useEffect(() => {
    const el = rootRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) inputRef.current?.focus() }),
      { threshold: 0.5 },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [rootRef])

  // Autoscroll buffer on new lines
  useEffect(() => {
    const el = bufRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [lines])

  function submit() {
    const cmd = input
    setInput('')
    if (!cmd.trim()) return
    setHistory(h => [...h, cmd].slice(-50))
    setHistIdx(-1)
    const out = run(cmd)
    if (out.some(o => o.text === '__PURGE__')) {
      setLines([{ kind: 'sys', text: `[${ts()}] BUFFER CLEARED` }])
    } else {
      setLines(l => [...l, { kind: 'in', text: `> ${cmd}` }, ...out])
    }
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') { e.preventDefault(); submit() }
    else if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (!history.length) return
      const next = histIdx === -1 ? history.length - 1 : Math.max(0, histIdx - 1)
      setHistIdx(next)
      setInput(history[next])
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (histIdx === -1) return
      const next = histIdx + 1
      if (next >= history.length) { setHistIdx(-1); setInput(''); return }
      setHistIdx(next)
      setInput(history[next])
    }
  }

  return (
    <section
      id="terminal"
      data-section
      ref={rootRef}
      style={{
        position: 'relative', background: '#000',
        padding: '100px 48px', display: 'grid',
        gridTemplateRows: 'auto 1fr', gap: 16,
      }}
    >
      <header data-entry style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <div>
          <div className="type-mono" style={{ fontSize: 10, color: 'var(--amber)', letterSpacing: '0.3em' }}>
            [ PHASE 06 / COMMAND INTERFACE ]
          </div>
          <h2 data-glitch className="type-display" style={{ fontSize: 'clamp(42px, 5vw, 72px)', color: 'var(--text)', lineHeight: 0.9, marginTop: 8 }}>
            Open a Channel.
          </h2>
        </div>
        <div className="type-mono" style={{ fontSize: 10, color: 'var(--text-dim)', letterSpacing: '0.2em', textAlign: 'right' }}>
          <div>SESSION: {Date.now().toString(36).toUpperCase()}</div>
          <div>UPLINK: <span style={{ color: 'var(--amber)' }}>GREEN</span></div>
        </div>
      </header>

      <div
        data-entry
        onClick={() => inputRef.current?.focus()}
        style={{
          border: '1px solid var(--amber-border)',
          background: 'rgba(5,5,10,0.7)',
          padding: '20px 22px',
          display: 'flex', flexDirection: 'column', gap: 0,
          fontFamily: 'var(--font-mono)', fontSize: 13,
          letterSpacing: '0.05em', lineHeight: 1.55,
          minHeight: 0,
          boxShadow: 'inset 0 0 120px rgba(255,101,0,0.04)',
        }}
      >
        <div ref={bufRef} data-scroll-lock style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', paddingRight: 6 }}>
          {lines.map((ln, i) => (
            <div key={i} style={{
              color:
                ln.kind === 'in' ? 'var(--amber)' :
                ln.kind === 'sys' ? 'var(--cyan)' :
                ln.kind === 'err' ? '#FF4040' :
                'var(--text)',
              whiteSpace: 'pre-wrap',
            }}>
              {ln.text}
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, borderTop: '1px solid rgba(255,101,0,0.2)', paddingTop: 10, marginTop: 10 }}>
          <span style={{ color: 'var(--amber)' }}>&gt;</span>
          <input
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            spellCheck={false}
            autoComplete="off"
            style={{
              flex: 1, background: 'transparent', border: 'none', outline: 'none',
              fontFamily: 'inherit', fontSize: 'inherit', color: 'var(--text)',
              caretColor: 'var(--amber)',
            }}
            placeholder='type "help"'
          />
          <span className="blink" style={{ color: 'var(--amber)' }}>▌</span>
        </div>
      </div>
    </section>
  )
}
