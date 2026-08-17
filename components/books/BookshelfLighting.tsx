export default function BookshelfLighting() {
  return (
    <>
      <ambientLight intensity={0.6} color="#e8e4f0" />
      <directionalLight
        position={[5, 8, 5]}
        intensity={1.2}
        color="#ffffff"
        castShadow
      />
      <directionalLight
        position={[-4, 2, -3]}
        intensity={0.3}
        color="#8888cc"
      />
      <pointLight position={[0, 0, 6]} intensity={0.4} color="#ffffff" />
    </>
  )
}
