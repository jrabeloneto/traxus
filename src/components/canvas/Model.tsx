import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import type { Group } from 'three'
import { MathUtils } from 'three'

/**
 * Procedural "industrial object" — composed of torus + cylinders + boxes.
 * Stand-in until a real GLB lands.
 *
 * Mouse parallax applies a subtle tilt to the whole group.
 */
export function Model() {
  const group = useRef<Group>(null)
  const { mouse } = useThree()

  useFrame((_, delta) => {
    const g = group.current
    if (!g) return
    g.rotation.y += delta * 0.15
    g.rotation.x = MathUtils.lerp(g.rotation.x, mouse.y * 0.25, 0.05)
    g.rotation.z = MathUtils.lerp(g.rotation.z, -mouse.x * 0.18, 0.05)
  })

  return (
    <group ref={group} position={[0, 0, 0]}>
      {/* Core torus — main ring body */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.25, 0.14, 24, 96]} />
        <meshStandardMaterial
          color="#241915"
          metalness={0.9}
          roughness={0.28}
          emissive="#140800"
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Inner ring (cyan electronics) */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.82, 0.035, 16, 72]} />
        <meshStandardMaterial
          color="#0a1a20"
          metalness={0.7}
          roughness={0.3}
          emissive="#00B4C8"
          emissiveIntensity={0.9}
        />
      </mesh>

      {/* Mechanical struts (8 arms) */}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (Math.PI * 2 / 8) * i
        const x = Math.cos(angle) * 1.0
        const z = Math.sin(angle) * 1.0
        return (
          <group key={i} position={[x, 0, z]} rotation={[0, -angle + Math.PI / 2, 0]}>
            {/* strut body */}
            <mesh>
              <boxGeometry args={[0.08, 0.2, 0.5]} />
              <meshStandardMaterial
                color="#1a0f0a"
                metalness={0.85}
                roughness={0.35}
                emissive="#3a1800"
                emissiveIntensity={0.35}
              />
            </mesh>
            {/* joint capsule */}
            <mesh position={[0, 0.18, 0]}>
              <cylinderGeometry args={[0.05, 0.05, 0.16, 12]} />
              <meshStandardMaterial
                color="#2a1a10"
                metalness={0.95}
                roughness={0.2}
                emissive="#FF6500"
                emissiveIntensity={0.6}
              />
            </mesh>
          </group>
        )
      })}

      {/* Central hub — amber hot core */}
      <mesh>
        <icosahedronGeometry args={[0.22, 1]} />
        <meshStandardMaterial
          color="#1a0d07"
          metalness={0.6}
          roughness={0.45}
          emissive="#FF8000"
          emissiveIntensity={1.4}
        />
      </mesh>

      {/* Outer armored plates */}
      {Array.from({ length: 4 }).map((_, i) => {
        const angle = (Math.PI * 2 / 4) * i + Math.PI / 4
        const r = 1.55
        return (
          <mesh
            key={`plate-${i}`}
            position={[Math.cos(angle) * r, 0, Math.sin(angle) * r]}
            rotation={[0, -angle + Math.PI / 2, 0]}
          >
            <boxGeometry args={[0.35, 0.08, 0.08]} />
            <meshStandardMaterial
              color="#0f0806"
              metalness={0.9}
              roughness={0.25}
            />
          </mesh>
        )
      })}
    </group>
  )
}
