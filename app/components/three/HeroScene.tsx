"use client";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, MeshDistortMaterial, Points, PointMaterial } from "@react-three/drei";
import { useRef, useMemo } from "react";
import * as THREE from "three";

function AnimatedTorus() {
  const torusRef = useRef<THREE.Mesh>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const elapsedTime = state.clock.getElapsedTime();

    if (torusRef.current) {
      torusRef.current.rotation.x = elapsedTime * 0.2;
      torusRef.current.rotation.y = elapsedTime * 0.25;
    }
    if (ring1Ref.current) {
      ring1Ref.current.rotation.y = -elapsedTime * 0.15;
      ring1Ref.current.rotation.x = elapsedTime * 0.05;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.z = elapsedTime * 0.1;
      ring2Ref.current.rotation.y = elapsedTime * 0.2;
    }
  });

  return (
    <group scale={1.1}>
      {/* Tore central distordu métallique */}
      <mesh ref={torusRef}>
        <torusGeometry args={[1.6, 0.45, 64, 128]} />
        <MeshDistortMaterial
          color="#16a34a"
          roughness={0.2}
          metalness={0.9}
          distort={0.35}
          speed={2}
          clearcoat={1}
          clearcoatRoughness={0.1}
        />
      </mesh>

      {/* Anneau filaire extérieur 1 */}
      <mesh ref={ring1Ref}>
        <torusGeometry args={[2.5, 0.02, 16, 100]} />
        <meshBasicMaterial color="#4ade80" wireframe opacity={0.3} transparent />
      </mesh>

      {/* Anneau filaire extérieur 2 */}
      <mesh ref={ring2Ref}>
        <torusGeometry args={[2.8, 0.015, 16, 100]} />
        <meshBasicMaterial color="#22c55e" wireframe opacity={0.2} transparent />
      </mesh>
    </group>
  );
}

// Nuée de 1800 Particules orbitales
function ParticleField() {
  const pointsRef = useRef<THREE.Points>(null);
  const count = 1800;

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // Distribution sphérique autour de la scène 3D
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = 3.5 + Math.random() * 1.5; // Rayon orbital entre 3.5 et 5

      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.getElapsedTime() * 0.05;
      pointsRef.current.rotation.x = state.clock.getElapsedTime() * 0.02;
    }
  });

  return (
    <Points ref={pointsRef} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#4ade80"
        size={0.04}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}

// Lueur ambiante en arrière-plan de la scène
function AmbiantGlow() {
  const glowRef = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (glowRef.current) {
      const scale = 5.5 + Math.sin(state.clock.getElapsedTime() * 1.5) * 0.2;
      glowRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <mesh ref={glowRef}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshBasicMaterial color="#14532d" side={THREE.BackSide} opacity={0.08} transparent />
    </mesh>
  );
}

export function HeroScene() {
  return (
    <div className="absolute inset-0 w-full h-full">
      <Canvas camera={{ position: [0, 0, 6.5], fov: 50 }} dpr={[1, 2]}>
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={1.5} color="#4ade80" />
        <directionalLight position={[-5, 5, 5]} intensity={1} color="#ffffff" />
        <spotLight position={[0, -10, 0]} intensity={0.8} color="#14532d" />
        
        <AnimatedTorus() />
        <ParticleField />
        <AmbientGlow />
        
        <OrbitControls 
          enableZoom={false} 
          enablePan={false}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 1.5}
        />
      </Canvas>
    </div>
  );
}