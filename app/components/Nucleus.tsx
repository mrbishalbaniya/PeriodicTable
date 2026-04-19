"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface NucleusProps {
  protons: number;
  neutrons: number;
  isStable: boolean;
}

function fibonacciSphere(count: number, radius: number): THREE.Vector3[] {
  const points: THREE.Vector3[] = [];
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));

  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1 || 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = goldenAngle * i;
    points.push(
      new THREE.Vector3(
        Math.cos(theta) * r * radius,
        y * radius,
        Math.sin(theta) * r * radius
      )
    );
  }
  return points;
}

export default function Nucleus({
  protons,
  neutrons,
  isStable,
}: NucleusProps) {
  const groupRef = useRef<THREE.Group>(null);
  const total = protons + neutrons;
  const nucleonRadius = 0.12;
  const clusterRadius = Math.max(
    0.15,
    Math.pow(total, 1 / 3) * nucleonRadius * 1.6
  );

  const positions = useMemo(
    () => fibonacciSphere(total, clusterRadius),
    [total, clusterRadius]
  );

  // Radioactive jitter effect
  useFrame((_, delta) => {
    if (!groupRef.current) return;

    if (!isStable) {
      const intensity = 0.04;
      const speed = 15;
      const time = performance.now() * 0.001 * speed;
      groupRef.current.position.x =
        Math.sin(time * 1.7) * intensity +
        Math.sin(time * 3.1) * intensity * 0.5;
      groupRef.current.position.y =
        Math.cos(time * 2.3) * intensity +
        Math.cos(time * 4.7) * intensity * 0.4;
      groupRef.current.position.z =
        Math.sin(time * 1.9 + 1) * intensity * 0.6;
    } else {
      // Smoothly return to origin
      groupRef.current.position.x *= 0.9;
      groupRef.current.position.y *= 0.9;
      groupRef.current.position.z *= 0.9;
    }
  });

  return (
    <group ref={groupRef}>
      {positions.map((pos, i) => {
        const isProton = i < protons;
        return (
          <mesh key={`nucleon-${i}`} position={pos}>
            <sphereGeometry args={[nucleonRadius, 16, 16]} />
            <meshStandardMaterial
              color={isProton ? "#ff4444" : "#4488ff"}
              roughness={0.3}
              metalness={0.2}
              emissive={isProton ? "#441111" : "#111144"}
              emissiveIntensity={isStable ? 0.3 : 0.6}
            />
          </mesh>
        );
      })}
      {/* Glow sphere around nucleus */}
      <mesh>
        <sphereGeometry args={[clusterRadius * 1.3, 32, 32]} />
        <meshStandardMaterial
          color={isStable ? "#ffffff" : "#ff4444"}
          transparent
          opacity={isStable ? 0.04 : 0.08}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Radioactive danger glow */}
      {!isStable && (
        <mesh>
          <sphereGeometry args={[clusterRadius * 1.8, 32, 32]} />
          <meshStandardMaterial
            color="#ff2222"
            transparent
            opacity={0.03}
            side={THREE.BackSide}
          />
        </mesh>
      )}
    </group>
  );
}
