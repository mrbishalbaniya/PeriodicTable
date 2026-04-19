"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface PhotonProps {
  /** Direction: 'in' = flies toward origin, 'out' = flies away */
  direction: "in" | "out";
  /** Hex color for the photon glow */
  color: string;
  /** Called when the photon finishes its journey */
  onComplete?: () => void;
}

/**
 * Animated glowing photon sphere that flies in toward the nucleus
 * or out away from it. Uses useFrame for smooth animation.
 */
export default function Photon({ direction, color, onComplete }: PhotonProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const progress = useRef(0);
  const completed = useRef(false);

  // Incoming: start far, end at origin. Outgoing: start at origin, fly out.
  const startPos = direction === "in"
    ? new THREE.Vector3(8, 4, 6)
    : new THREE.Vector3(0, 0, 0);
  const endPos = direction === "in"
    ? new THREE.Vector3(0, 0, 0)
    : new THREE.Vector3(-7, 5, -5);

  useFrame((_, delta) => {
    if (!meshRef.current || completed.current) return;

    progress.current += delta * (direction === "in" ? 1.4 : 0.9);
    const t = Math.min(progress.current, 1);

    // Smooth ease-in-out
    const ease = t < 0.5
      ? 2 * t * t
      : 1 - Math.pow(-2 * t + 2, 2) / 2;

    meshRef.current.position.lerpVectors(startPos, endPos, ease);

    // Pulse scale
    const scale = 1 + Math.sin(progress.current * 12) * 0.3;
    meshRef.current.scale.setScalar(scale);

    if (t >= 1 && !completed.current) {
      completed.current = true;
      onComplete?.();
    }
  });

  return (
    <mesh ref={meshRef} position={startPos.toArray()}>
      {/* Core */}
      <sphereGeometry args={[0.12, 16, 16]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={3}
        toneMapped={false}
      />
      {/* Outer glow */}
      <mesh>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial
          color={color}
          transparent
          opacity={0.25}
          side={THREE.BackSide}
          emissive={color}
          emissiveIntensity={1.5}
          toneMapped={false}
        />
      </mesh>
    </mesh>
  );
}
