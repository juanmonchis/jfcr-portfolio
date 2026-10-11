// three.js lights use physical units: a front-facing face gets roughly (ambient + key·cosθ) / π of its albedo,
// so intensities are scaled by π to make the covers read at their true brightness.
export default function BookshelfLighting() {
  return (
    <>
      <ambientLight intensity={0.45 * Math.PI} color="#f2eef8" />
      <directionalLight
        position={[5, 8, 5]}
        intensity={1.2 * Math.PI}
        color="#ffffff"
        castShadow
      />
      <directionalLight
        position={[-4, 2, -3]}
        intensity={0.3 * Math.PI}
        color="#8888cc"
      />
      <pointLight position={[0, 0, 6]} intensity={0.4 * Math.PI} color="#ffffff" />
    </>
  )
}
