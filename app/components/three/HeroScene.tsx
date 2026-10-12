"use client";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, MeshDistortMaterial, Points, PointMaterial } from "@react-three/drei";
import { useRef, useMemo } from "react";
import { useTheme } from "@/app/components/layout/ThemeProvider";
import * as THREE from "three";

function AnimatedTorus({ light }: { light: boolean }) {
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
          color={light ? "#15803d" : "#16a34a"}
          roughness={light ? 0.35 : 0.2}
          metalness={light ? 0.5 : 0.9}
          distort={0.35}
          speed={2}
          clearcoat={1}
          clearcoatRoughness={0.1}
        />
      </mesh>

      {/* Anneau filaire extérieur 1 */}
      <mesh ref={ring1Ref}>
        <torusGeometry args={[2.5, 0.02, 16, 100]} />
        <meshBasicMaterial
          color={light ? "#16a34a" : "#4ade80"}
          wireframe
          opacity={light ? 0.5 : 0.3}
          transparent
        />
      </mesh>

      {/* Anneau filaire extérieur 2 */}
      <mesh ref={ring2Ref}>
        <torusGeometry args={[2.8, 0.015, 16, 100]} />
        <meshBasicMaterial
          color={light ? "#15803d" : "#22c55e"}
          wireframe
          opacity={light ? 0.35 : 0.2}
          transparent
        />
      </mesh>
    </group>
  );
}

// Nuée de 1800 Particules orbitales
function ParticleField({ light }: { light: boolean }) {
  const pointsRef = useRef<THREE.Points>(null);
  const count = 1800;

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);

    // Générateur pseudo-aléatoire déterministe (mulberry32).
    // Évite Math.random() au rendu (fonction impure) et garantit
    // un résultat identique côté serveur et client (pas de mismatch).
    let seed = 0x2f6e2b1;
    const random = () => {
      seed = (seed + 0x6d2b79f5) | 0;
      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };

    for (let i = 0; i < count; i++) {
      // Distribution sphérique autour de la scène 3D
      const u = random();
      const v = random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = 3.5 + random() * 1.5; // Rayon orbital entre 3.5 et 5

      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
    }
    return pos;
  }, [count]);

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
        // Sur fond clair, le mélange additif rendrait les particules invisibles :
        // on passe en mélange normal avec un vert plus soutenu.
        color={light ? "#15803d" : "#4ade80"}
        size={light ? 0.03 : 0.04}
        sizeAttenuation={true}
        depthWrite={false}
        blending={light ? THREE.NormalBlending : THREE.AdditiveBlending}
      />
    </Points>
  );
}

// Lueur ambiante en arrière-plan de la scène
function AmbientGlow({ light }: { light: boolean }) {
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
      <meshBasicMaterial
        color={light ? "#bbf7d0" : "#14532d"}
        side={THREE.BackSide}
        opacity={light ? 0.18 : 0.08}
        transparent
      />
    </mesh>
  );
}

export function HeroScene() {
  const { theme } = useTheme();
  // Par défaut (SSR / thème sombre) on garde le rendu sombre d'origine.
  const light = theme === "light";

  return (
    <div className="absolute inset-0 w-full h-full">
      <Canvas camera={{ position: [0, 0, 6.5], fov: 50 }} dpr={[1, 2]}>
        <ambientLight intensity={light ? 0.9 : 0.4} />
        <pointLight
          position={[10, 10, 10]}
          intensity={light ? 1.8 : 1.5}
          color={light ? "#16a34a" : "#4ade80"}
        />
        <directionalLight position={[-5, 5, 5]} intensity={light ? 1.4 : 1} color="#ffffff" />
        <spotLight
          position={[0, -10, 0]}
          intensity={light ? 0.5 : 0.8}
          color={light ? "#86efac" : "#14532d"}
        />

        <AnimatedTorus light={light} />
        <ParticleField light={light} />
        <AmbientGlow light={light} />

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
