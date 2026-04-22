import { Canvas } from '@react-three/fiber'
import { ACESFilmicToneMapping } from 'three'
import { Suspense, type ReactNode } from 'react'

interface Props {
  children: ReactNode
  cameraPosition?: [number, number, number]
  fov?: number
}

/**
 * R3F Canvas wrapper with project-wide defaults.
 * No tone-map blow-out, no gamma washout — tight dark range.
 */
export function Scene({ children, cameraPosition = [0, 0, 6], fov = 40 }: Props) {
  return (
    <Canvas
      gl={{
        antialias: true,
        toneMapping: ACESFilmicToneMapping,
        toneMappingExposure: 0.9,
        alpha: false,
        powerPreference: 'high-performance',
      }}
      camera={{ position: cameraPosition, fov, near: 0.1, far: 100 }}
      dpr={[1, 2]}
      style={{
        position: 'absolute',
        inset: 0,
        background: '#000',
      }}
    >
      <color attach="background" args={['#000000']} />
      <Suspense fallback={null}>{children}</Suspense>
    </Canvas>
  )
}
