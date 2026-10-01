"use client";

import { Suspense, useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF, Center } from "@react-three/drei";
import * as THREE from "three";

function Model({ src }: { src: string }) {
  const { scene } = useGLTF(src);
  const cloned = useMemo(() => scene.clone(true), [scene]);
  return (
    <Center>
      <primitive object={cloned} />
    </Center>
  );
}

function Spinner() {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame((_, d) => {
    ref.current.rotation.x += d * 0.9;
    ref.current.rotation.y += d * 1.4;
  });
  return (
    <mesh ref={ref}>
      <octahedronGeometry args={[0.5, 0]} />
      <meshStandardMaterial color="#DDED3C" wireframe />
    </mesh>
  );
}

export default function MiniViewerCanvas({ src, autoRotate = true }: { src: string; autoRotate?: boolean }) {
  return (
    <Canvas dpr={[1, 2]} camera={{ position: [0, 1, 4], fov: 45 }}>
      <ambientLight intensity={1} />
      <directionalLight position={[5, 8, 5]} intensity={1.5} />
      <directionalLight position={[-5, 2, -5]} intensity={0.4} />
      <Suspense fallback={<Spinner />}>
        <Model src={src} />
      </Suspense>
      <OrbitControls
        autoRotate={autoRotate}
        autoRotateSpeed={1.5}
        enablePan={false}
        minDistance={1.5}
        maxDistance={12}
        minPolarAngle={Math.PI * 0.1}
        maxPolarAngle={Math.PI * 0.85}
      />
    </Canvas>
  );
}
