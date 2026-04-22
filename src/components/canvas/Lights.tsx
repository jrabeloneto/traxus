/**
 * Dual-polarity lighting: amber on hot mechanical parts, cyan on electronics.
 * Ambient kept near-zero so the drama survives.
 */
export function Lights() {
  return (
    <>
      <pointLight position={[3, 2, 2]} color="#FF8000" intensity={8} distance={12} decay={1.8} />
      <pointLight position={[-3, -1, 1]} color="#00B4C8" intensity={4} distance={10} decay={1.8} />
      <pointLight position={[0, -3, -3]} color="#FF4000" intensity={2.5} distance={9} decay={1.8} />
      <ambientLight intensity={0.05} color="#221510" />
    </>
  )
}
