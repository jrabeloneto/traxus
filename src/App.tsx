import { useState } from 'react'
import { StatusBar } from './components/ui/StatusBar'
import { Ticker } from './components/ui/Ticker'
import { FloatingDataOverlay } from './components/ui/FloatingDataOverlay'
import { DiagonalBars } from './components/ui/DiagonalBars'
import { ScanSweep } from './components/ui/ScanSweep'
import { FlashObjects } from './components/ui/FlashObjects'
import { NoiseDropout } from './components/ui/NoiseDropout'
import { ChapterMarker } from './components/ui/ChapterMarker'
import { PageSwap } from './components/ui/PageSwap'
import { PageStack } from './components/ui/PageStack'
import { SideNav } from './components/ui/SideNav'
import { InputHint } from './components/ui/InputHint'
import { ClearanceOverride } from './components/ui/ClearanceOverride'
import { Boot } from './components/sections/Boot'
import { Hero } from './components/sections/Hero'
import { Manifesto } from './components/sections/Manifesto'
import { ParticleConstructSection } from './components/sections/ParticleConstructSection'
import { IdentityFlash } from './components/sections/IdentityFlash'
import { DataSpecs } from './components/sections/DataSpecs'
import { Terminal } from './components/sections/Terminal'
import { SectorMap } from './components/sections/SectorMap'
import { MissionLog } from './components/sections/MissionLog'
import { Contact } from './components/sections/Contact'
import { EndTransmission } from './components/sections/EndTransmission'
import { useFlashSequence } from './hooks/useFlashSequence'
import { useScrollTransitions } from './hooks/useScrollTransitions'

export default function App() {
  const [booted, setBooted] = useState(false)

  // Periodic ambient flash (every ~9s)
  const flashRef = useFlashSequence(9, 3)

  // Scroll-boundary transitions between sections
  useScrollTransitions(booted)

  return (
    <>
      <StatusBar />

      {/* Fullscreen flash overlay — driven by both ambient and scroll triggers */}
      <div ref={flashRef} className="flash-overlay" />

      {/* Page-swap loading slab — fires on section change */}
      <PageSwap />

      {/* Chapter marker — fullscreen phase number flash on section entry */}
      <ChapterMarker />

      {/* ── Persistent global animation layers ── */}
      <FloatingDataOverlay count={34} flickerInterval={220} />
      <DiagonalBars minInterval={1500} maxInterval={4500} duration={85} />
      <ScanSweep minInterval={4000} maxInterval={10000} sweepDuration={0.38} />
      <FlashObjects maxSimult={2} minInterval={350} maxInterval={1600} minDuration={55} maxDuration={260} />
      <NoiseDropout minInterval={2000} maxInterval={6500} duration={65} />

      {/* ── Content ── */}
      {!booted ? (
        <Boot onComplete={() => setBooted(true)} />
      ) : (
        <>
          <SideNav />
          <InputHint />
          <ClearanceOverride />
          <PageStack pages={[
            { id: 'hero',      el: <Hero /> },
            { id: 'manifesto', el: <Manifesto /> },
            { id: 'construct', el: <ParticleConstructSection /> },
            { id: 'identity',  el: <IdentityFlash /> },
            { id: 'specs',     el: <DataSpecs /> },
            { id: 'terminal',  el: <Terminal /> },
            { id: 'sectors',   el: <SectorMap /> },
            { id: 'log',       el: <MissionLog /> },
            { id: 'contact',   el: <Contact /> },
            { id: 'end',       el: <EndTransmission /> },
          ]} />
        </>
      )}

      <Ticker position="bottom" />
    </>
  )
}
