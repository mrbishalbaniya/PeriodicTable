"use client";

import { useRef, useMemo, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface ElectronShellsProps {
  shells: number[];
  isExcited?: boolean;
  emissionColor?: string | null;
}

const SHELL_COLORS = [
  "#00ffaa",
  "#00ccff",
  "#ff66aa",
  "#ffaa00",
  "#aa66ff",
  "#66ff66",
  "#ff6644",
];

function OrbitalRing({ radius, color }: { radius: number; color: string }) {
  const points = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    const segments = 128;
    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI * 2;
      pts.push(
        new THREE.Vector3(Math.cos(angle) * radius, 0, Math.sin(angle) * radius)
      );
    }
    return pts;
  }, [radius]);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry().setFromPoints(points);
    return geo;
  }, [points]);

  const lineRef = useRef<THREE.Line>(null);

  return (
    <primitive object={new THREE.Line(geometry)} ref={lineRef}>
      <lineBasicMaterial
        color={color}
        transparent
        opacity={0.2}
        linewidth={1}
      />
    </primitive>
  );
}

/**
 * Single electron shell with excitation support.
 * When excited, the outermost shell's first electron
 * smoothly jumps to a higher radius and then falls back.
 */
function ElectronShell({
  shellIndex,
  electronCount,
  color,
  isOutermost,
  isExcited,
  emissionColor,
}: {
  shellIndex: number;
  electronCount: number;
  color: string;
  isOutermost: boolean;
  isExcited: boolean;
  emissionColor: string | null;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const excitedElRef = useRef<THREE.Group>(null);
  const baseRadius = (shellIndex + 1) * 2;
  const speed = 0.4 / (shellIndex + 1);
  const excitedRadius = baseRadius + 2; // Jump one shell up

  // Track animation state for the excited electron
  const [exciteProgress, setExciteProgress] = useState(0);
  const animating = useRef(false);

  // Tilted ring planes for visual variety
  const tiltX = (shellIndex % 3) * 0.15;
  const tiltZ = ((shellIndex + 1) % 2) * 0.1;

  const electrons = useMemo(() => {
    const arr = [];
    for (let i = 0; i < electronCount; i++) {
      const angle = (i / electronCount) * Math.PI * 2;
      arr.push({ angle, index: i });
    }
    return arr;
  }, [electronCount]);

  // Smooth excitation animation via useFrame
  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * speed;
    }

    if (!isOutermost || !excitedElRef.current) return;

    if (isExcited && exciteProgress < 1) {
      // Rising phase — smooth ease-out
      const newP = Math.min(exciteProgress + delta * 1.2, 1);
      setExciteProgress(newP);
    } else if (!isExcited && exciteProgress > 0) {
      // Falling phase — slightly faster
      const newP = Math.max(exciteProgress - delta * 1.8, 0);
      setExciteProgress(newP);
    }

    if (isOutermost && excitedElRef.current && exciteProgress > 0) {
      // Ease curve for smooth movement
      const ease = exciteProgress < 0.5
        ? 2 * exciteProgress * exciteProgress
        : 1 - Math.pow(-2 * exciteProgress + 2, 2) / 2;
      const currentRadius = baseRadius + (excitedRadius - baseRadius) * ease;

      // Recalculate position for the excited electron
      const angle = electrons[0]?.angle ?? 0;
      const x = Math.cos(angle + groupRef.current!.rotation.y) * currentRadius;
      const z = Math.sin(angle + groupRef.current!.rotation.y) * currentRadius;
      excitedElRef.current.position.set(x, 0, z);
    }
  });

  return (
    <group rotation={[tiltX, 0, tiltZ]}>
      <OrbitalRing radius={baseRadius} color={color} />
      {/* Show excited orbital ring */}
      {isOutermost && exciteProgress > 0 && (
        <OrbitalRing radius={excitedRadius} color={emissionColor || color} />
      )}

      <group ref={groupRef}>
        {electrons.map((e, idx) => {
          const x = Math.cos(e.angle) * baseRadius;
          const z = Math.sin(e.angle) * baseRadius;

          // The first electron of the outermost shell gets excited
          const isExcitedElectron = isOutermost && idx === 0 && exciteProgress > 0;

          if (isExcitedElectron) {
            // Render excited electron outside the rotating group
            // (its position is manually set in useFrame)
            return null;
          }

          return (
            <group key={`electron-${shellIndex}-${e.index}`} position={[x, 0, z]}>
              <mesh>
                <sphereGeometry args={[0.08, 16, 16]} />
                <meshStandardMaterial
                  color={color}
                  emissive={color}
                  emissiveIntensity={0.8}
                  roughness={0.1}
                  metalness={0.5}
                />
              </mesh>
              {/* Electron glow */}
              <mesh>
                <sphereGeometry args={[0.16, 16, 16]} />
                <meshStandardMaterial
                  color={color}
                  transparent
                  opacity={0.15}
                  side={THREE.BackSide}
                />
              </mesh>
            </group>
          );
        })}
      </group>

      {/* Excited electron — rendered outside rotating group for independent position control */}
      {isOutermost && exciteProgress > 0 && (
        <group ref={excitedElRef}>
          <mesh>
            <sphereGeometry args={[0.1, 16, 16]} />
            <meshStandardMaterial
              color={emissionColor || color}
              emissive={emissionColor || color}
              emissiveIntensity={2 + exciteProgress * 3}
              roughness={0.05}
              metalness={0.5}
              toneMapped={false}
            />
          </mesh>
          {/* Enhanced glow when excited */}
          <mesh>
            <sphereGeometry args={[0.28, 16, 16]} />
            <meshStandardMaterial
              color={emissionColor || color}
              transparent
              opacity={0.3 * exciteProgress}
              side={THREE.BackSide}
              emissive={emissionColor || color}
              emissiveIntensity={1.5}
              toneMapped={false}
            />
          </mesh>
        </group>
      )}
    </group>
  );
}

export default function ElectronShells({
  shells,
  isExcited = false,
  emissionColor = null,
}: ElectronShellsProps) {
  const outermostIndex = shells.length - 1;

  return (
    <group>
      {shells.map((count, i) => (
        <ElectronShell
          key={`shell-${i}`}
          shellIndex={i}
          electronCount={count}
          color={SHELL_COLORS[i % SHELL_COLORS.length]}
          isOutermost={i === outermostIndex}
          isExcited={isExcited}
          emissionColor={emissionColor}
        />
      ))}
    </group>
  );
}
